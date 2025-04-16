import mongoose from 'mongoose';
import UserModel from '../models/main/users.model';
import verificationModel from '../models/supportModels/verify.model';
import { verifyEmailCode } from '../services/auth.services';
import { onedaylater, oneyearfromnow } from '../utils/auth_helpers/calc';
import * as db from './db'
import verificationType from '../constants/verificationTyes.constants';

describe("Verify Email Code", () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterEach(async () => {
        await db.clearDatabase();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    /*
        test to see if the user is verified with code generatedand the verified boolen is updated to true 
        and then verification code is deleted
    */

    test("should verify the user code successfully and update the user", async () => {
        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        const verificaion_codes = await verificationModel.create({
            _id: new mongoose.Types.ObjectId('67c0bf7e309017daed73cb54'),
            userId: mockUser._id, 
            type: verificationType.emailVerification,
            expireAt: oneyearfromnow(),
        })

        await verifyEmailCode('67c0bf7e309017daed73cb54');

        const updatedUser = await UserModel.findById(mockUser._id);
        expect(updatedUser?.verified).toBe(true);

        const verifyCodeDeleted = await verificationModel.findById(verificaion_codes._id);
        expect(verifyCodeDeleted).toBeNull();
    });
});
