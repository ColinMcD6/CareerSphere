import mongoose from 'mongoose';
import UserModel from '../models/main/users.model';
import verificationModel from '../models/one-to-many/verify.model';
import { changePass, forgotPass } from '../services/auth.services';
import { oneyearfromnow } from '../utils/auth_helpers/calc';
import * as db from './db'
import verificationType from '../constants/verificationTyes';
import { APP_ORIGIN } from '../constants/env';

describe("Verify Email Code", () => {
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
        test to see if the password reset goes through and code is deleted
    */

    test("reset password for a valid user", async () => {
        const codeId = "67c0bf7e309017daed73cb54";
        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });
        const newPass = "newPassword";
        const verification_codes = await verificationModel.create({
            _id: new mongoose.Types.ObjectId(codeId),
            userId: mockUser._id, 
            type: verificationType.passwordReset,
            expireAt: oneyearfromnow(),
        })

        await changePass({password: newPass, verifycode: codeId});

        const updatedUser = await UserModel.findById(mockUser._id);
        const validPass = await updatedUser?.checkPassword(newPass);
        expect(validPass).toBe(true);

        const verifyCodeDeleted = await verificationModel.findById(verification_codes._id);
        expect(verifyCodeDeleted).toBeNull();
    });

    /*
        test to see if the password reset fails and the password is untouched
    */

    test("test with no verification code", async () => {
        const codeId = "67c0bf7e309017daed73cb54";
        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user2@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        const newPass = "newPassword";
        await expect(changePass({password: newPass, verifycode: codeId})).rejects.toThrow("Verification code is invalid !");

        const updatedUser = await UserModel.findOne({ _id: mockUser._id });
        const validPass1 = mockUser.password == updatedUser?.password;
        expect(validPass1).toBe(true);

        const validPass2 = await updatedUser?.checkPassword(newPass);;
        expect(validPass2).toBe(false);
    });

    /*
        test to see if forgot password sends the correct data
    */

    test("forgot password for a valid user", async () => {
        const mockUser = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });

        const info = await forgotPass(mockUser.email);
        const code = await verificationModel.findOne({userId: mockUser._id});
        console.log(code);
        expect(info.resetURL).toBe(`${APP_ORIGIN}/password/reset?code=` + code?._id + `&exp=` + code?.expireAt.getTime());
        
    });
});