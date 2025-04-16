import { APP_ORIGIN } from "../constants/env.constants";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http.constants";
import verificationType from "../constants/verificationTyes.constants";
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
    userRole?: string;
}

export type loginAccountFields = {
    email: string;
    password: string;
    userRole?: string;
}

/**
 * * * signupAccount
 * * @description - This function handles the signup process for a new user account.
 * * @param {signupAccountFields} data - The signup data containing username, email, password, and user role.
 * * @returns {Promise<{ newuser: any; accesstoken: string; refreshtoken: string; }>} - Returns the newly created user, access token, and refresh token.
 * * @throws {Error} - Throws an error if the user already exists or if there is an issue during the signup process.
 * */
export const signupAccount = async (data: signupAccountFields) => {
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
        userRole: data.userRole,
        education: data.userRole === "Candidate" ? [] : undefined,
        skills: data.userRole === "Candidate" ? [] : undefined,
        experience: data.userRole === "Candidate" ? [] : undefined,
        companyDetails: data.userRole === "Employer" ? "" : undefined,
        hiringDetails: data.userRole === "Employer" ? [] : undefined,
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
        userAgent: data.userRole,
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


/**
 * * loginAccount
 * * @description - This function handles the login process for an existing user account.
 * * @param {loginAccountFields} data - The login data containing email, password, and user role.
 * * @returns {Promise<{ newuser: any; accesstoken: string; refreshtoken: string; }>} - Returns the logged-in user, access token, and refresh token.
 * * @throws {Error} - Throws an error if the user does not exist or if the password is invalid.
 * */
export const loginAccount = async ({email, password, userRole}: loginAccountFields) => {
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
        userRole,
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


/**
 * * refreshSessionToken
 * * @description - This function handles the process of refreshing the session token for a user.
 * * @param {string} refreshToken - The refresh token used to validate the session.
 * * @returns {Promise<{ accesstoken: string; rerefreshToken?: string; }>} - Returns the new access token and optional refresh token.
 * * @throws {Error} - Throws an error if the refresh token is invalid or if the session is not valid anymore.
 * */
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



/**
 * * verifyEmailCode
 * * @description - This function verifies the email verification code sent to the user.
 * * @param {string} code - The verification code sent to the user's email.
 * * @returns {Promise<{ user: any; }>} - Returns the verified user account.
 * * @throws {Error} - Throws an error if the verification code is invalid or if the user cannot be verified.
 * */
export const verifyEmailCode = async (code: string) => {
    const validcode = await verificationDAO.findOne({
        _id: code,
        type: verificationType.emailVerification,
        expireAt: {$gt: Date.now() },
    })
    appAssert(validcode, NOT_FOUND, "Verification code is invalid!");

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


/**
 * * forgotPass
 * * @description - This function handles the process of sending a password reset email to the user.
 * * @param {string} email - The email address of the user requesting a password reset.
 * * @returns {Promise<{ resetURL: string; emailId: string; }>} - Returns the password reset URL and email ID.
 * * @throws {Error} - Throws an error if the user account does not exist or if there is an issue sending the email.
 * */
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


/**
 * * changePass
 * * @description - This function handles the process of changing the user's password.
 * * @param {changePassParams} params - The parameters containing the new password and verification code.
 * * @returns {Promise<{ user: any; }>} - Returns the updated user account.
 * * @throws {Error} - Throws an error if the verification code is invalid or if the password cannot be changed.
 * */
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
    
    const userToUpdate = await userDAO.findByIdAndUpdate(
        code.userId,{
            password: await hashPass(password),
    })
    appAssert(userToUpdate, INTERNAL_SERVER_ERROR, "Cannot change the password !")

    await code.deleteOne()

    await sessionDAO.deleteMany({
        userId: userToUpdate._id,
    })

    return {
        user: userToUpdate.removePassword(),
    }
}


/**
 * * logout
 * * @description - This function handles the process of logging out the user by deleting their session.
 * * @param {string} sessionId - The ID of the session to be deleted.
 * * @returns {Promise<{ message: string; }>} - Returns a message indicating successful logout.
 * * @throws {Error} - Throws an error if the session is not found or if there is an issue during the logout process.
 * */
export const logout = async (sessionId: string) => {
    const session = await sessionDAO.findById(sessionId);
    appAssert(session, UNAUTHORIZED, "Session not found !")
    await sessionDAO.deleteById(sessionId);
    return {
        message: "User logged out !",
    }
}
