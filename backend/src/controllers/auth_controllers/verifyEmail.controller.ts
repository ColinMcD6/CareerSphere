import { z } from "zod";
import catchErrors from "../../utils/catchErrors";
import { verifyEmailCode } from "../../services/auth.services";
import { OK } from "../../constants/http.constants";

const verifySchema = z.string().min(1).max(24)



/**
 * * Verify Email Controller
 * * @description - This controller handles the process of verifying the user's email address.
 * * @param {Request} req - The request object containing the verification code.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the email verification.
 * * @throws {Error} - Throws an error if the email verification fails.
 */
export const verifyEmailController = catchErrors(
    async (req, res) => {
        const code = verifySchema.parse(req.params.code);
        await verifyEmailCode(code);

        return res.status(OK).json({
            message: "User email has been successfully verified !"
        })
    }
);
