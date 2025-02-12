import assert from "node:assert";
import { HttpStatusCode } from "../constants/http";
import AppError from "./AppError";

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: string, //Change to error code later
) => asserts condition;

/**
 * Asserts a condition and throws an AppError if the condition is false.
 */

const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode,
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;