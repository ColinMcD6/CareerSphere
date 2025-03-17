import { RequestHandler } from "express"
import { UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/APP_errorCode";
import { verifyToken } from "../utils/auth_helpers/jwt";

const authenticate: RequestHandler = (req, res, next) => {
    const token= req.cookies.accessToken as string | undefined;
    appAssert(token, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidToken)
    
    const { error , payload } = verifyToken(token);
    appAssert(payload, UNAUTHORIZED, "Token Expired !", AppErrorCode.InvalidToken);

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    req.candidateId = payload.userId; // Change this later, as this is not actually correctly checking that the user is a candidate

    next()
}

export default authenticate;