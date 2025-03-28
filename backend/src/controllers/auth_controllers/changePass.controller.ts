import { z } from "zod";
import catchErrors from "../../utils/catchErrors"
import { changePass } from "../../services/auth.services";
import { OK } from "../../constants/http.constants";
import { clearCookies } from "../../utils/auth_helpers/cookies";

const changePassSchema = z.object({
    password: z.string().min(8).max(225),
    verifycode: z.string().min(1).max(24),
})

/**
 * * Change Password Controller
 * * @description - This controller handles the process of changing the user's password.
 * * @param {Request} req - The request object containing the password and verification code.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the password change.
 * * @throws {Error} - Throws an error if the password change fails.
 */
export const changePasswordController = catchErrors(
    async (req, res) => {
        const request = changePassSchema.parse(req.body);
        await changePass(request);
        return clearCookies(res).status(OK).json({
            message: "User password has been changed !"
        })
    }
);
