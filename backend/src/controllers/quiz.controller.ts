import e, { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import Quiz from "../models/quiz.model";
import JobPostingsModel from "../models/jobPostings.model";
import { Mongoose } from "mongoose";
import UserModel from "../models/users.model";

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
        const jobId = req.params.id
        const { quizName, questions } = req.body;
        if (!jobId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Invalid quiz data" });
        }
        const newQuiz = new Quiz({
            jobId,
            quizName,
            questions,
        });
        await newQuiz.save();

        // Update the Job Posting with the new quiz ID
        const jobPosting = await JobPostingsModel.findById(jobId);
        if (jobPosting) {
        if (!jobPosting.quizzes.includes(newQuiz._id?.toString() || "")) {
            jobPosting.quizzes.push(newQuiz._id?.toString() || "");
            await jobPosting.save();
        }
        }

        res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
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
      const quizzes = await Quiz.find({ jobId });
      
      if (!quizzes.length) {
        return res.status(404).json({ message: "No quizzes found for this job" });
      }
  
      res.status(200).json({ quizzes });
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
      const quiz = await Quiz.findOne({ _id: quizId, jobId });
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found for this job" });
      }
  
      res.status(200).json({ quiz });
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

    if (!candidateId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const user = await UserModel.findById(candidateId);
    if (!user) {
      return res.status(400).json({ message: "User Not Found"});
    }
    const candidateUsername = user?.username || "";

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log(candidateId);
    // Check if the candidate has already submitted
    const existingSubmission = quiz.submissions.find(sub => sub.candidateId === candidateId);
    if (existingSubmission) {
      return res.status(400).json({ message: "Candidate has already submitted this quiz" });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (responses[index] && responses[index] === question.correctAnswer) {
        score += 1;
      }
    });

    quiz.submissions.push({ candidateId, candidateUsername, score });
    await quiz.save();

    res.status(201).json({ message: "Submission recorded successfully", candidateUsername, score });
  } catch (error) {
    next(error);
  }
});

export const getquizSubmissions = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ submissions: quiz.submissions });
  } catch (error) {
    next(error);
  }
});