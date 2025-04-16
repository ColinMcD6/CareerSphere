import { z } from "zod"
import catchErrors from "../../utils/catchErrors"
import { loginAccount } from "../../services/auth.services"
import { OK } from "../../constants/http.constants"
import { setAuthCookies } from "../../utils/auth_helpers/cookies"

const loginSchema = z.object({
    email: z.string().email().min(1).max(225),
    password: z.string().min(8).max(225),
    userRole: z.string().optional(),
})


/**
 * * Login Controller
 * * @description - This controller handles the process of logging in a user.
 * * @param {Request} req - The request object containing the email and password.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the login.
 * * @throws {Error} - Throws an error if the login fails.
 */
export const loginController = catchErrors(
    async (req, res) => {
        // validate request
        const login_request = loginSchema.parse({
            ...req.body,
            userRole: req.headers["user-agent"]
        })
        // call service
        const { accesstoken, refreshtoken } = await loginAccount(login_request);
        // return response
        return setAuthCookies({ res, accesstoken, refreshtoken })
            .status(OK)
            .json({ message: "Successfully Logged In !"});
    }
);
