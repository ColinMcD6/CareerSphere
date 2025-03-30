import { Router } from "express";
import {
    addJobPostingApplicationHandler,
    addJobPostingHandler,
    deleteJobPostingApplicationHandler,
    editJobPostingApplicationStatusHandler,
    getAllJobPostingsQueryHandler,
    getJobPostingApplicationsHandler,
    getJobPostingApplicationsQueryHandler,
    getJobPostingHandler,
    getSavedJobPostingsHandler,
    saveJobPostingHandler,
    unsaveJobPostingHandler
} from "../controllers/jobPostings.controller";

import { addQuizCandidateResponse, addQuizHandler, getQuizHandler, getQuizSubmissions, getSpecificQuizHandler } from "../controllers/quiz.controller";
import { auth_verifyCandidate, auth_verifyEmployer } from "../middleware/authenticate.middleware";


const jobPostingRoutes = Router();

//prefix: /job
//Job Posting: 
jobPostingRoutes.get("/:id", getJobPostingHandler);
jobPostingRoutes.get("/", getAllJobPostingsQueryHandler);
jobPostingRoutes.post("/add", auth_verifyEmployer, addJobPostingHandler);

//saving jobs
jobPostingRoutes.post("/save", saveJobPostingHandler);
jobPostingRoutes.delete("/save/:id", unsaveJobPostingHandler);
jobPostingRoutes.get("/save/query", getSavedJobPostingsHandler);

// Quizzed for the job posting
jobPostingRoutes.post("/:id/quizzes", auth_verifyEmployer, addQuizHandler);
jobPostingRoutes.get("/:id/quizzes", getQuizHandler);
jobPostingRoutes.get("/:id/quizzes/:quizId", getSpecificQuizHandler);
jobPostingRoutes.post("/:id/quizzes/:quizId/submissions", auth_verifyCandidate, addQuizCandidateResponse);
jobPostingRoutes.get("/:id/quizzes/:quizId/submissions", auth_verifyEmployer, getQuizSubmissions);

//Applications
jobPostingRoutes.get("/applications/:id", auth_verifyEmployer, getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", auth_verifyEmployer, getJobPostingApplicationsQueryHandler);
jobPostingRoutes.put("/applications/edit/:id", auth_verifyEmployer, editJobPostingApplicationStatusHandler);
jobPostingRoutes.post("/applications/apply/", auth_verifyCandidate, addJobPostingApplicationHandler);
jobPostingRoutes.delete("/applications/delete/:id", auth_verifyEmployer, deleteJobPostingApplicationHandler);

export default jobPostingRoutes;
