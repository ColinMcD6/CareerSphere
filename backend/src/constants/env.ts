import "dotenv/config";

const setEnv = (key: string, defaultValue?: string):string => {
    const value = process.env[key] || defaultValue;
    if (value == undefined) {
        throw new Error(`Missing environment variable ${key}`);
    }
    return value;
}

export const MONGO_URI = setEnv('MONGO_URI');
export const PORT = setEnv('PORT');
export const NODE_ENV = setEnv("NODE_ENV");
export const APP_ORIGIN = setEnv("APP_ORIGIN");
export const JWT_SECRET = setEnv("JWT_SECRET");
export const JWTREFRESH_SECRET = setEnv("JWTREFRESH_SECRET");
export const SENDER_EMAIL = setEnv("SENDER_EMAIL");
export const API_RESEND = setEnv("API_RESEND");
export const RESEND_API_KEY = setEnv("RESEND_API_KEY")

/* export const MONGO_URI = setEnv('MONGO_URI', "mongodb://localhost:27017/Comp4350_CareerSphere");
export const PORT = setEnv('PORT', "4004");
export const NODE_ENV = setEnv("NODE_ENV");
export const APP_ORIGIN = setEnv("APP_ORIGIN", "http://localhost:5173");
export const JWT_SECRET = setEnv("JWT_SECRET", "myjwtsecret");
export const JWTREFRESH_SECRET = setEnv("JWTREFRESH_SECRET", "myjwtrefrestsecret");
export const SENDER_EMAIL = setEnv("SENDER_EMAIL", "aa");
export const API_RESEND = setEnv("API_RESEND", "bb");
export const RESEND_API_KEY = setEnv("RESEND_API_KEY", "re_aQLEGtYG_3TXkr9ds9eYB473GMZjgU7Uj")*/