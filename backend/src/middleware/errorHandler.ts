import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/AppError";
import { z } from "zod";
import { clearCookies } from "../utils/auth_helpers/cookies";

const sendZodError = (res: Response, error: z.ZodError): void => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message
    }));
    res.status(BAD_REQUEST).json({
        message: error.message,
        errors
    });
};

const handleAppError = (res: Response, error: AppError): void => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};

const errorHandler: ErrorRequestHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log(`PATH: ${req.path}`, error);

    if (req.path === "/auth/refresh") {
        clearCookies(res);
    }

    if (error instanceof AppError) {
        handleAppError(res, error);
        return;
    }

    if (error instanceof z.ZodError) {
        sendZodError(res, error);
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");

};

export default errorHandler;
