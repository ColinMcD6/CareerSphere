import request from "supertest"
import * as db from '../db'
import app from "../..";
import UserModel from "../../models/users.model";
import { CREATED, OK } from "../../constants/http";
import JobPostingsModel from "../../models/jobPostings.model";
import Quiz from "../../models/quiz.model";

describe('API Routes', () => {
    beforeAll(async () => {
        await db.connect()
    }, 10000);
    afterEach(async () => {
        await db.clearDatabase()
    }, 10000);
    afterAll(async () => {
        await db.closeDatabase()
    }, 10000);

    test('Create a job posting, create a quiz and verify results', async () => {
        const employer = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        // login
        const loginResponse = await request(app).post('/auth/login').send({
            email: "test_user@gmail.com", 
            password: "12345678",  
        });
        expect(loginResponse.status).toBe(OK);
        
        // Get cookie
        const cookies = Array.isArray(loginResponse.headers["set-cookie"])
        ? loginResponse.headers["set-cookie"]
        : [loginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(accessToken).toBeDefined();

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
            category: 1
        }

        const jobcreateResponse = await request(app).post('/job/add').send(jobPosting).set('Cookie', accessToken);
        expect(jobcreateResponse.status).toBe(CREATED)

        const jobCreated = await JobPostingsModel.findOne({
            title: "Job to do fun things"
        })
        const jobId = jobCreated?._id;

        const quizData = {
            quizName: "Test Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }]
        }

        const quizcreateResponse = await request(app).post(`/job/${jobId}/quizzes`).send(quizData).set('Cookie', accessToken)
        expect(quizcreateResponse.status).toBe(CREATED)
        expect(quizcreateResponse.body).toHaveProperty('message', 'Quiz created successfully')
        
        const quizCreated = await Quiz.findOne({
            jobId: jobId
        })
        expect(quizCreated?.quizName).toBe(quizData.quizName);
    });

    test('Create a job posting, create two quizzes, get all quizzes for the specific job', async () => {
        const employer = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        // login
        const loginResponse = await request(app).post('/auth/login').send({
            email: "test_user@gmail.com", 
            password: "12345678",  
        });
        expect(loginResponse.status).toBe(OK);
        
        // Get cookie
        const cookies = Array.isArray(loginResponse.headers["set-cookie"])
        ? loginResponse.headers["set-cookie"]
        : [loginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(accessToken).toBeDefined();

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
            category: 1
        }

        const jobcreateResponse = await request(app).post('/job/add').send(jobPosting).set('Cookie', accessToken);
        expect(jobcreateResponse.status).toBe(CREATED)

        const jobCreated = await JobPostingsModel.findOne({
            title: "Job to do fun things"
        })
        const jobId = jobCreated?._id;

        const quizData1 = {
            quizName: "Test Basics 1",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }]
        }

        const quizData2 = {
            quizName: "Test Basics 2",
            questions: [{ questionText: "What is React?", options: ["A", "B"], correctAnswer: "B" }]
        }

        const quizcreate1Response = await request(app).post(`/job/${jobId}/quizzes`).send(quizData1).set('Cookie', accessToken)
        expect(quizcreate1Response.status).toBe(CREATED)
        expect(quizcreate1Response.body).toHaveProperty('message', 'Quiz created successfully')

        const quizcreate2Response = await request(app).post(`/job/${jobId}/quizzes`).send(quizData2).set('Cookie', accessToken)
        expect(quizcreate2Response.status).toBe(CREATED)
        expect(quizcreate2Response.body).toHaveProperty('message', 'Quiz created successfully')
        
        const getquizzesResponse = await request(app).get(`/job/${jobId}/quizzes`).set('Cookie', accessToken)
        expect(getquizzesResponse.status).toBe(OK)
        expect(getquizzesResponse.body.quizzes.length).toBe(2)
        expect(getquizzesResponse.body.quizzes[0].quizName).toBe(quizData1.quizName)
        expect(getquizzesResponse.body.quizzes[1].quizName).toBe(quizData2.quizName)
    });

    test('Create a job posting, create a quiz, get quizzes for job and get specific quiz', async () => {
        const employer = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        // login
        const loginResponse = await request(app).post('/auth/login').send({
            email: "test_user@gmail.com", 
            password: "12345678",  
        });
        expect(loginResponse.status).toBe(OK);
        
        // Get cookie
        const cookies = Array.isArray(loginResponse.headers["set-cookie"])
        ? loginResponse.headers["set-cookie"]
        : [loginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(accessToken).toBeDefined();

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
            category: 1
        }

        const jobcreateResponse = await request(app).post('/job/add').send(jobPosting).set('Cookie', accessToken);
        expect(jobcreateResponse.status).toBe(CREATED)

        const jobCreated = await JobPostingsModel.findOne({
            title: "Job to do fun things"
        })
        const jobId = jobCreated?._id;

        const quizData = {
            quizName: "Test Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }]
        }

        const quizcreateResponse = await request(app).post(`/job/${jobId}/quizzes`).send(quizData).set('Cookie', accessToken)
        expect(quizcreateResponse.status).toBe(CREATED)
        expect(quizcreateResponse.body).toHaveProperty('message', 'Quiz created successfully')
        
        const getquizzesResponse = await request(app).get(`/job/${jobId}/quizzes`).set('Cookie', accessToken)
        const specquizId = getquizzesResponse.body.quizzes[0]._id

        const getspecquizResponse = await request(app).get(`/job/${jobId}/quizzes/${specquizId}`).set('Cookie', accessToken)
        expect(getspecquizResponse.status).toBe(OK)
        expect(getspecquizResponse.body.quiz.quizName).toBe(quizData.quizName)
    });

    test('Create a job posting, create a quiz, get quizzes for job, get specific quiz and submit response to quiz', async () => {
        const employer = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        const candidate = await UserModel.create({
            username: "test_user", 
            email: "test_user2@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
        });

        const candloginResponse = await request(app).post('/auth/login').send({
            email: "test_user2@gmail.com", 
            password: "12345678",  
        });
        expect(candloginResponse.status).toBe(OK);

        // login
        const emploginResponse = await request(app).post('/auth/login').send({
            email: "test_user@gmail.com", 
            password: "12345678",  
        });
        expect(emploginResponse.status).toBe(OK);
        
        // Get cookie
        const cookies = Array.isArray(emploginResponse.headers["set-cookie"])
        ? emploginResponse.headers["set-cookie"]
        : [emploginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        const empaccessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(empaccessToken).toBeDefined();

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
            category: 1
        }

        const jobcreateResponse = await request(app).post('/job/add').send(jobPosting).set('Cookie', empaccessToken);
        expect(jobcreateResponse.status).toBe(CREATED)

        // Get cookie
        const candcookies = Array.isArray(candloginResponse.headers["set-cookie"])
        ? candloginResponse.headers["set-cookie"]
        : [candloginResponse.headers["set-cookie"]];
        expect(candcookies).toBeDefined();
        const candaccessToken = candcookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(candaccessToken).toBeDefined();

        const jobCreated = await JobPostingsModel.findOne({
            title: "Job to do fun things"
        })
        const jobId = jobCreated?._id;

        const quizData = {
            quizName: "Test Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }, { questionText: "What is React?", options: ["A", "B"], correctAnswer: "B" }]
        }

        const quizcreateResponse = await request(app).post(`/job/${jobId}/quizzes`).send(quizData).set('Cookie', candaccessToken)
        expect(quizcreateResponse.status).toBe(CREATED)
        expect(quizcreateResponse.body).toHaveProperty('message', 'Quiz created successfully')
        
        const getquizzesResponse = await request(app).get(`/job/${jobId}/quizzes`).set('Cookie', candaccessToken)
        const specquizId = getquizzesResponse.body.quizzes[0]._id

        const submissionData = {
            responses: ["A", "A"],
        }
        const submitResponse = await request(app).post(`/job/${jobId}/quizzes/${specquizId}/submissions`).send(submissionData).set('Cookie', candaccessToken)
        expect(submitResponse.status).toBe(CREATED)
        expect(submitResponse.body.candidateUsername).toBe(candidate.username)
        expect(submitResponse.body.score).toBe(1)
    });

    test('Create a job posting, create a quiz, get quizzes for job, get specific quiz and submit response to quiz', async () => {
        const employer = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: "Fun, fun, fun",
            hiringDetails: [],
        });
        const candidate = await UserModel.create({
            username: "test_user", 
            email: "test_user2@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
        });

        const candloginResponse = await request(app).post('/auth/login').send({
            email: "test_user2@gmail.com", 
            password: "12345678",  
        });
        expect(candloginResponse.status).toBe(OK);

        // login
        const emploginResponse = await request(app).post('/auth/login').send({
            email: "test_user@gmail.com", 
            password: "12345678",  
        });
        expect(emploginResponse.status).toBe(OK);
        
        // Get cookie
        const cookies = Array.isArray(emploginResponse.headers["set-cookie"])
        ? emploginResponse.headers["set-cookie"]
        : [emploginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        const empaccessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(empaccessToken).toBeDefined();

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
            category: 1
        }

        const jobcreateResponse = await request(app).post('/job/add').send(jobPosting).set('Cookie', empaccessToken);
        expect(jobcreateResponse.status).toBe(CREATED)

        // Get cookie
        const candcookies = Array.isArray(candloginResponse.headers["set-cookie"])
        ? candloginResponse.headers["set-cookie"]
        : [candloginResponse.headers["set-cookie"]];
        expect(candcookies).toBeDefined();
        const candaccessToken = candcookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(candaccessToken).toBeDefined();

        const jobCreated = await JobPostingsModel.findOne({
            title: "Job to do fun things"
        })
        const jobId = jobCreated?._id;

        const quizData = {
            quizName: "Test Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }, { questionText: "What is React?", options: ["A", "B"], correctAnswer: "B" }]
        }

        const quizcreateResponse = await request(app).post(`/job/${jobId}/quizzes`).send(quizData).set('Cookie', candaccessToken)
        expect(quizcreateResponse.status).toBe(CREATED)
        expect(quizcreateResponse.body).toHaveProperty('message', 'Quiz created successfully')
        
        const getquizzesResponse = await request(app).get(`/job/${jobId}/quizzes`).set('Cookie', candaccessToken)
        const specquizId = getquizzesResponse.body.quizzes[0]._id

        const submissionData = {
            responses: ["A", "A"],
        }
        const submitResponse = await request(app).post(`/job/${jobId}/quizzes/${specquizId}/submissions`).send(submissionData).set('Cookie', candaccessToken)
        expect(submitResponse.status).toBe(CREATED)

        const getsubmissionResponse = await request(app).get(`/job/${jobId}/quizzes/${specquizId}/submissions`).set('Cookie', empaccessToken)
        expect(getsubmissionResponse.status).toBe(OK)
    });
});