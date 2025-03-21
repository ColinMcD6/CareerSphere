import * as db from './db'
import express from 'express';
import request from 'supertest';
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http';
import mongoose from 'mongoose';
import JobPostingsModel from '../models/jobPostings.model';
import { getAllJobPostingsQueryHandler } from '../controllers/jobPostings.controller';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Wire up the GET /job endpoint with the search-capable handler
app.get('/job', getAllJobPostingsQueryHandler);
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

    test('Check if updateUserDetails will not update negative preferences', async () => {
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

    test('Check if updateUserDetails will not update out of bounds preferences', async () => {
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

    test('Check if updateUserDetails will not update on char input', async () => {
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

    test('Check if updateUserDetails will not update on String input', async () => {
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

    test('Check if sort behaves ok on single job', async () => {
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
        const newJob1 = await JobPostingsModel.create({
            title: "Software Engineer1",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 2
        });
        //const findUpdatedUser = await UserModel.findById(newuser._id);
        const jobs = await request(app).get(`/job?user_id=${newuser._id}`);
        expect(jobs.status).toBe(200);
        expect(jobs.body.jobPostings.length).toBe(1);
        expect(jobs.body.jobPostings[0].category).toBe(2);
    });

    test('Check if jobs get sorted correctly based on no preferences', async () => {
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
        const newJob1 = await JobPostingsModel.create({
            title: "Software Engineer1",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 2
        });

        const newJob2 = await JobPostingsModel.create({
            title: "Software Engineer2",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 4
        });

        const newJob3 = await JobPostingsModel.create({
            title: "Software Engineer3",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 2
        });

        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        const mReq: Partial<Request> = {
            body: {user_id: newuser._id},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        //const findUpdatedUser = await UserModel.findById(newuser._id);
        const jobs = await request(app).get(`/job?user_id=${newuser._id}`);
        expect(jobs.status).toBe(200);
        expect(jobs.body.jobPostings.length).toBe(3);
        expect(jobs.body.jobPostings[0].category).toBe(2);
        expect(jobs.body.jobPostings[1].category).toBe(2);
        expect(jobs.body.jobPostings[2].category).toBe(4);
    });

    test('Check if jobs get sorted correctly based on existing preferences', async () => {
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
        const newJob1 = await JobPostingsModel.create({
            title: "Software Engineer1",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 2
        });

        const newJob2 = await JobPostingsModel.create({
            title: "Software Engineer2",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 4
        });

        const newJob3 = await JobPostingsModel.create({
            title: "Software Engineer3",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 2
        });

        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        const preference1 = 4;
        const mReq1: Partial<Request> = {
            body: {preference: preference1},
            userId: newuser._id,
        };
        const mReq2: Partial<Request> = {
            body: {user_id: newuser._id},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        //const findUpdatedUser = await UserModel.findById(newuser._id);
        const jobs = await request(app).get(`/job?user_id=${newuser._id}`);
        expect(jobs.status).toBe(200);
        expect(jobs.body.jobPostings.length).toBe(3);
        expect(jobs.body.jobPostings[0].category).toBe(4);
        expect(jobs.body.jobPostings[1].category).toBe(2);
        expect(jobs.body.jobPostings[2].category).toBe(2);
    });
})