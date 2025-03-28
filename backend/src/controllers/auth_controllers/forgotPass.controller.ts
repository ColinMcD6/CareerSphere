import { z } from "zod";
import catchErrors from "../../utils/catchErrors"
import { forgotPass } from "../../services/auth.services";
import { OK } from "../../constants/http.constants";


const emailSchema = z.string().email().min(1).max(225);

/**
 * * Forgot Password Controller
 * * @description - This controller handles the process of sending a password reset email to the user.
 * * @param {Request} req - The request object containing the email address.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the password reset email.
 * * @throws {Error} - Throws an error if the email sending fails.

 */
export const forgotPassController = catchErrors(
    async (req, res) => {
        const email = emailSchema.parse(req.body.email);
        await forgotPass(email);

        return res.status(OK).json({
            message: "Send an email to reset password",
        })
    }
);
