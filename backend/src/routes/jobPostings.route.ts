import { Router } from "express";
import { 
    addJobPostingHandler,
    getJobPostingHandler,
    getAllJobPostingsHandler
 } from "../controllers/jobPostings.controller";

const jobPostingRoutes = Router();

//prefix: /jobs
jobPostingRoutes.post("/add", addJobPostingHandler);
jobPostingRoutes.get("/:id", getJobPostingHandler);
jobPostingRoutes.get("/", getAllJobPostingsHandler);


export default jobPostingRoutes;