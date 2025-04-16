import appAssert from "../utils/appAssert";
import quizDAO from '../repositories/quiz.repository'
import jobPostingsDAO from "../repositories/jobPosting.repository";
import userDAO from "../repositories/user.repository";
import catchErrors from "../utils/catchErrors";
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK } from "../constants/http.constants";
import { getSpecificQuizHandler } from "../controllers/quiz.controller";

export const addQuiz = async (jobId: string, quizName:string, questions:string) => {
    // Validate jobId
    appAssert(jobPostingsDAO.isValidId(jobId), BAD_REQUEST, "Invalid data");

    appAssert(quizName, BAD_REQUEST, "Invalid data")

    appAssert(questions && Array.isArray(questions) && questions.length > 0, BAD_REQUEST, "Invalid data")

    // Find the job posting
    const jobPosting = await jobPostingsDAO.findById(jobId);
    appAssert(jobPosting, NOT_FOUND, "Job not found!");

    // Create a new quiz
    const quizInput : any = {jobId, quizName, questions};
    const createdQuiz = await quizDAO.create(quizInput);

    // Link the new quiz to the job posting
    jobPosting.quizzes.push(createdQuiz._id?.toString() || "");
    await jobPostingsDAO.save(jobPosting);

    return createdQuiz;
}


export const getQuiz = async (jobId: string) => {
    appAssert(jobPostingsDAO.isValidId(jobId),BAD_REQUEST, "Invalid Data")

    const quizzes = await quizDAO.findByJobId(jobId);
    appAssert(!(quizzes.length == 0), NOT_FOUND, "No quizzes found for this job")

    return quizzes;
}


export const getSpecificQuiz = async (jobId: string, quizId: string) => {
    appAssert((jobPostingsDAO.isValidId(jobId) && jobPostingsDAO.isValidId(quizId)),BAD_REQUEST, "Invalid Data")
      
    const quiz = await quizDAO.findQuizByQuizIdJobId( quizId, jobId );
    appAssert(quiz, NOT_FOUND, "Quiz Not found")


    return quiz;
}

export const addQuizCandidateResponseService = async (quizId: string, candidateId: string, responses: any) => {
    appAssert(quizDAO.isValidId(candidateId), BAD_REQUEST, "Invalid Data")

    appAssert(quizDAO.isValidId(quizId), BAD_REQUEST, "Invalid Data")

    appAssert(responses, BAD_REQUEST, "Invalid Data")

    const user = await userDAO.findById(candidateId);
    appAssert(user, NOT_FOUND, "Not Found")
    
    const candidateUsername = user?.username || "";
    const quiz = await quizDAO.findByQuizId(quizId);
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
    await quizDAO.save(quiz);


    return {
        candidateUsername,
        score
    }
}


export const getQuizSubmissionsService = async (quizId: string) => {
    appAssert(quizDAO.isValidId(quizId), BAD_REQUEST, "Invalid Data")

    const quiz = await quizDAO.findByQuizId(quizId);
    appAssert(quiz, NOT_FOUND, "Quiz not found")

    return quiz.submissions;
}