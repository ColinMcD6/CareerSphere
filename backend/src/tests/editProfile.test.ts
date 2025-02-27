import * as db from './db'
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http';
import mongoose from 'mongoose';

describe('Test request with mongoose', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    test('Updating education field', async () => {
        const old_education = ["Highschool"]
        const new_education = ["Highschool", "University of Manitoba"]
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.education).toEqual(old_education);

        const mReq: Partial<Request> = {
            body: { education: new_education},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new education
        expect(user?.education).toEqual(new_education);
    });

    test('Updating skills field', async () => {
        const old_skills = ["Coding"]
        const new_skills = ["Coding", "Horseback riding"]
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: [],
            skills: old_skills,
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.skills).toEqual(old_skills);

        const mReq: Partial<Request> = {
            body: { skills: new_skills},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new skills
        expect(user?.skills).toEqual(new_skills);
    });

    test('Updating experience field', async () => {
        const old_experience = ["McDonald's"];
        const new_experience = ["McDonald's", "Amazon Web Services"];
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: old_experience,
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.experience).toEqual(old_experience);

        const mReq: Partial<Request> = {
            body: { experience: new_experience},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new experience
        expect(user?.experience).toEqual(new_experience);
    });

    test('Updating companyDetails field', async () => {
        const old_details = "We are a small company";
        const new_details = "We are a growing company";
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            education: undefined,
            skills: undefined,
            experience: undefined,
            companyDetails: old_details,
            hiringDetails: [],
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.companyDetails).toEqual(old_details);

        const mReq: Partial<Request> = {
            body: { companyDetails: new_details},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new experience
        expect(user?.companyDetails).toEqual(new_details);
    });

    test('Updating hiringDetails field', async () => {
        const old_hiring = ["Intern"];
        const new_hiring = ["Intern", "CEO"];
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            education: undefined,
            skills: undefined,
            experience: undefined,
            companyDetails: "",
            hiringDetails: old_hiring,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.hiringDetails).toEqual(old_hiring);

        const mReq: Partial<Request> = {
            body: { hiringDetails: new_hiring},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new experience
        expect(user?.hiringDetails).toEqual(new_hiring);
    });

    test('Throw error for updating non-existent user', async () => {
        const nonExistentID = new mongoose.Types.ObjectId();
        let user = await UserModel.findById(nonExistentID);
        // Check record is in database
        expect(user).toBeNull();

        const mReq: Partial<Request> = {
            body: {},
            userId: nonExistentID,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(appAssert).toHaveBeenCalledWith(null, NOT_FOUND, "User account does not exist!");
    });

    test('Throw error for trying to get non-existent user', async () => {
        const nonExistentID = new mongoose.Types.ObjectId();
        let user = await UserModel.findById(nonExistentID);
        // Check record is not in database
        expect(user).toBeNull();

        const mReq: Partial<Request> = {
            body: {},
            userId: nonExistentID,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await getUserHandler(mReq as Request, mRes as Response, mNext);
        expect(appAssert).toHaveBeenCalledWith(null, NOT_FOUND, "User account does not exist!");
    });

    test('Get existing user', async () => {
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

        const mReq: Partial<Request> = {
            body: {},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await getUserHandler(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        const expectedJson = {
            _id: newuser._id,
            username: 'colin',
            email: 'colin@gmail.com',
            verified: false,
            userRole: 'Candidate',
            experience: [ 'Software Engineering 2' ],
            education: [ 'University of Manitoba' ],
            skills: [ 'Kendama' ],
            createdAt: newuser.createdAt,
            updatedAt: newuser.updatedAt,
            __v: 0
        }
        // Test whether correct json response is received (no password field in json)
        expect(mJson).toHaveBeenCalledWith(expectedJson);
        let testenv = process.env["TEST_ENV"] + "12345";
        console.log(testenv);
    });
})