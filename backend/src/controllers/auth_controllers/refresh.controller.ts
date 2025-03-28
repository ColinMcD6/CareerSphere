import { OK, UNAUTHORIZED } from "../../constants/http.constants";
import { refreshSessionToken } from "../../services/auth.services";
import appAssert from "../../utils/appAssert";
import catchErrors from "../../utils/catchErrors";
import { getAccessTokenCookieOptions, getrefreshTokenCookieOptions } from "../../utils/auth_helpers/cookies";



/**
 * * Refresh Controller
 * * @description - This controller handles the process of refreshing the user's session token.
 * * @param {Request} req - The request object containing the user's session information.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the refresh.
 * * @throws {Error} - Throws an error if the refresh process fails.
 */
export const refreshController = catchErrors(
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
