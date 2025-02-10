import { ErrorRequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/AppError";

const handleAppError = (res: Response, error: AppError) => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
}

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);

    if (error instanceof AppError) {
        return handleAppError(res, error);
    }
    
    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
}

export default errorHandler;