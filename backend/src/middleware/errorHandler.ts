import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/AppError";

import { ZodError } from "zod"; // Import ZodError for validation errors

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map((err) => ({
      field: err.path.join("."), // Convert path array to string (e.g., "title", "deadline")
      message: err.message, // Error message for the field
    }));
  
    res.status(400).json({
      error: "Validation Error",
      details: fieldErrors, // Send structured errors to the frontend
    });
  
    console.log("ZodError Detected, responding with Zod error");
    return;
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
//-------------------------------------------------------
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
