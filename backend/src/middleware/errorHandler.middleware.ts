import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http.constants";
import AppError from "../utils/AppError";
import { z } from "zod";
import { clearCookies } from "../utils/auth_helpers/cookies";


/**
* * Middleware to handle errors in the application
* * @param {Error} error - The error object thrown in the application.
* * @param {Response} res - The response object to send the response back to the client.
* * @throws {Error} - Throws an error if the error handling process fails.
*/
const sendZodError = (res: Response, error: z.ZodError): void => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message
    }));

    const fieldErrors = error.errors.map((err) => ({
        field: err.path.join("."), // Convert path array to string (e.g., "title", "deadline")
        message: err.message, // Error message for the field
      }));
    
    res.status(BAD_REQUEST).json({
        message: error.message,
        errors,
        error: "Validation Error",
        details: fieldErrors
    });
};



/**
* * Middleware to handle application errors
* * @param {Response} res - The response object to send the response back to the client.
* * @param {AppError} error - The application error object thrown in the application.
* * @throws {Error} - Throws an error if the error handling process fails.
* */
const handleAppError = (res: Response, error: AppError): void => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};


/**
* * Middleware to handle all errors in the application
* * @param {Error} error - The error object thrown in the application.
* * @param {Response} res - The response object to send the response back to the client.
* * @param {Request} req - The request object containing the request information.
* * @param {NextFunction} next - The next middleware function in the stack.
* * @throws {Error} - Throws an error if the error handling process fails.
* */
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
