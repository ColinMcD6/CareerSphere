import { RequestHandler } from "express"
import { UNAUTHORIZED } from "../constants/http.constants";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode.constants";
import { verifyToken } from "../utils/auth_helpers/jwt";


/**
* * Middleware to authenticate user based on JWT token
* * @param {Request} req - The request object containing the user's session information.
* * @param {Response} res - The response object to send the response back to the client.
* * @param {NextFunction} next - The next middleware function in the stack.
*/
const authenticate: RequestHandler = (req, res, next) => {
    const token= req.cookies.accessToken as string | undefined;
    appAssert(token, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidToken)
    
    const { error , payload } = verifyToken(token);
    appAssert(payload, UNAUTHORIZED, "Token Expired !", AppErrorCode.InvalidToken);

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    req.candidateId = payload.userId; // Change this later, as this is not actually correctly checking that the user is candidate

    next()
}

export default authenticate;
