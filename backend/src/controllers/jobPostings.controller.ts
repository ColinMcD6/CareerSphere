import { number, record, z } from "zod";
import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { 
    createJobPosting, 
    getJobPosting, 
    getAllJobPostings
} from "../services/jobPostings.services";
import { CREATED, OK } from "../constants/http";
import {v4 as uuidv4} from 'uuid';



const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 250; 

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
    jobType: z.enum(['Full-time', 'Part-time', 'Temporary', 'Internship'])
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
        startingDate: req.body.startingDate
    }
    const request = jobPostingsZModel.parse(job);
    const user = await createJobPosting(job);
    res.status(CREATED).json(request);
});

export const getJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await getJobPosting(id);
    res.status(OK).json(user);
})

export const getAllJobPostingsHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const jobPostings = await getAllJobPostings(page, limit);
    res.status(OK).json(jobPostings);
})