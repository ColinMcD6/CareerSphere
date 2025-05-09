import { Request, Response } from "express";
import { BAD_REQUEST, NOT_FOUND, CREATED, OK, CONFLICT } from "../constants/http.constants";
import { addQuizCandidateResponse, addQuizHandler, getQuizHandler, getQuizSubmissions, getSpecificQuizHandler } from "../controllers/quiz.controller";
import JobPostingsModel from "../models/main/jobPostings.model";
import Quiz from "../models/main/quiz.model";
import * as db from './db'
import UserModel from "../models/main/users.model";
import mongoose from "mongoose";

describe("Quizzes Unit Tests", () => {
    beforeAll(async () => {
        await db.connect()
    });
    
    afterEach(async () => {
        await db.clearDatabase()
    });
    
    afterAll(async () => {
        await db.closeDatabase()
    });
    
    test("should successfully create a quiz and update job posting", async () => {
        // Create job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const mReq: Partial<Request> = {
            body: {
                quizName: "Test Basics",
                questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            },
            params: { id: jobPosting._id?.toString() || ""}
        };

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();

        await addQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(CREATED);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Quiz created successfully" })
        );

        // Fetch updated job from DB and check if quiz was added
        const updatedJob = await JobPostingsModel.findById(jobPosting._id).populate("quizzes");
        expect(updatedJob).not.toBeNull();
        expect(updatedJob?.quizzes.length).toBe(1);

        // Fetch the quiz and verify if the quiz with the name was saved
        const quizData = await Quiz.findOne({
            jobId: jobPosting._id
        });
        expect(quizData?.quizName).toBe("Test Basics")
    });

    test("should return Bad Request as there are no quiz questions", async () => {
        // Create job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const mReq: Partial<Request> = {
            body: {
                quizName: "Test Basics",
                questions: [],
            },
            params: { id: jobPosting._id?.toString() || "" }
        };

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();

        await addQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Invalid data")

        // Fetch updated job from DB and check if quiz was added
        const updatedJob = await JobPostingsModel.findById(jobPosting._id).populate("quizzes");
        expect(updatedJob?.quizzes.length).toBe(0);

        // Fetch the quiz and verify if the quiz with the name was saved
        const quizData = await Quiz.findOne({
            jobId: jobPosting._id
        });
        expect(quizData).toBeNull
    });

    test("should return Bad Request as there is no quizname", async () => {
        // Create job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const mReq: Partial<Request> = {
            body: {
                questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            },
            params: { id: jobPosting._id?.toString() || "" }
        };

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();

        await addQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Invalid data")

        // Fetch updated job from DB and check if quiz was added
        const updatedJob = await JobPostingsModel.findById(jobPosting._id).populate("quizzes");
        expect(updatedJob?.quizzes.length).toBe(0);

        // Fetch the quiz and verify if the quiz with the name was saved
        const quizData = await Quiz.findOne({
            jobId: jobPosting._id
        });
        expect(quizData).toBeNull
    });

    test("should return Not Found as job is not created", async () => {
        const mReq: Partial<Request> = {
            body: {
                questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            },
            params: { id: new mongoose.Types.ObjectId().toString()}
        };

        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();

        await addQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Invalid data")
    });

    test("should successfully return quizzes for a valid job ID", async () => {
        // Create a job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        // Create quizzes linked to the job
        const quiz1 = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "Test Quiz 1",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
        });

        const quiz2 = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "Test Quiz 2",
            questions: [{ questionText: "What is React?", options: ["A", "B"], correctAnswer: "B" }],
        });

        const mReq: Partial<Request> = {
            params: { id: jobPosting._id?.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(OK);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({
                quizzes: expect.arrayContaining([
                    expect.objectContaining({ quizName: quiz1.quizName }),
                    expect.objectContaining({ quizName: quiz2.quizName }),
                ]),
            })
        );
    });

    test("should return Not Found if no quizzes exist for the job", async () => {
        // Create job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const mReq: Partial<Request> = {
            params: { id: jobPosting._id?.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getQuizHandler(mReq as Request, mRes as Response, mNext);

        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("No quizzes found for this job")
    });

    test("should successfully return a specific quiz for a valid job and quiz ID", async () => {
        // Create a job posting in DB
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        // Create a quiz linked to the job
        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "Test Quiz",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
        });

        const mReq: Partial<Request> = {
            params: { id: jobPosting._id?.toString() || "", quizId: quiz._id?.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getSpecificQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(OK);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({
                quiz: expect.objectContaining({ quizName: "Test Quiz" }),
            })
        );
    });

    test("should successfully not found as the quiz is not created", async () => {
        const jobid = new mongoose.Types.ObjectId()
        const quizid = new mongoose.Types.ObjectId()

        const mReq: Partial<Request> = {
            params: { id: jobid.toString() || "", quizId: quizid.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getSpecificQuizHandler(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Quiz Not found")
    });

    test("should successfully submit quiz responses and calculate score", async () => {
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });
        // Create a candidate user
        const candidate = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Candidate"
        });

        // Create a quiz with questions
        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "React Basics",
            questions: [
                { questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" },
                { questionText: "What is React?", options: ["A", "B"], correctAnswer: "B" },
            ],
            submissions: [],
        });

        const mReq: Partial<Request> = {
            params: { quizId: quiz._id?.toString() || "" },
            body: {
                responses: ["A", "B"],
            },
            userId: candidate._id?.toString()
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await addQuizCandidateResponse(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(CREATED);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Submission recorded successfully", candidateUsername: "test_user", score: 2 })
        );

        // Verify submission is stored in DB
        const updatedQuiz = await Quiz.findById(quiz._id);
        expect(updatedQuiz?.submissions.length).toBe(1);
        expect(updatedQuiz?.submissions[0].candidateUsername).toBe("test_user");
        expect(updatedQuiz?.submissions[0].score).toBe(2);
    });

    test("should return Bad Request when candidate ID or responses are missing", async () => {
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "React Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            submissions: [],
        });

        const mReq: Partial<Request> = {
            params: { quizId: quiz._id?.toString() || "" },
            body: {},
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await addQuizCandidateResponse(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Invalid Data")
    });

    test("should return conflict if candidate has already submitted", async () => {
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        const candidate = await UserModel.create({
            username: "test_user", 
            email: "test_user@gmail.com", 
            password: "12345678", 
            userRole: "Candidate"
        });

        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "React Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            submissions: [{ candidateId: candidate._id?.toString(), candidateUsername: "test_candidate", score: 1 }],
        });

        const mReq: Partial<Request> = {
            params: { quizId: quiz._id?.toString() || "" },
            body: {
                responses: ["A"],
            },
            userId: candidate._id?.toString()
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await addQuizCandidateResponse(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Candidate has already submitted this quiz")
    });

    test("should return quiz submissions successfully", async () => {
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        // Create a quiz with submissions
        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "React Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            submissions: [
                { candidateId: "user_1", candidateUsername: "test_user_1", score: 2 },
                { candidateId: "user_2", candidateUsername: "test_user_2", score: 1 },
            ],
        });

        const mReq: Partial<Request> = {
            params: { quizId: quiz._id?.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getQuizSubmissions(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(OK);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({
                submissions: expect.arrayContaining([
                    expect.objectContaining({ candidateUsername: "test_user_1", score: 2 }),
                    expect.objectContaining({ candidateUsername: "test_user_2", score: 1 }),
                ]),
            })
        );
    });

    test("should return an empty array if quiz has no submissions", async () => {
        const jobPosting = await JobPostingsModel.create({
            title: "Job to do fun things",
            description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
            positionTitle: "Software Developer",
            location: "Winnipeg",
            compensationType: "hourly",
            employer: "test_employer",
            employerId: "test_employer_123",
            salary: 100,
            jobType: "Full-time",
            experience: ["None"],
            skills: ["ChatGPT"],
            education: ["None"],
            status: "Open",
            startingDate: Date.now().toString(),
            quizzes: [],
        });

        // Create a quiz with no submissions
        const quiz = await Quiz.create({
            jobId: jobPosting._id,
            quizName: "React Basics",
            questions: [{ questionText: "What is JSX?", options: ["A", "B"], correctAnswer: "A" }],
            submissions: [],
        });

        const mReq: Partial<Request> = {
            params: { quizId: quiz._id?.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getQuizSubmissions(mReq as Request, mRes as Response, mNext);

        // Verify response
        expect(mRes.status).toHaveBeenCalledWith(OK);
        expect(mJson).toHaveBeenCalledWith(
            expect.objectContaining({ submissions: [] })
        );
    });

    test("should return an empty array if quiz has no submissions", async () => {
        const fakequizid = new mongoose.Types.ObjectId()

        const mReq: Partial<Request> = {
            params: { quizId: fakequizid.toString() || "" },
        };

        const mJson = jest.fn().mockImplementation(() => null);
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        const mRes: Partial<Response> = {
            status: mStatus,
        };
        const mNext = jest.fn();

        await getQuizSubmissions(mReq as Request, mRes as Response, mNext);

        // Verify response
        let error: Error = mNext.mock.calls[0][0];
        expect(error.message).toBe("Quiz not found")
    });
});
