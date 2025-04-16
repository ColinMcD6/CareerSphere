import * as db from './db'
import sessionModel from "../models/supportModels/session.model";
import UserModel from "../models/main/users.model";
import verificationModel from "../models/supportModels/verify.model";
import { signupAccount } from "../services/auth.services";
import verificationType from '../constants/verificationTyes.constants';

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

    /* 
        test to sigunp as a candiate, then checkthe usermodel db to see the user was created as candidate with 
        expected feilds, email verification created, session created and check the response user to have expected fields.
    */
    test("Successfully creates a new Candidate user", async () => {
        const mockData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            confirmPassword: "test123456789",
            userRole: "Candidate",
        };

        const result = await signupAccount(mockData);

        const createdUser = await UserModel.findOne({ email: mockData.email });
        expect(createdUser).not.toBeNull();
        expect(createdUser?.username).toBe(mockData.username);
        expect(createdUser?.userRole).toBe("Candidate");
        expect(createdUser?.education).toEqual([]);
        expect(createdUser?.skills).toEqual([]);
        expect(createdUser?.experience).toEqual([]);

        const verificationRecord = await verificationModel.findOne({ userId: createdUser?._id, type: verificationType.emailVerification });
        expect(verificationRecord).not.toBeNull();

        const sessionRecord = await sessionModel.findOne({ userId: createdUser?._id });
        expect(sessionRecord).not.toBeNull();

        expect(result.accesstoken).toBeDefined();
        expect(result.refreshtoken).toBeDefined();
        expect(result.newuser.email).toBe(mockData.email);
        expect(result.newuser.userRole).toBe(mockData.userRole);
    }, 10000);

    /* 
        test to sigunp as an employer, then checkthe usermodel db to see the user was created as an employer with 
        expected feilds, email verification created, session created and check the response user to have expected fields.
    */
    test("Successfully creates a new Employer user", async () => {
        const mockData = {
            username: "test_user2",
            email: "test_user2@gmail.com",
            password: "test987654321",
            confirmPassword: "test987654321",
            userRole: "Employer",
        };

        const result = await signupAccount(mockData);

        const createdUser = await UserModel.findOne({ email: mockData.email });
        expect(createdUser).not.toBeNull();
        expect(createdUser?.username).toBe(mockData.username);
        expect(createdUser?.userRole).toBe("Employer");
        expect(createdUser?.companyDetails).toBe("");
        expect(createdUser?.hiringDetails).toEqual([]);

        const verificationRecord = await verificationModel.findOne({ userId: createdUser?._id });
        expect(verificationRecord).not.toBeNull();

        const sessionRecord = await sessionModel.findOne({ userId: createdUser?._id });
        expect(sessionRecord).not.toBeNull();

        expect(result.accesstoken).toBeDefined();
        expect(result.refreshtoken).toBeDefined();
        expect(result.newuser.email).toBe(mockData.email);
        expect(result.newuser.userRole).toBe(mockData.userRole);
    }, 10000);

    /*
        test to check that the signup is not allowed for an already exisitng account with user email.
    */
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

        await expect(signupAccount(mockData)).rejects.toThrow("Account already exists!");

        // duplicate accounts with same email not allowed
        const userCount = await UserModel.countDocuments({ email: "test_existUser@gmail.com" });
        expect(userCount).toBe(1);
    }, 10000);
});
