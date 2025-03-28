import { z } from "zod"
import catchErrors from "../../utils/catchErrors"
import { signupAccount } from "../../services/auth.services"
import { CREATED } from "../../constants/http.constants"
import { setAuthCookies } from "../../utils/auth_helpers/cookies"

const signupSchema = z.object({
    username: z.string().min(5).max(225),
    email: z.string().email().min(1).max(225),
    password: z.string().min(8).max(225),
    confirm_password: z.string().min(8).max(225),
    user_role: z.string(),
    userAgent: z.string().optional(),
}).refine(
    (data) => data.password === data.confirm_password, {
        message: "Pasword and Confirm Password should match",
        path: ["confirmPassword"]
    }
)

/**
 * * Signup Controller
 * * @description - This controller handles the process of signing up a new user.
 * * @param {Request} req - The request object containing the user's signup information.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the signup.
 * * @throws {Error} - Throws an error if the signup process fails.
 */
export const signupController = catchErrors(
    async (req, res) => {
        // validate request
        const signup_request = signupSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })
        // call service
        const { newuser, accesstoken, refreshtoken } = await signupAccount(signup_request);
        // return response
        return setAuthCookies({ res, accesstoken, refreshtoken })
            .status(CREATED)
            .json(newuser);
    }
);
