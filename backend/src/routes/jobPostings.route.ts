import { Router } from "express";
import { 
    addJobPostingHandler,
    getJobPostingHandler,
    getAllJobPostingsHandler,
    getAllJobPostingsQueryHandler,
    addJobPostingApplicationHandler,
    deleteJobPostingApplicationHandler,
    getJobPostingApplicationsHandler,
    getJobPostingApplicationsQueryHandler
 } from "../controllers/jobPostings.controller";

const jobPostingRoutes = Router();

//prefix: /jobs
//Job Posting
jobPostingRoutes.get("/:id", getJobPostingHandler);
jobPostingRoutes.get("/", getAllJobPostingsQueryHandler);

jobPostingRoutes.post("/add", addJobPostingHandler);

//Applications
jobPostingRoutes.get("/applications/:id", getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", getJobPostingApplicationsQueryHandler);

jobPostingRoutes.post("/applications/apply/", addJobPostingApplicationHandler);

jobPostingRoutes.delete("/applications/delete/:id", deleteJobPostingApplicationHandler);



export default jobPostingRoutes;