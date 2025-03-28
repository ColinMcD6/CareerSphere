import "dotenv/config";

/**
 * * This function sets the environment variables for the application.
 * * It checks if the environment variable is set, and if not, it throws an error.
 * @param key: string - The key of the environment variable to set.
 * @param defaultValue: string - The default value to set if the environment variable is not set.
 * @returns: string - The value of the environment variable.
 * @throws: Error - Throws an error if the environment variable is not set and no default value is provided.
 */
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
