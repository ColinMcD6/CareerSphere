import AppErrorCode from "../constants/appErrorCode.constants";
import { HttpStatusCode } from "../constants/http.constants";

class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode,
    ){
        super(message)
    }
}

export default AppError;