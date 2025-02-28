import { Request, Response } from 'express';
import * as db from './db'
import {
    addJobPostingApplicationHandler,
    getJobPostingApplicationsHandler,
    getJobPostingApplicationsQueryHandler,
    deleteJobPostingApplicationHandler,
} from '../controllers/jobPostings.controller';


import ApplicationModel from "../models/application.model";

describe('Test adding Application', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    // test('Adding a new application', async () => {
    //     const newApplication = {
    //         job_id: "123",
    //         employer_id: "123",
    //         candidate_id: "123",
    //         resume_id: "123",
    //         dateApplied: new Date(),
    //         status: "Pending",
    //     };
    //     const mReq: Partial<Request> = {
    //         body: {
    //             job_id: newApplication.job_id,
    //             employer_id: newApplication.employer_id,
    //             candidate_id: newApplication.candidate_id,
    //             resume_id: newApplication.resume_id,
    //         },
    //     };
    //     const mJson = jest.fn().mockImplementation(() => null)
    //     const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
    //     const mRes: Partial<Response> = {
    //         status: mStatus,
    //         json: mJson,
    //     };
    //     const mNext = jest.fn();
    //     await addJobPostingApplicationHandler(mReq as Request, mRes as Response, mNext);

    //     expect(mRes.status).toHaveBeenCalledWith(201);
    //     expect(mRes.json).toHaveBeenCalledWith({
    //         jobApplication: expect.any(Object),
    //     });
    // });

    test('Getting a job application', async () => {
        const newApplication = {
            job_id: "123",
            employer_id: "123",
            candidate_id: "123",
            resume_id: "123",
            dateApplied: new Date(),
            status: "Pending",
        };
        const application = await ApplicationModel.create(newApplication);
        const mReq: Partial<Request> = {
            params: {
                id: application._id as string,
            },
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();
        await getJobPostingApplicationsHandler(mReq as Request, mRes as Response, mNext);

        const expected = {
            _id: application._id,
            job_id: '123',
            employer_id: '123',
            candidate_id: '123',
            resume_id: '123',
            dateApplied: application.dateApplied,
            status: 'Pending',
            __v: 0
        }
        

        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith(expected);
    });

    // test('Getting a job application with query', async () => {
    //     const newApplication = {
    //         job_id: "123",
    //         employer_id: "123",
    //         candidate_id: "123",
    //         resume_id: "123",
    //         dateApplied: new Date(),
    //         status: "Pending",
    //     };
    //     const application = await ApplicationModel.create(newApplication);
    //     const mReq: Partial<Request> = {
    //         query: {
    //             job_id: newApplication.job_id,
    //         },
    //     };
    //     const mRes: Partial<Response> = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     };
    //     const mNext = jest.fn();
    //     await getJobPostingApplicationsQueryHandler(mReq as Request, mRes as Response, mNext);
    //     expect(mRes.status).toHaveBeenCalledWith(200);
    //     expect(mRes.json).toHaveBeenCalledWith({
    //         applications: expect.any(Array),
    //         total: expect.any(Number),
    //         page: 1,
    //         pages: expect.any(Number),
    //     });
    // });

    // test('Deleting a job application', async () => {
    //     const newApplication = {
    //         job_id: "123",
    //         employer_id: "123",
    //         candidate_id: "123",
    //         resume_id: "123",
    //         dateApplied: new Date(),
    //         status: "Pending",
    //     };
    //     const application = await ApplicationModel.create(newApplication);
    //     const mReq: Partial<Request> = {
    //         params: {
    //             id: application._id as string,
    //         },
    //     };
    //     const mRes: Partial<Response> = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     };
    //     const mNext = jest.fn();
    //     await deleteJobPostingApplicationHandler(mReq as Request, mRes as Response, mNext);
    //     expect(mRes.status).toHaveBeenCalledWith(200);
    //     expect(mRes.json).toHaveBeenCalledWith(application.toObject());
    // })

});
