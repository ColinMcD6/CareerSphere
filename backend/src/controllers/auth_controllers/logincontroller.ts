import { z } from "zod"
import catchErrors from "../../utils/catchErrors"
import { login_account } from "../../services/auth.services"
import { OK } from "../../constants/http"
import { setAuthCookies } from "../../utils/auth_helpers/cookies"

const loginSchema = z.object({
    email: z.string().email().min(1).max(225),
    password: z.string().min(8).max(225),
    userRole: z.string().optional(),
})

export const logincontroller = catchErrors(
    async (req, res) => {
        // validate request
        const login_request = loginSchema.parse({
            ...req.body,
            userRole: req.headers["user-agent"]
        })
        // call service
        const { accesstoken, refreshtoken } = await login_account(login_request);
        // return response
        return setAuthCookies({ res, accesstoken, refreshtoken })
            .status(OK)
            .json({ message: "Successfully Logged In !"});
    }
);