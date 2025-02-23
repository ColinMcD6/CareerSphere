import { z } from "zod";
import catchErrors from "../../utils/catchErrors"
import { changePass } from "../../services/auth.services";
import { OK } from "../../constants/http";
import { clearCookies } from "../../utils/auth_helpers/cookies";

const changepassSchema = z.object({
    password: z.string().min(8).max(225),
    verifycode: z.string().min(1).max(24),
})

export const changePasswordController = catchErrors(
    async (req, res) => {
        const request = changepassSchema.parse(req.body);
        await changePass(request);
        return clearCookies(res).status(OK).json({
            message: "User password has been changed !"
        })
    }
);