import { Router } from "express";
import { 
    addJobPostingHandler,
    getJobPostingHandler,
    getAllJobPostingsHandler,
    getAllJobPostingsQueryHandler,
    addJobPostingApplicationHandler,
    deleteJobPostingApplicationHandler,
    getJobPostingApplicationsHandler,
    getJobPostingApplicationsQueryHandler,
    saveJobPostingHandler,
    unsaveJobPostingHandler
 } from "../controllers/jobPostings.controller";

const jobPostingRoutes = Router();

//prefix: /jobs
//Job Posting: 
jobPostingRoutes.get("/:id", getJobPostingHandler);
jobPostingRoutes.get("/", getAllJobPostingsQueryHandler);

jobPostingRoutes.post("/add", addJobPostingHandler);

//saving jobs
jobPostingRoutes.post("/save", saveJobPostingHandler);
jobPostingRoutes.delete("/save/:id", unsaveJobPostingHandler);


//Applications
jobPostingRoutes.get("/applications/:id", getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", getJobPostingApplicationsQueryHandler);

jobPostingRoutes.post("/applications/apply/", addJobPostingApplicationHandler);

jobPostingRoutes.delete("/applications/delete/:id", deleteJobPostingApplicationHandler);



export default jobPostingRoutes;