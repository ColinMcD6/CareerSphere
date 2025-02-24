import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { sessionDoc } from "../../models/session.model";
import { UserDocument } from "../../models/users.model";
import { JWT_SECRET, JWTREFRESH_SECRET } from "../../constants/env";

export type RefTokenPayload = {
    sessionId: sessionDoc["_id"];
};

export type AccessTokenPayload = {
    userId: UserDocument["_id"];
    sessionId: sessionDoc["_id"];
};

type SignOptionsWithSecret = SignOptions & {
    token: string
}

const defaults: SignOptions = {
    audience: ["user"],
}

const accessTokenOption: SignOptionsWithSecret ={
    expiresIn: "1d",
    token: JWT_SECRET
}

export const refeshTokenOption: SignOptionsWithSecret ={
    expiresIn: "7d",
    token: JWTREFRESH_SECRET
}

export const signingToken = (
    payload: RefTokenPayload | AccessTokenPayload,
    options?: SignOptionsWithSecret
) => {
    const { token, ...signOpts } = options || accessTokenOption;
    return jwt.sign(payload, token, {
        ...defaults,
        ...signOpts,
    });
}

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token: string,
    options?: VerifyOptions & { secret: string}
) => {
    const { secret = JWT_SECRET, ...verifyOpts} = options || {}
    try {
        const payload = jwt.verify(
            token, secret, {
                ...defaults,
                ...verifyOpts,
            }
        ) as TPayload;
        return {
            payload,
        };
    }catch (error: any){
        return {
            error: error.message
        }
    }
}