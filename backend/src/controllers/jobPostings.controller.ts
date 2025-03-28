import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { CREATED, OK } from "../constants/http.constants";
import {
    addJobPostingApplication,
    createJobPosting,
    deleteJobPostingApplication,
    editJobPostingApplicationStatus,
    getAllJobPostingsQueryWithSaved,
    getJobPostingApplications,
    getJobPostingAndApplication,
    getJobPostingApplicationsQuery,
    getSavedJobPostings,
    saveJobPosting,
    unsaveJobPosting
} from "../services/jobPostings.services";

import catchErrors from "../utils/catchErrors";
import JobPostingValidation from "../utils/JobPostingValidation"

const saveJobPostingModel = z.object({
    job_id: z.string().min(1).max(225),
    candidate_id: z.string().min(1).max(225)
})
  
const jobApplicationModel = z.object({
    job_id: z.string().min(1).max(225),
    employer_id: z.string().min(1).max(225),
    candidate_id: z.string().min(1).max(225),
    resume_id: z.string().min(1).max(225),
    dateApplied: z.date(),
    status: z.enum(['Pending', 'Accepted', 'Rejected'])
})


/**
 * * Job Posting Controller
 * * @description - This controller handles the process of creating, retrieving, updating, and deleting job postings.
 * * @param {Request} req - The request object containing the job posting data.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job posting operation fails.
 */
export const addJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {

    console.log("Received a request to create a new job posting");
    const job  = {
        title: req.body.title,
        description: req.body.description,
        positionTitle: req.body.positionTitle,
        employer: req.userId, // This should probably be company name
        employer_id: req.userId,
        location: req.body.location,
        compensationType: req.body.compensationType,
        salary: req.body.salary,
        jobType: req.body.jobType,
        experience: req.body.experience,
        skills: req.body.skills,
        education: req.body.education,
        status: req.body.status,
        category: req.body.category,
        dueDate: req.body.dueDate,
        startDate: req.body.startDate
    }

    const request = JobPostingValidation.parse(job);
    const jobResult = await createJobPosting(request);
    res.status(CREATED).json(jobResult);
});


/**
 * * * Get Job Posting Handler
 * * @description - This handler retrieves a specific job posting by its ID and optionally includes the application status for a specific candidate.
 * * @param {Request} req - The request object containing the job posting ID and candidate ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job posting retrieval fails.
 */
export const getJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const candidate_id = req.query.candidate_id

    const jobPosting = await getJobPostingAndApplication(id, candidate_id);
    res.status(OK).json(jobPosting);
})

export const getAllJobPostingsQueryHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const queryFieldNames = Object.keys(req.query);

    // Extract query fields from the request query but removes page and limit
    const query = queryFieldNames.reduce((acc, key) => {

        if (key !== 'page' && key !== 'limit' && key !== 'saved_posting_candidate_id' && key !== 'user_id' && key !== 'search') {
            acc[key] = req.query[key];
        }
        return acc;
    }, {} as Record<string, any>);

    // Handle the search query parameters
    if (req.query.search) {
        const searchTerm = req.query.search.toString();
        const searchRegex = new RegExp(searchTerm, "i");
        // Look for the search term in these fields.
        query.$or = [
          { title: { $regex: searchRegex } },
          { positionTitle: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { employer: { $regex: searchRegex } },
          { location: { $regex: searchRegex } },
          { skills: { $elemMatch: { $regex: searchRegex } } },
        ];
    }

    console.log("Received a request to get all job posts");
    
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const saved_posting_candidate_id = req.query.saved_posting_candidate_id ? req.query.saved_posting_candidate_id as string : null;
    const user_id = req.query.user_id ? req.query.user_id as any: null;
    const jobPostings = await getAllJobPostingsQueryWithSaved(query, page, limit, saved_posting_candidate_id, user_id);
    res.status(OK).json(jobPostings);
})

// SAVING JOBS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * * Save Job Posting Handler
 * * @description - This handler saves a job posting for a specific candidate.
 * * @param {Request} req - The request object containing the job posting ID and candidate ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job posting saving fails.
 */
export const saveJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received a request to save a job posting");
    
    const saved_posting = {
        job_id: req.body.job_id,
        candidate_id: req.body.candidate_id,
    }
    const request = saveJobPostingModel.parse(saved_posting);
    const savedJob = await saveJobPosting(request);
    res.status(CREATED).json(savedJob);
});

/**
 * * Unsaved Job Posting Handler
 * * @description - This handler removes a saved job posting for a specific candidate.
 * * @param {Request} req - The request object containing the job posting ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job posting unsaving fails.
 */
export const unsaveJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    console.log("Received a request to unsave a job posting");
    const saved_posting = await unsaveJobPosting(id);
    res.status(OK).json(saved_posting);
})



/**
 * * Get Saved Job Postings Handler
 * * @description - This handler retrieves saved job postings for a specific candidate.
 * * @param {Request} req - The request object containing the candidate ID and optional job ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the saved job postings retrieval fails.
 */
export const getSavedJobPostingsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const candidate_id = req.query.candidate_id;
    const job_id = req.query.job_id;
    const savedPostings = await getSavedJobPostings(candidate_id, job_id);
    res.status(OK).json(savedPostings);
})

//APPLICATIONS----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/**
 * * Add Job Posting Application Handler
 * * @description - This handler adds a job application for a specific job posting.
 * * @param {Request} req - The request object containing the job application data.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job application addition fails.
 */
export const addJobPostingApplicationHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received a request to create a new job application");
    const jobApplication = {
        job_id: req.body.job_id,
        employer_id: req.body.employer_id,
        candidate_id: req.body.candidate_id,
        resume_id: req.body.resume_id,
        dateApplied: new Date(),
        status: "Pending"
    }
    const request = jobApplicationModel.parse(jobApplication);
    const application = await addJobPostingApplication(request);
    res.status(CREATED).json(application);
})


/**
 * * Edit Job Posting Application Status Handler
 * * @description - This handler edits the status of a job application for a specific job posting.
 * * @param {Request} req - The request object containing the job application ID and new status.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job application status editing fails.
 */
export const editJobPostingApplicationStatusHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const status = req.body.status;
    const application = await editJobPostingApplicationStatus(id, status);
    res.status(OK).json(application);

})


/**
 * * Delete Job Posting Application Handler
 * * @description - This handler deletes a job application for a specific job posting.
 * * @param {Request} req - The request object containing the job application ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job application deletion fails.
 */
export const deleteJobPostingApplicationHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const application = await deleteJobPostingApplication(id);
    res.status(OK).json(application);
})


/**
 * * Get Job Posting Applications Handler
 * * @description - This handler retrieves applications for a specific job posting.
 * * @param {Request} req - The request object containing the job posting ID.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job application retrieval fails.
 */
export const getJobPostingApplicationsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    const application = await getJobPostingApplications(id);
    res.status(OK).json(application);
})



/**
 * * Get Job Posting Applications Query Handler
 * * @description - This handler retrieves applications for a specific job posting based on query parameters.
 * * @param {Request} req - The request object containing the query parameters for filtering and pagination.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the job application retrieval fails.
 */
export const getJobPostingApplicationsQueryHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        const queryFieldNames = Object.keys(req.query);

        // Extract query fields from the request query but removes page and limit
        const query = queryFieldNames.reduce((acc, key) => {
            if (key !== 'page' && key !== 'limit') {
                acc[key] = req.query[key];
            }
            return acc;
        }, {} as Record<string, any>);

        console.log("Received request to get job applications");
    
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
        const applications = await getJobPostingApplicationsQuery(query, page, limit);
        res.status(OK).json(applications);  
})
