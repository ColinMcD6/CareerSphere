import * as db from './db'
import { updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/main/users.model';


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

    test('Check if updateUserDetails will update single preference correctly', async () => {
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
        const preference1 = 3;
        const mReq: Partial<Request> = {
            body: {preference: preference1},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(0);
        expect(findUpdatedUser?.preferences[3]).toBe(1);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
    });

    test('Check if updateUserDetails will update multiple preferences correctly', async () => {
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
        await updateUserDetails(mReq3 as Request, mRes as Response, mNext);
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(1);
        expect(findUpdatedUser?.preferences[1]).toBe(1);
        expect(findUpdatedUser?.preferences[2]).toBe(1);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
    });

    test('Check if updateUserDetails will update preference multiple times', async () => {
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
        const preference = 5;
        const mReq1: Partial<Request> = {
            body: {preference: preference},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        for(var i = 0; i < 10; i++)
        {
            await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        }
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(0);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(10);
    });

    test('Ensure updateUserDetails will not update negative preferences', async () => {
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
        const preference2 = -1;
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

    test('Ensure updateUserDetails will not update out of bounds preferences', async () => {
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
        const preference1 = 20;
        const preference2 = 1500;
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

    test('Ensure updateUserDetails will not update on char input', async () => {
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
        const preference1 = 'c';
        const preference2 = '\"';
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

    test('Ensure updateUserDetails will not update on String input', async () => {
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
        const preference1 = "Overly long string";
        const preference2 = "10";
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

    test('Ensure updateUserDetails will not update on null input', async () => {
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
        const preference1 = null;
        const preference2 = null;
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
        const findUpdatedUser = await UserModel.findById(newuser._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(0);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
    });

    test('Make sure user preferences are individual', async () => {
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
        const newuser2 = await UserModel.create({
            username: "colin", 
            email: "colin2@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        let user2 = await UserModel.findById(newuser2._id);
        // Check record is in database
        expect(user).not.toBeNull();
        expect(user2).not.toBeNull();
        const preference1 = 2;
        const preference2 = 4;
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
        const findUpdatedUser = await UserModel.findById(newuser._id);
        const findUpdatedUser2 = await UserModel.findById(newuser2._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(1);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(1);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
        expect(findUpdatedUser2?.preferences[0]).toBe(0);
        expect(findUpdatedUser2?.preferences[1]).toBe(0);
        expect(findUpdatedUser2?.preferences[2]).toBe(0);
        expect(findUpdatedUser2?.preferences[3]).toBe(0);
        expect(findUpdatedUser2?.preferences[4]).toBe(0);
        expect(findUpdatedUser2?.preferences[5]).toBe(0);
    });

    test('See if multiple accounts can be updated in concert', async () => {
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
        const newuser2 = await UserModel.create({
            username: "colin", 
            email: "colin2@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        let user2 = await UserModel.findById(newuser2._id);
        // Check record is in database
        expect(user).not.toBeNull();
        expect(user2).not.toBeNull();
        const preference = 2;
        const mReq1: Partial<Request> = {
            body: {preference: preference},
            userId: newuser._id,
        };
        const mReq2: Partial<Request> = {
            body: {preference: preference},
            userId: newuser2._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        await updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        const findUpdatedUser = await UserModel.findById(newuser._id);
        const findUpdatedUser2 = await UserModel.findById(newuser2._id);
        expect(findUpdatedUser?.preferences[0]).toBe(0);
        expect(findUpdatedUser?.preferences[1]).toBe(0);
        expect(findUpdatedUser?.preferences[2]).toBe(2);
        expect(findUpdatedUser?.preferences[3]).toBe(0);
        expect(findUpdatedUser?.preferences[4]).toBe(0);
        expect(findUpdatedUser?.preferences[5]).toBe(0);
        expect(findUpdatedUser2?.preferences[0]).toBe(0);
        expect(findUpdatedUser2?.preferences[1]).toBe(0);
        expect(findUpdatedUser2?.preferences[2]).toBe(2);
        expect(findUpdatedUser2?.preferences[3]).toBe(0);
        expect(findUpdatedUser2?.preferences[4]).toBe(0);
        expect(findUpdatedUser2?.preferences[5]).toBe(0);
    });
})