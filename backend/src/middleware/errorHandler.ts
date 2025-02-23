import { ErrorRequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
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
};

export default errorHandler;
