import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import Quiz from "../models/quiz.model";
import JobPostingsModel from "../models/jobPostings.model";
import mongoose from "mongoose";
import UserModel from "../models/users.model";
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK } from "../constants/http";
import appAssert from "../utils/appAssert";

/* Example fo sending requesting from fronend to this is :
    post request to /job/{job_id}/quizzes
    {
    "questions": [
        {
        "questionText": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correctAnswer": "Paris"
        },
        {
        "questionText": "Which is the largest planet in our solar system?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "correctAnswer": "Jupiter"
        }
    ]
    }
*/

export const addquizHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobId = req.params.id;
        const { quizName, questions } = req.body;

        // Validate jobId
        appAssert(mongoose.isValidObjectId(jobId), BAD_REQUEST, "Invalid data");

        appAssert(quizName, BAD_REQUEST, "Invalid data")

        appAssert(questions && Array.isArray(questions) && questions.length > 0, BAD_REQUEST, "Invalid data")

        // Find the job posting
        const jobPosting = await JobPostingsModel.findById(jobId);
        appAssert(jobPosting, NOT_FOUND, "Job not found!");

        // Create a new quiz
        const newQuiz = new Quiz({ jobId, quizName, questions });
        await newQuiz.save();

        // Link the new quiz to the job posting
        jobPosting.quizzes.push(newQuiz._id?.toString() || "");
        await jobPosting.save();

        res.status(CREATED).json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
        next(error);
    }
});

/* Example fo sending requesting from fronend to this is :
    get request to /job/{job_id}/quizzes
*/

export const getquizHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id;
      appAssert(mongoose.isValidObjectId(jobId),BAD_REQUEST, "Invalid Data")

      const quizzes = await Quiz.find({ jobId });
      appAssert(!(quizzes.length == 0), NOT_FOUND, "No quizzes found for this job")
  
      res.status(OK).json({ quizzes });
    } catch (error) {
      next(error);
    }
});

/* Example to sending requesting from fronend to this is :
    get request to /job/{job_id}/quizzes/{quiz_id}
*/

export const getspecificquizHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: jobId, quizId } = req.params;
      appAssert((mongoose.isValidObjectId(jobId) && mongoose.isValidObjectId(quizId)),BAD_REQUEST, "Invalid Data")

      const quiz = await Quiz.findOne({ _id: quizId, jobId });
      appAssert(quiz, NOT_FOUND, "Quiz Not found")
  
      res.status(OK).json({ quiz });
    } catch (error) {
      next(error);
    }
});

/* Example to add candidate response: 
  {
    "candidateId": "67c200ea9db3f04cf9144657",
    "responses": [
      "Paris",
      "Jupiter"
    ]
  }
*/

/* Example to add candidate response: */
export const addquizCandiateResponse = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const { responses } = req.body;
    const candidateId = req.userId;

    console.log(candidateId)

    appAssert(mongoose.isValidObjectId(candidateId), BAD_REQUEST, "Invalid Data")

    appAssert(mongoose.isValidObjectId(quizId), BAD_REQUEST, "Invalid Data")

    appAssert(responses, BAD_REQUEST, "Invalid Data")

    const user = await UserModel.findById(candidateId);
    appAssert(user, NOT_FOUND, "Not Found")
    
    const candidateUsername = user?.username || "";
    const quiz = await Quiz.findById(quizId);
    appAssert(quiz, NOT_FOUND, "Quiz not found")

    // Check if the candidate has already submitted
    const existingSubmission = quiz.submissions.find(sub => sub.candidateId === candidateId);
    appAssert(!existingSubmission, CONFLICT, "Candidate has already submitted this quiz")

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (responses[index] && responses[index] === question.correctAnswer) {
        score += 1;
      }
    });

    quiz.submissions.push({ candidateId, candidateUsername, score });
    await quiz.save();

    res.status(CREATED).json({ message: "Submission recorded successfully", candidateUsername, score });
  } catch (error) {
    next(error);
  }
});

export const getquizSubmissions = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    appAssert(mongoose.isValidObjectId(quizId), BAD_REQUEST, "Invalid Data")

    const quiz = await Quiz.findById(quizId);
    appAssert(quiz, NOT_FOUND, "Quiz not found")

    res.status(OK).json({ submissions: quiz.submissions });
  } catch (error) {
    next(error);
  }
});