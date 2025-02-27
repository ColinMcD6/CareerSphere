import * as db from './db'
import sessionModel from "../models/session.model";
import UserModel from "../models/users.model";
import verificationModel from "../models/verify.model";
import { signup_account } from "../services/auth.services";

describe("Signup Account", () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterEach(async () => {
        await db.clearDatabase();
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    test("Successfully creates a new Candidate user", async () => {
        const mockData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            confirm_password: "test123456789",
            user_role: "Candidate",
        };

        // Call the function
        const result = await signup_account(mockData);

        // Check that the user was created in the database
        const createdUser = await UserModel.findOne({ email: mockData.email });
        expect(createdUser).not.toBeNull();
        expect(createdUser?.username).toBe(mockData.username);
        expect(createdUser?.userRole).toBe("Candidate");
        expect(createdUser?.education).toEqual([]);
        expect(createdUser?.skills).toEqual([]);
        expect(createdUser?.experience).toEqual([]);

        // Check that a verification code was created
        const verificationRecord = await verificationModel.findOne({ userId: createdUser?._id });
        expect(verificationRecord).not.toBeNull();

        // Check that a session was created
        const sessionRecord = await sessionModel.findOne({ userId: createdUser?._id });
        expect(sessionRecord).not.toBeNull();

        // Check that access and refresh tokens were generated
        expect(result.accesstoken).toBeDefined();
        expect(result.refreshtoken).toBeDefined();
    });

    test("Successfully creates a new Employer user", async () => {
        const mockData = {
            username: "test_user2",
            email: "test_user2@gmail.com",
            password: "test987654321",
            confirm_password: "test987654321",
            user_role: "Employer",
        };

        // Call the function
        const result = await signup_account(mockData);

        // Check that the user was created in the database
        const createdUser = await UserModel.findOne({ email: mockData.email });
        expect(createdUser).not.toBeNull();
        expect(createdUser?.username).toBe(mockData.username);
        expect(createdUser?.userRole).toBe("Employer");
        expect(createdUser?.companyDetails).toBe("");
        expect(createdUser?.hiringDetails).toEqual([]);

        // Check that a verification code was created
        const verificationRecord = await verificationModel.findOne({ userId: createdUser?._id });
        expect(verificationRecord).not.toBeNull();

        // Check that a session was created
        const sessionRecord = await sessionModel.findOne({ userId: createdUser?._id });
        expect(sessionRecord).not.toBeNull();

        // Check that access and refresh tokens were generated
        expect(result.accesstoken).toBeDefined();
        expect(result.refreshtoken).toBeDefined();
    });

    test("Fails to create a user if the account already exists", async () => {
        const existingUser = await UserModel.create({
            username: "test_existUser",
            email: "test_existUser@gmail.com",
            password: "exist11111111",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: [],
        });

        const mockData = {
          username: "test_existUser",
          email: "test_existUser@gmail.com",
          password: "exist11111111",
          userRole: "Candidate",
        };

        await expect(signup_account(mockData)).rejects.toThrow("Account already exists!");

        // Duplicate Accounts are not allowed
        const userCount = await UserModel.countDocuments({ email: "test_existUser@gmail.com" });
        expect(userCount).toBe(1);
    });
});
