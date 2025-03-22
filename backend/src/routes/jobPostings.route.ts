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


const jobPostingRoutes = Router();

//prefix: /jobs
//Job Posting: 
jobPostingRoutes.get("/:id", getJobPostingHandler);
jobPostingRoutes.get("/", getAllJobPostingsQueryHandler);

jobPostingRoutes.post("/add", addJobPostingHandler);


//saving jobs
jobPostingRoutes.post("/save", saveJobPostingHandler);
jobPostingRoutes.delete("/save/:id", unsaveJobPostingHandler);
jobPostingRoutes.get("/save/query", getSavedJobPostingsHandler);


// Quizzed for the job posting
jobPostingRoutes.post("/:id/quizzes", addQuizHandler);
jobPostingRoutes.get("/:id/quizzes", getQuizHandler);
jobPostingRoutes.get("/:id/quizzes/:quizId", getSpecificQuizHandler);
jobPostingRoutes.post("/:id/quizzes/:quizId/submissions", addQuizCandidateResponse);
jobPostingRoutes.get("/:id/quizzes/:quizId/submissions", getQuizSubmissions);


//Applications
jobPostingRoutes.get("/applications/:id", getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", getJobPostingApplicationsQueryHandler);

jobPostingRoutes.put("/applications/edit/:id", editJobPostingApplicationStatusHandler);

jobPostingRoutes.post("/applications/apply/", addJobPostingApplicationHandler);

jobPostingRoutes.delete("/applications/delete/:id", deleteJobPostingApplicationHandler);



export default jobPostingRoutes;