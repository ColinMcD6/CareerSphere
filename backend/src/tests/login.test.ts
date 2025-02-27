import * as db from './db'
import sessionModel from "../models/session.model";
import UserModel from "../models/users.model";
import { login_account } from "../services/auth.services";

describe("Login Account", () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterEach(async () => {
        await db.clearDatabase();
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    test("Successfully logs in a user with valid credentials", async () => {

        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        mockUser.checkPassword = jest.fn().mockResolvedValue(true);
        await mockUser.save();

        const result = await login_account({
            email: "test_user@gmail.com",
            password: "test123456789",
            user_role: "Candidate",
        });

        const sessionRecord = await sessionModel.findOne({ userId: mockUser._id });
        expect(sessionRecord).not.toBeNull();
    });

    test("Fails to log in if user does not exist", async () => {
        await expect(
            login_account({
                email: "test_user@gmail.com",
                password: "test123456789",
                user_role: "Candidate",
            })
        ).rejects.toThrow("User Account does not exist !");

        // Ensure no session is created
        const sessionCount = await sessionModel.countDocuments();
        expect(sessionCount).toBe(0);
    });

    test("Fails to log in with incorrect password", async () => {
        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        mockUser.checkPassword = jest.fn().mockResolvedValue(false);
        await mockUser.save();

        await expect(
            login_account({
                email: "test_user@gmail.com",
                password: "test123456788",
                user_role: "Candidate",
            })
        ).rejects.toThrow("Invalid email or Password !");

        const sessionCount = await sessionModel.countDocuments();
        expect(sessionCount).toBe(0);
    }, 10000);
});
