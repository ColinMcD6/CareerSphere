import * as db from '../db'
import express from 'express';
import request from 'supertest';
import { updateUserDetails } from '../../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../../models/users.model';
import JobPostingsModel from '../../models/jobPostings.model';
import { getAllJobPostingsQueryHandler } from '../../controllers/jobPostings.controller';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Wire up the GET /job endpoint with the search-capable handler
app.get('/job', getAllJobPostingsQueryHandler);
describe('Test preference API', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });
    test('Check if sort behaves OK on single job', async () => {
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