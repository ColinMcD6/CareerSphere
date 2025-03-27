import { Response } from "express"
import { CookieOptions } from "express"
import { onedaylater, weekfromnow } from "./calc"

const secure = process.env.NODE_ENV !== "development"

const defaults: CookieOptions={
    sameSite: "strict",
    httpOnly: true,
    secure,
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: onedaylater(),
})

export const getrefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: weekfromnow(),
    path: "/auth/refresh"
})

type cookiesParam = {
    res: Response,
    accesstoken: string,
    refreshtoken: string,
}

export const setAuthCookies = ({res, accesstoken, refreshtoken}: cookiesParam) => 
    res
    .cookie("accessToken", accesstoken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshtoken, getrefreshTokenCookieOptions());

export const clearCookies = (res: Response) => 
    res.clearCookie("accessToken").clearCookie("refreshToken", {
        path: "/auth/refresh",
    });
