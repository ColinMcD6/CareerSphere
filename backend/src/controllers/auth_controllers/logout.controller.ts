import { OK } from "../../constants/http.constants";
import catchErrors from "../../utils/catchErrors"
import { clearCookies } from "../../utils/auth_helpers/cookies";
import { AccessTokenPayload, verifyToken } from "../../utils/auth_helpers/jwt";
import { logout } from "../../services/auth.services";


/**
 * * Logout Controller
 * * @description - This controller handles the process of logging out a user by invalidating their session.
 * * @param {Request} req - The request object containing the user's session information.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @returns {Promise<Response>} - Returns a response indicating the success of the logout.
 * * @throws {Error} - Throws an error if the logout process fails.
 */
export const logoutController = catchErrors(
    async (req, res) => {
        const token = req.cookies.accessToken as string|undefined;
        const {payload,} = verifyToken<AccessTokenPayload>(token || "");
        if (payload) {
            logout(payload.sessionId as string);
        }
        return clearCookies(res).
            status(OK).json({
                message: "Successfully Logged Out !",
            })
    }
);
