import { z } from "zod";
import catchErrors from "../../utils/catchErrors"
import { forgotPass } from "../../services/auth.services";
import { OK } from "../../constants/http";


const emailSchema = z.string().email().min(1).max(225);

export const forgotPassController = catchErrors(
    async (req, res) => {
        const email = emailSchema.parse(req.body.email);
        await forgotPass(email);

        return res.status(OK).json({
            message: "Send an email to reset password",
        })
    }
);