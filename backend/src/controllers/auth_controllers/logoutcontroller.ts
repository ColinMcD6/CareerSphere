import { OK } from "../../constants/http";
import sessionModel from "../../models/session.model";
import catchErrors from "../../utils/catchErrors"
import { clearCookies } from "../../utils/auth_helpers/cookies";
import { AccessTokenPayload, verifyToken } from "../../utils/auth_helpers/jwt";

export const logoutcontroller = catchErrors(
    async (req, res) => {
        const token = req.cookies.accessToken as string|undefined;
        const {payload,} = verifyToken<AccessTokenPayload>(token || "");
        if (payload) {
            await sessionModel.findByIdAndDelete(payload.sessionId)
        }
        return clearCookies(res).
            status(OK).json({
                message: "Successfully Logged Out !",
            })
    }
);