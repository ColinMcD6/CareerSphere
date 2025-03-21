import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { CREATED, OK } from "../constants/http";
import {
    addJobPostingApplication,
    createJobPosting,
    deleteJobPostingApplication,
    editJobPostingApplicationStatus,
    getAllJobPostings,
    getAllJobPostingsQueryWithSaved,
    getJobPostingApplications,
    getJobPostingApplicationsQuery,
    getJobPostingImproved,
    getSavedJobPostings,
    saveJobPosting,
    unsaveJobPosting
} from "../services/jobPostings.services";

import catchErrors from "../utils/catchErrors";
import { Category } from "../common/Category";



const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 150; 

const MAX_DESCRIPTION_LENGTH = 20000;
const MIN_DESCRIPTION_LENGTH = 50;

const MAX_POSITION_LENGTH = 100;
const MIN_POSITION_LENGTH = 5;

const jobPostingsZModel = z.object({
    title: z.string().min(MIN_TITLE_LENGTH, `Title length must be a minimum of ${MIN_TITLE_LENGTH} characters long`).max(MAX_TITLE_LENGTH, `Title length can be a maximum of ${MAX_TITLE_LENGTH} characters long`),
    positionTitle: z.string().min(MIN_POSITION_LENGTH, `Position Title must have a minimum of ${MIN_POSITION_LENGTH} characters`).max(MAX_DESCRIPTION_LENGTH, `Position Title can have a maximum of ${MAX_POSITION_LENGTH} characters` ),
    description: z.string().min(MIN_DESCRIPTION_LENGTH, `Description must have a minimum of ${MIN_DESCRIPTION_LENGTH} characters`).max(MAX_DESCRIPTION_LENGTH, `Description can have a maximum of ${MAX_DESCRIPTION_LENGTH} characters` ),
    employer: z.string().min(1).max(225),
    employer_id: z.string().min(1).max(225),
    location: z.string().min(1, "Location must have at least 1 character").max(225),
    compensationType: z.enum(['do-not-disclose', 'hourly', 'salary']),
    salary: z.number().min(0, "Salary value must be greater than 0"),
    experience: z.array(z.string()), 
    skills: z.array(z.string()),
    education: z.array(z.string()),
    status: z.string().min(1).max(225), // Change to open/close later
    startingDate: z.string(), // I am not sure what to do about this right now, but this should be a date
    jobType: z.enum(['Full-time', 'Part-time', 'Temporary', 'Internship']),
    category: z.nativeEnum(Category)
})

const saveJobPostingModel = z.object({
    job_id: z.string().min(1).max(225),
    candidate_id: z.string().min(1).max(225)
})

import JobPostingValidation from "../common/JobPostingValidation"
  
const jobApplicationModel = z.object({
    job_id: z.string().min(1).max(225),
    employer_id: z.string().min(1).max(225),
    candidate_id: z.string().min(1).max(225),
    resume_id: z.string().min(1).max(225),
    dateApplied: z.date(),
    status: z.enum(['Pending', 'Accepted', 'Rejected'])
})

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
    const user = await createJobPosting(request);
    res.status(CREATED).json(request);
});

export const getJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const candidate_id = req.query.candidate_id

    const jobPosting = await getJobPostingImproved(id, candidate_id);
    res.status(OK).json(jobPosting);
})

// Is this Defunct now ??
export const getAllJobPostingsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const jobPostings = await getAllJobPostings(page, limit);
    res.status(OK).json(jobPostings);
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

    // Handle the search query paramete
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
    console.log(jobPostings);
    res.status(OK).json(jobPostings);
})

// SAVING JOBS ----------------------------------------------
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

export const unsaveJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    console.log("Received a request to unsave a job posting");
    const saved_posting = await unsaveJobPosting(id);
    res.status(OK).json(saved_posting);
})


export const getSavedJobPostingsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const candidate_id = req.query.candidate_id;
    const job_id = req.query.job_id;
    const savedPostings = await getSavedJobPostings(candidate_id, job_id);
    res.status(OK).json(savedPostings);
})




//APPLICATIONS----------------------------------------------
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

export const editJobPostingApplicationStatusHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const status = req.body.status;
    const application = await editJobPostingApplicationStatus(id, status);
    res.status(OK).json(application);

})

export const deleteJobPostingApplicationHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const application = await deleteJobPostingApplication(id);
    res.status(OK).json(application);
})

export const getJobPostingApplicationsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    const application = await getJobPostingApplications(id);
    res.status(OK).json(application);
})

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
        console.log(applications);
        res.status(OK).json(applications);
    
})
