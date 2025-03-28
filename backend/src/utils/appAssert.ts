import assert from "node:assert";
import { HttpStatusCode } from "../constants/http.constants";
import AppError from "./AppError";
import AppErrorCode from "../constants/appErrorCode.constants";

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode, //Change to error code later
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