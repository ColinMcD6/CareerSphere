import { Request, Response } from 'express';
import {
    addJobPostingApplicationHandler,
    deleteJobPostingApplicationHandler,
    editJobPostingApplicationStatusHandler,
    getJobPostingApplicationsHandler,
    getJobPostingApplicationsQueryHandler,
} from '../controllers/jobPostings.controller';
import * as db from './db';


import ApplicationModel from "../models/supportModels/application.model";
import UserModel from '../models/main/users.model';

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

    test('Adding a new application', async () => {
        const newApplication = {
            jobId: "123",
            employerId: "123",
            candidateId: "123",
            resumeId: "123",
            dateApplied: new Date(),
            status: "Pending",
        };

        const findApplicationEmpty = await ApplicationModel.find().exec();
        expect(findApplicationEmpty).toHaveLength(0);

        const mReq: Partial<Request> = {
            body: {
                jobId: newApplication.jobId,
                employerId: newApplication.employerId,
                candidateId: newApplication.candidateId,
                resumeId: newApplication.resumeId,
            },
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
            json: mJson,
        };
        const mNext = jest.fn();

        await addJobPostingApplicationHandler(mReq as Request, mRes as Response, mNext);

        const findApplication = await ApplicationModel.find().exec();


        expect(mRes.status).toHaveBeenCalledWith(201);
        expect(findApplication).toHaveLength(1);
        
    });

    test('Getting a job application', async () => {
        const newApplication = {
            jobId: "123",
            employerId: "123",
            candidateId: "123",
            resumeId: "123",
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
            jobId: application.jobId,
            employerId: application.employerId,
            candidateId: application.candidateId,
            resumeId: application.resumeId,
            dateApplied: application.dateApplied,
            status: application.status,
            __v: application.__v,
        }

        const jsonResponse = {
            _id : mJson.mock.calls[0][0]._id,
            jobId : mJson.mock.calls[0][0].jobId,
            employerId : mJson.mock.calls[0][0].employerId,
            candidateId : mJson.mock.calls[0][0].candidateId,
            resumeId : mJson.mock.calls[0][0].resumeId,
            dateApplied : mJson.mock.calls[0][0].dateApplied,
            status : mJson.mock.calls[0][0].status,
            __v : mJson.mock.calls[0][0].__v
        }

        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(jsonResponse).toStrictEqual(expected);
        
    });

    // test('Getting a job application (Does not exist)', async () => {
    //     const newApplication = {
    //         job_id: "123",
    //         employerId: "123",
    //         candidateId: "123",
    //         resumeId: "123",
    //         dateApplied: new Date(),
    //         status: "Pending",
    //     };
    //     const application = await ApplicationModel.create(newApplication);
    //     const mReq: Partial<Request> = {
    //         params: {
    //             id: "Not real" as string,
    //         },
    //     };
    //     const mJson = jest.fn().mockImplementation(() => null)
    //     const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
    //     const mRes: Partial<Response> = {
    //         status: mStatus,
    //     };
    //     const mNext = jest.fn();
    //     await getJobPostingApplicationsHandler(mReq as Request, mRes as Response, mNext);

    //     expect(mRes.status).toHaveBeenCalledWith(401);
    //     //Check if error
        
        
    // });

    test('Getting a job application with query', async () => {
        const old_education = ["Highschool"]
        const candidate = ["AJ", "Colin"];
        const employers = ["Sukmeet", "Ethan"];
        const job = ["Mcdonlds", "BurkerKing", "Banana"];
        const newuser = await UserModel.create({
            username: employers[0], 
            email: "aj@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        const newuser2 = await UserModel.create({
            username: employers[1], 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });

        const newApplication = {     
            jobId: job[0],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication2 = {     
            jobId:job[0],
            employerId:employers[0],
            candidateId: newuser2._id,
            resumeId:"wegwergergergergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication3 = {     
            jobId:job[1],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwwefgwehwrgwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const newApplication4 = {
            jobId:job[2],
            employerId: employers[1],
            candidateId: newuser2._id,
            resumeId:"wegwergerhhergherhwerhegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const application = await ApplicationModel.create(newApplication);
        const application2 = await ApplicationModel.create(newApplication2);
        const application3 = await ApplicationModel.create(newApplication3);
        const application4 = await ApplicationModel.create(newApplication4);

        
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();


        const mReq: Partial<Request> = {
            query: {
                jobId: job[0],
            },
        };
        await getJobPostingApplicationsQueryHandler(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({
            applications: expect.any(Array),
            total: 2,
            page: 1,
            pages: 1,
        });

        for (let i = 0; i < mJson.mock.calls[0][0].applications.length; i++) {
            expect(mJson.mock.calls[0][0].applications[i].jobId).toBe(job[0]);
        }


    });

    test('Getting a job application with query 2', async () => {
        const old_education = ["Highschool"]
        const candidate = ["AJ", "Colin"];
        const employers = ["Sukmeet", "Ethan"];
        const job = ["Mcdonlds", "BurkerKing", "Banana"];
        const newuser = await UserModel.create({
            username: employers[0], 
            email: "aj@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        const newuser2 = await UserModel.create({
            username: employers[1], 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });

        const newApplication = {     
            jobId: job[0],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication2 = {     
            jobId:job[0],
            employerId:employers[0],
            candidateId: newuser2._id,
            resumeId:"wegwergergergergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication3 = {     
            jobId:job[1],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwwefgwehwrgwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const newApplication4 = {
            jobId:job[2],
            employerId: employers[1],
            candidateId: newuser2._id,
            resumeId:"wegwergerhhergherhwerhegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const application = await ApplicationModel.create(newApplication);
        const application2 = await ApplicationModel.create(newApplication2);
        const application3 = await ApplicationModel.create(newApplication3);
        const application4 = await ApplicationModel.create(newApplication4);

        
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        const mReq: Partial<Request> = {
            query: {
                jobId: job[0],
                employerId: employers[0],
                page: "1",
                limit: "1",

            },
        };
        await getJobPostingApplicationsQueryHandler(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({
            applications: expect.any(Array),
            total: 2,
            page: 1,
            pages: 2,
        });
        for (let i = 0; i < mJson.mock.calls[0][0].applications.length; i++) {
            expect(mJson.mock.calls[0][0].applications[i].jobId).toBe(job[0]);
            expect(mJson.mock.calls[0][0].applications[i].employerId).toBe(employers[0]);
        }

    });

    test('Getting a job application with query 3 checking paging', async () => {
        const old_education = ["Highschool"]
        const candidate = ["AJ", "Colin"];
        const employers = ["Sukmeet", "Ethan"];
        const job = ["Mcdonlds", "BurkerKing", "Banana"];
        const newuser = await UserModel.create({
            username: employers[0], 
            email: "aj@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        const newuser2 = await UserModel.create({
            username: employers[1], 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });

        const newApplication = {     
            jobId: job[0],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication2 = {     
            jobId:job[0],
            employerId:employers[0],
            candidateId: newuser2._id,
            resumeId:"wegwergergergergwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };

        const newApplication3 = {     
            jobId:job[1],
            employerId:employers[0],
            candidateId: newuser._id,
            resumeId:"wegwwefgwehwrgwegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const newApplication4 = {
            jobId:job[2],
            employerId: employers[1],
            candidateId: newuser2._id,
            resumeId:"wegwergerhhergherhwerhegwe",
            dateApplied: new Date(),
            status: "Pending"
        };
        const application = await ApplicationModel.create(newApplication);
        const application2 = await ApplicationModel.create(newApplication2);
        const application3 = await ApplicationModel.create(newApplication3);
        const application4 = await ApplicationModel.create(newApplication4);

        
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        const mReq: Partial<Request> = {
            query: {
                page: "2",
                limit: "3",

            },
        };
        await getJobPostingApplicationsQueryHandler(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({
            applications: expect.any(Array),
            total: 4,
            page: 2,
            pages: 2,
        });

    });

    test('Deleting a job application', async () => {
        const newApplication = {
            jobId: "123",
            employerId: "123",
            candidateId: "123",
            resumeId: "123",
            dateApplied: new Date(),
            status: "Pending",
        };
        const application = await ApplicationModel.create(newApplication);
        const application2 = await ApplicationModel.create(newApplication);
        const mReq: Partial<Request> = {
            params: {
                id: application._id as string,
            },
        };

        const findApplication = await ApplicationModel.findById(application._id).exec();
        expect(findApplication).not.toBeNull();

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();
        await deleteJobPostingApplicationHandler(mReq as Request, mRes as Response, mNext);

        const findApplication2 = await ApplicationModel.findById(application._id).exec();
        const finalAll = await ApplicationModel.find().exec();
        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(findApplication2).toBeNull();
        expect(finalAll).toHaveLength(1);
    })

    test('Edit Application Status', async () => {
        const newApplication = {
            jobId: "123",
            employerId: "123",
            candidateId: "123",
            resumeId: "123",
            dateApplied: new Date(),
            status: "Pending",
        };
        const application = await ApplicationModel.create(newApplication);
        const mReq: Partial<Request> = {
            params: {
                id: application._id as string,
            },
            body: {
                status: "Accepted",
            },
        };

        const findApplication = await ApplicationModel.findById(application._id).exec();
        expect(findApplication?.status).toBe("Pending");

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();
        await editJobPostingApplicationStatusHandler(mReq as Request, mRes as Response, mNext);

        const findApplication2 = await ApplicationModel.findById(application._id).exec();
        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(findApplication2?.status).toBe("Accepted");
        
        
    })



});
