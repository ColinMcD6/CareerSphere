import * as db from "./db";
import { logoutcontroller } from "../controllers/auth_controllers/logoutcontroller";
import sessionModel from "../models/session.model";
import { NextFunction, Request, Response } from "express";
import { signup_account, login_account } from "../services/auth.services";
import { OK } from "../constants/http";

describe("Logout Controller", () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterEach(async () => {
        await db.clearDatabase();
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    /*
        test to see user is logged out when req contains the cookies and the session created when user logged in is deleted
        a session for user would still which was created after signup, check if the cookies are clear
    */
    test("Successfully logs out a user and deletes session", async () => {
        const user = await signup_account({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            user_role: "Candidate",
        });

        const loginData = await login_account({
            email: "test_user@gmail.com",
            password: "test123456789",
            user_role: "Candidate",
        });

        // Extract accessToken & session ID
        const { accesstoken, refreshtoken } = loginData;
        const sessionId = await sessionModel.findOne({ userId: user.newuser._id });

        const sessionCounts = await sessionModel.countDocuments({ userId: user.newuser._id });
        expect(sessionCounts).toBe(2);

        const mReq = {
            cookies: { accessToken: accesstoken },
        } as jest.Mocked<Partial<Request>>;

        const mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as jest.Mocked<Partial<Response>>;

        const mNext = jest.fn();

        await logoutcontroller(mReq as Request, mRes as Response, mNext as NextFunction);

        const session = await sessionModel.countDocuments({ _id: sessionId?._id });
        expect(session).toBe(1);
        
        expect(mRes.cookie).toBeUndefined()
    }, 10000);
});
