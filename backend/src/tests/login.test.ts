import * as db from './db'
import sessionModel from "../models/supportModels/session.model";
import UserModel from "../models/main/users.model";
import { loginAccount } from "../services/auth.services";

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

    /*
        test to login with user created email and password, creating a session as soon as user logs in and access and refresh token are created
    */
    test("Successfully logs in a user with valid credentials", async () => {

        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        mockUser.checkPassword = jest.fn().mockResolvedValue(true);
        await mockUser.save();

        const result = await loginAccount({
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        const sessionRecord = await sessionModel.findOne({ userId: mockUser._id });
        expect(sessionRecord).not.toBeNull();

        expect(result).toHaveProperty("accesstoken")
        expect(result).toHaveProperty("refreshtoken")
    });

    /*
        test to check that login is failed with message: User Account does not exist ! with invalid email 
        (not created or signed up with) and check no session is created on that login failed
    */

    test("Fails to log in if user does not exist", async () => {
        await expect(
            loginAccount({
                email: "test_user@gmail.com",
                password: "test123456789",
                userRole: "Candidate",
            })
        ).rejects.toThrow("User Account does not exist !");

        // Ensure no session is created
        const sessionCount = await sessionModel.countDocuments();
        expect(sessionCount).toBe(0);
    });

    /*
        test to check that login is failed with message: Invalid email or Password with invalid email entered or 
        wrong password entered and check no session is created on that login failed
    */

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
            loginAccount({
                email: "test_user@gmail.com",
                password: "test123456788",
                userRole: "Candidate",
            })
        ).rejects.toThrow("Invalid email or Password !");

        const sessionCount = await sessionModel.countDocuments();
        expect(sessionCount).toBe(0);
    }, 10000);
});
