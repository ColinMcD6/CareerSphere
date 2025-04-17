import { RequestHandler } from "express"
import { UNAUTHORIZED } from "../constants/http.constants";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode.constants";
import { verifyToken } from "../utils/auth_helpers/jwt";
import userDAO from "../repositories/user.repository";

/**
* * Middleware to authenticate user based on JWT token
* * @param {Request} req - The request object containing the user's session information.
* * @param {Response} res - The response object to send the response back to the client.
* * @param {NextFunction} next - The next middleware function in the stack.
*/
export const authenticate: RequestHandler = (req, res, next) => {
    const token= req.cookies.accessToken as string | undefined;
    appAssert(token, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidToken)
    
    const { error , payload } = verifyToken(token);
    appAssert(payload, UNAUTHORIZED, "Token Expired !", AppErrorCode.InvalidToken);

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    
    next()
}

export const auth_verifyEmployer = async (req: any, res: any, next: any) => {
    try {
        const user = await userDAO.findById(req.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found",
                errorCode: AppErrorCode.InvalidToken
            });
        }

        if (user.userRole !== "Employer") {
            return res.status(403).json({
                success: false,
                message: "Not Authorized",
                errorCode: AppErrorCode.InvalidToken
            });
        }

        req.userRole = user.userRole;
        next();
    } catch (error) {
        console.error("Error in auth_verifyEmployer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const auth_verifyCandidate = async (req: any, res: any, next: any) => {
    try {
        const user = await userDAO.findById(req.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found",
                errorCode: AppErrorCode.InvalidToken
            });
        }

        if (user.userRole !== "Candidate") {
            return res.status(403).json({
                success: false,
                message: "Not Authorized",
                errorCode: AppErrorCode.InvalidToken
            });
        }

        req.userRole = user.userRole;
        next();
    } catch (error) {
        console.error("Error in auth_verifyCandidate:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

