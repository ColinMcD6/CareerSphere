import * as db from './db'
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/main/users.model';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http.constants';
import mongoose from 'mongoose';

describe('Test candidate and employer portals', () => {
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

    test('Updating education field with string converts string to string array', async () => {
        const old_education = ["Highschool"];
        const new_education = "Highschool and University of Manitoba";
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
        // Check record is updated with new education as a string
        expect(user?.education).toEqual([new_education]);
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

    test('Updating skills field with array containing string and integer converts integer to string', async () => {
        const old_skills = ["Coding"];
        const new_skills = ["Coding and horseback riding", 123];
        const expectedSkills = ["Coding and horseback riding", "123"];
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
        expect(user?.skills).toEqual(expectedSkills);
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

    test('Updating experience field with json object throws mongoose validation error', async () => {
        const old_experience = ["McDonald's"];
        const new_experience = { job1: "McDonald's", job2: "AWS" };
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
        try {
            await updateUserDetails(mReq as Request, mRes as Response, mNext);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        }
        // Check record has not been updated with new experience
        expect(user?.experience).toEqual(old_experience);
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

    test('Updating companyDetails field with integer converts integer to string', async () => {
        const old_details = "We are a small company";
        const new_details = 123456;
        const new_details_string = "123456";
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
        expect(user?.companyDetails).toEqual(new_details_string);
    });

    test('Updating companyDetails field with array throws mongoose validation error', async () => {
        const old_details = "We are a small company";
        const new_details = ["We", "are", "the", "best"];
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
        try {
            await updateUserDetails(mReq as Request, mRes as Response, mNext);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        }
        user = await UserModel.findById(newuser._id);
        // Check record is not updated with new experience
        expect(user?.companyDetails).toEqual(old_details);
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

    test('Updating hiringDetails field with string converts string to string array', async () => {
        const old_hiring = ["Intern"];
        const new_hiring = "Intern and CEO";
        const expectedHiring = ["Intern and CEO"];
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
        expect(user?.hiringDetails).toEqual(expectedHiring);
    });

    test('Updating hiringDetails field with integer converts integer to string array', async () => {
        const old_hiring = ["Intern"];
        const new_hiring = 1234567;
        const expectedHiring = ["1234567"];
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
        expect(user?.hiringDetails).toEqual(expectedHiring);
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
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toContain("User account does not exist!");
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
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toContain("User account does not exist !");
    });

    test('Get existing user and make sure password is not contained in response body', async () => {
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
            preferences: [0,0,0,0,0,0],
            __v: 0
        }
        // Test whether correct json response is received (no password field in json)
        expect(mJson).toHaveBeenCalledWith(expectedJson);
    });
})