import { z } from "zod";
import catchErrors from "../../utils/catchErrors";
import { verifyEmailCode } from "../../services/auth.services";
import { OK } from "../../constants/http";

const verifySchema = z.string().min(1).max(24)

export const verifyEmailController = catchErrors(
    async (req, res) => {
        const code = verifySchema.parse(req.params.code);
        await verifyEmailCode(code);

        return res.status(OK).json({
            message: "User email has been successfully verified !"
        })
    }
);