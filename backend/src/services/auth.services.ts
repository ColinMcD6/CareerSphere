import { APP_ORIGIN } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import verificationType from "../constants/verificationTyes";
import appAssert from "../utils/appAssert";
import { hashPass } from "../utils/auth_helpers/bcrypt";
import { afteronehour, DAY_LEFT, oneyearfromnow, weekfromnow } from "../utils/auth_helpers/calc";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/auth_helpers/emailTemplates";
import { refeshTokenOption, RefTokenPayload, signingToken, verifyToken } from "../utils/auth_helpers/jwt";
import { sendEmail } from "../utils/auth_helpers/sendEmail";
import userDAO from "../dao/user.dao";
import verificationDAO from "../dao/verification.dao";
import sessionDAO from "../dao/session.dao"

export type signupAccountFields = {
    username: string;
    email: string;
    password: string;
    user_role?: string;
}

export type loginAccountFields = {
    email: string;
    password: string;
    user_role?: string;
}

export const signup_account = async (data: signupAccountFields) => {
    // verify exisiting user doesnt exist
    const existUser = await userDAO.exists({
        email: data.email,
    });
    
    appAssert(
        !existUser, CONFLICT, "Account already exists!",
    )

    // if not then create the user
    const newuser = await userDAO.create({
        username: data.username, 
        email: data.email, 
        password: data.password, 
        userRole: data.user_role,
        education: data.user_role === "Candidate" ? [] : undefined,
        skills: data.user_role === "Candidate" ? [] : undefined,
        experience: data.user_role === "Candidate" ? [] : undefined,
        companyDetails: data.user_role === "Employer" ? "" : undefined,
        hiringDetails: data.user_role === "Employer" ? [] : undefined,
    });
    
    // create and send verification code to email
    const verificaion_codes = await verificationDAO.create({
        userId: newuser._id, 
        type: verificationType.emailVerification,
        expireAt: oneyearfromnow(),
    })
    // need to add send email
    const veirifyURL = `${APP_ORIGIN}/email/verify/${verificaion_codes._id}`;
    const { error }= await sendEmail({
        to: newuser.email,
        ...getVerifyEmailTemplate(veirifyURL)
    });

    if(error){
        console.log(error)
    }

    // create session and assign jwt token session (unit of time) is valid for 7days - use the access and refresh token for 7 days
    const newsession = await sessionDAO.create({
        userId: newuser._id,
        userAgent: data.user_role,
    })

    const refreshtoken = signingToken(
        {
            sessionId: newsession._id
        }, 
        refeshTokenOption
    );

    const accesstoken = signingToken(
        {
            userId: newuser._id,
            sessionId: newsession._id
        }
    )

    // return user account created
    return {
        newuser: newuser.removePassword(), accesstoken, refreshtoken
    };
}

export const login_account = async ({email, password, user_role}: loginAccountFields) => {
    // get the user email and check if the user exists
    const existUser = await userDAO.findOne({ email });
    appAssert(existUser, UNAUTHORIZED, "User Account does not exist !")
    // check the password
    const validPass = await existUser.checkPassword(password);
    appAssert(validPass, UNAUTHORIZED, "Invalid email or Password !")
    // create session, access tokens and refresh tokens
    const userId = existUser._id;
    const session = await sessionDAO.create({
        userId,
        user_role,
    })
    const refreshtoken = signingToken(
        {
            sessionId: session._id
        }, 
        refeshTokenOption
    );

    const accesstoken = signingToken(
        {
            userId: existUser._id,
            sessionId: session._id
        }
    )
    // return user
    return {
        newuser: existUser.removePassword(),
        accesstoken, 
        refreshtoken,
    }
}

export const refreshSessionToken = async (refreshToken: string) => {
    const {payload} = verifyToken<RefTokenPayload>(refreshToken, {
        secret: refeshTokenOption.token,
    })
    appAssert(payload, UNAUTHORIZED, "Token Missing to refresh session !")

    const session = await sessionDAO.findById(String(payload.sessionId));
    appAssert(session
        && session.expiredAt.getTime() > Date.now()
        , UNAUTHORIZED, "Session not valid anymore !");

    const refreshsessionNow = session.expiredAt.getTime() - Date.now() <= DAY_LEFT;
    if(refreshsessionNow){
        session.expiredAt = weekfromnow();
        await session.save();
    }

    const rerefreshToken = refreshsessionNow ? 
        signingToken(
            {
                sessionId: session._id
            }, 
            refeshTokenOption
        )
    :undefined

    const accesstoken = signingToken({
        userId: session.userId,
        sessionId: session._id,
    })

    return {
        accesstoken,
        rerefreshToken: rerefreshToken
    }
}

export const verifyEmailCode = async (code: string) => {
    const validcode = await verificationDAO.findOne({
        _id: code,
        type: verificationType.emailVerification,
        expireAt: {$gt: new Date() },
    })
    appAssert(validcode, NOT_FOUND, " Invalid verification Code")

    const user_verified = await userDAO.findByIdAndUpdate(
        validcode.userId, {
            verified: true,
        }, 
        {new: true}
    );
    appAssert(user_verified, INTERNAL_SERVER_ERROR, "Email cannot be verified !")

    await validcode.deleteOne();

    return {
        user: user_verified.removePassword()
    }
}

export const forgotPass = async (email: string) => {
    const user = await userDAO.findOne({ email });
    appAssert(user, NOT_FOUND, "User account does not exist")

    const codeexpiresAt = afteronehour();
    const code = await verificationDAO.create({
        userId: user._id,
        type: verificationType.passwordReset,
        expireAt: codeexpiresAt,
    })

    const resetURL = `${APP_ORIGIN}/password/reset?code=${
        code._id
    }&exp=${codeexpiresAt.getTime()}`;

    const { data, error } = await sendEmail({
        to: user.email,
        ...getPasswordResetTemplate(resetURL),
    });
    appAssert(
        data?.id,
        INTERNAL_SERVER_ERROR,
        `${error?.name} - ${error?.message}`
    )
    return {
        resetURL, 
        emailId: data?.id,
    }
}

type changePassParams = {
    password: string;
    verifycode: string;
}

export const changePass = async (
    {password, verifycode}: changePassParams
) => {
    // get code, change user password, delete code and delete all session for that user
    const code = await verificationDAO.findOne({
        _id: verifycode,
        type: verificationType.passwordReset,
        expireAt: { $gt: new Date()},
    })
    appAssert(code, NOT_FOUND, "Verification code is invalid !")
    
    const user_toupdate = await userDAO.findByIdAndUpdate(
        code.userId,{
            password: await hashPass(password),
    })
    appAssert(user_toupdate, INTERNAL_SERVER_ERROR, "Cannot change the password !")

    await code.deleteOne()

    await sessionDAO.deleteMany({
        userId: user_toupdate._id,
    })

    return {
        user: user_toupdate.removePassword(),
    }
}