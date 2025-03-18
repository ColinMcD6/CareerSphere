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


//Applications
jobPostingRoutes.get("/applications/:id", getJobPostingApplicationsHandler);
jobPostingRoutes.get("/applications/all/query", getJobPostingApplicationsQueryHandler);

jobPostingRoutes.put("/applications/edit/:id", editJobPostingApplicationStatusHandler);

jobPostingRoutes.post("/applications/apply/", addJobPostingApplicationHandler);

jobPostingRoutes.delete("/applications/delete/:id", deleteJobPostingApplicationHandler);



export default jobPostingRoutes;