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

import { addquizCandiateResponse, addquizHandler, getquizHandler, getquizSubmissions, getspecificquizHandler } from "../controllers/quiz.controller";


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
jobPostingRoutes.post("/:id/quizzes", addquizHandler);
jobPostingRoutes.get("/:id/quizzes", getquizHandler);
jobPostingRoutes.get("/:id/quizzes/:quizId", getspecificquizHandler);
jobPostingRoutes.post("/:id/quizzes/:quizId/submissions", addquizCandiateResponse);
jobPostingRoutes.get("/:id/quizzes/:quizId/submissions", getquizSubmissions);


//Applications
jobPostingRoutes.get("/applications/:id", getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", getJobPostingApplicationsQueryHandler);

jobPostingRoutes.put("/applications/edit/:id", editJobPostingApplicationStatusHandler);

jobPostingRoutes.post("/applications/apply/", addJobPostingApplicationHandler);

jobPostingRoutes.delete("/applications/delete/:id", deleteJobPostingApplicationHandler);



export default jobPostingRoutes;