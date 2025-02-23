import { z } from "zod"
import catchErrors from "../../utils/catchErrors"
import { signup_account } from "../../services/auth.services"
import { CREATED } from "../../constants/http"
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

export const signupcontroller = catchErrors(
    async (req, res) => {
        // validate request
        const signup_request = signupSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })
        // call service
        const { newuser, accesstoken, refreshtoken } = await signup_account(signup_request);
        // return response
        return setAuthCookies({ res, accesstoken, refreshtoken })
            .status(CREATED)
            .json(newuser);
    }
);