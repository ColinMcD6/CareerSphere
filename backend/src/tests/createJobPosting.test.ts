import * as db from './db'
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import appAssert from '../utils/appAssert';
import { CREATED, NOT_FOUND } from '../constants/http';
import mongoose from 'mongoose';
import { addJobPostingHandler } from '../controllers/jobPostings.controller';
import { ZodError } from 'zod';

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

    test('Create job posting', async () => {
        const employer = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            education: undefined,
            skills: undefined,
            experience: undefined,
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        const jobPosting = {
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "" + employer._id,
            employer_id: "" + employer._id,
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString()
        }
        const mReq: Partial<Request> = {
            body: {
                title: jobPosting.title,
                description: jobPosting.description,
                positionTitle: jobPosting.positionTitle,
                location: jobPosting.location,
                compensationType: jobPosting.compensationType,
                salary: jobPosting.salary,
                jobType: jobPosting.jobType,
                experience: jobPosting.experience,
                skills: jobPosting.skills,
                education: jobPosting.education,
                status: jobPosting.status,
                startingDate: jobPosting.startingDate
            },
            userId: "" + employer._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await addJobPostingHandler(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(CREATED);
        // Test whether correct json response is received
        expect(mJson).toHaveBeenCalledWith(jobPosting);
    });

    test('Create job posting with title that is less than 10 characters', async () => {
        const employer = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            education: undefined,
            skills: undefined,
            experience: undefined,
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        const jobPosting = {
            title: "Job",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "" + employer._id,
            employer_id: "" + employer._id,
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString()
        }
        const mReq: Partial<Request> = {
            body: {
                title: jobPosting.title,
                description: jobPosting.description,
                positionTitle: jobPosting.positionTitle,
                location: jobPosting.location,
                compensationType: jobPosting.compensationType,
                salary: jobPosting.salary,
                jobType: jobPosting.jobType,
                experience: jobPosting.experience,
                skills: jobPosting.skills,
                education: jobPosting.education,
                status: jobPosting.status,
                startingDate: jobPosting.startingDate
            },
            userId: "" + employer._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await addJobPostingHandler(mReq as Request, mRes as Response, mNext);
        let expectedError = [
            {
                "code": "too_small",
                "minimum": 10,
                "type": "string",
                "inclusive": true,
                "exact": false,
                "message": "Title length must be a minimum of 10 characters long",
                "path": [
                    "title"
                ]
            }
        ];
        let error:ZodError = mNext.mock.calls[0][0];
        expect(error.errors).toEqual(expectedError);
    });
});