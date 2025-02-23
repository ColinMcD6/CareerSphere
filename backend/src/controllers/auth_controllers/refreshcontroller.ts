import { OK, UNAUTHORIZED } from "../../constants/http";
import { refreshSessionToken } from "../../services/auth.services";
import appAssert from "../../utils/appAssert";
import catchErrors from "../../utils/catchErrors";
import { getAccessTokenCookieOptions, getrefreshTokenCookieOptions } from "../../utils/auth_helpers/cookies";

export const refreshcontroller = catchErrors(
    async (req, res) => {
        const token = req.cookies.refreshToken as string|undefined;
        appAssert(token, UNAUTHORIZED, "Token Missing to refresh session !")

        const {
            accesstoken, rerefreshToken
        } = await refreshSessionToken(token);

        if (rerefreshToken) {
            res.cookie("refreshToken", rerefreshToken, getrefreshTokenCookieOptions())
        }

        return res.status(OK).cookie("accessToken", accesstoken, getAccessTokenCookieOptions()).json({
            message: "Refreshed Token",
        })
    }
);