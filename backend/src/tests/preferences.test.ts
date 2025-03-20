import * as db from './db'
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http';
import mongoose from 'mongoose';
import { number } from 'zod';

describe('Test user preference updates', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    // test('Update valid preferences and confirm correct changes', async () => {
    //     const newuser = await UserModel.create({
    //         username: "colin", 
    //         email: "colin@gmail.com", 
    //         password: "12345678", 
    //         userRole: "Candidate",
    //         education: ["University of Manitoba"],
    //         skills: ["Kendama"],
    //         experience: ["Software Engineering 2"],
    //         companyDetails: undefined,
    //         hiringDetails: undefined,
    //     });
    //     let user = await UserModel.findById(newuser._id);
    //     // Check record is in database
    //     expect(user).not.toBeNull();
    //     if(user)
    //     {
    //         user.updatePreference(2);
    //         user.updatePreference(2);
    //         user.updatePreference(2);
    //         user.updatePreference(2);
    //         user.updatePreference(1);
    //         user.updatePreference(4);
    //         user.updatePreference(4);
    //     }
        
        
    //     const findUpdatedUser = await UserModel.findById(newuser._id);
    //     expect(findUpdatedUser?.preferences[0]).toBe(0);
    //     expect(findUpdatedUser?.preferences[1]).toBe(1);
    //     expect(findUpdatedUser?.preferences[2]).toBe(4);
    //     expect(findUpdatedUser?.preferences[3]).toBe(0);
    //     expect(findUpdatedUser?.preferences[4]).toBe(2);
    //     expect(findUpdatedUser?.preferences[5]).toBe(0);
    // });

    // test('Update invalid preferences and confirm no changes or crashes', async () => {
    //     const newuser = await UserModel.create({
    //         username: "colin", 
    //         email: "colin@gmail.com", 
    //         password: "12345678", 
    //         userRole: "Candidate",
    //         education: ["University of Manitoba"],
    //         skills: ["Kendama"],
    //         experience: ["Software Engineering 2"],
    //         companyDetails: undefined,
    //         hiringDetails: undefined,
    //     });
    //     let user = await UserModel.findById(newuser._id);
    //     // Check record is in database
    //     expect(user).not.toBeNull();
    //     await user?.updatePreference(-2);
    //     await user?.updatePreference(-2);
    //     await user?.updatePreference(-2);
    //     await user?.updatePreference(-2);
    //     await user?.updatePreference(10);
    //     await user?.updatePreference(14);
    //     await user?.updatePreference(40);
    //     const findUpdatedUser = await UserModel.findById(newuser._id);
    //     expect(findUpdatedUser?.preferences[0]).toBe(0);
    //     expect(findUpdatedUser?.preferences[1]).toBe(0);
    //     expect(findUpdatedUser?.preferences[2]).toBe(0);
    //     expect(findUpdatedUser?.preferences[3]).toBe(0);
    //     expect(findUpdatedUser?.preferences[4]).toBe(0);
    //     expect(findUpdatedUser?.preferences[5]).toBe(0);
    // });

    test('Check if updateUserDetails will update preference correctly', async () => {
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        const preference1 = 2;
        const preference2 = 1;
        const preference3 = 0;
        const mReq1: Partial<Request> = {
            body: {preference: preference1},
            userId: newuser._id,
        };
        const mReq2: Partial<Request> = {
            body: {preference: preference2},
            userId: newuser._id,
        };
        const mReq3: Partial<Request> = {
            body: {preference: preference3},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq3 as Request, mRes as Response, mNext);
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(1);
        expect(findUpdatedUser?.preferences[1]).toBe(2);
        expect(findUpdatedUser?.preferences[2]).toBe(1);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
    });

    test('Check if updateUserDetails will not update invalid preferences', async () => {
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        const preference1 = -2;
        const preference2 = 10;
        const mReq1: Partial<Request> = {
            body: {preference: preference1},
            userId: newuser._id,
        };
        const mReq2: Partial<Request> = {
            body: {preference: preference2},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(0);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
    });
})