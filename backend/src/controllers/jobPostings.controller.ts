import { number, z } from "zod";
import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { 
    createJobPosting, 
    getJobPosting, 
    getAllJobPostings
} from "../services/jobPostings.services";
import { CREATED, OK } from "../constants/http";
import {v4 as uuidv4} from 'uuid';

const jobPostingsSchemaSchema = z.object({
    title: z.string().min(1).max(225),
    description: z.string().min(1).max(225),
    employer: z.string().min(1).max(225),
    employer_id: z.string().min(1).max(225),
    location: z.string().min(1).max(225),
    salary: z.number(),
    jobType: z.string().min(1).max(225),
    experience: z.array(z.string()), 
    skills: z.array(z.string()),
    education: z.array(z.string()),
    deadline: z.date(),
    status: z.string().min(1).max(225),
})

export const addJobPostingHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {

    console.log("Adding job posting");
    console.log(req.body);
    const job = {
        title: req.body.title,
        description: req.body.description,
        employer: req.body.employer,
        employer_id: req.body.employer_id,
        location: req.body.location,
        salary: req.body.salary,
        jobType: req.body.jobType,
        experience: req.body.experience,
        skills: req.body.skills,
        education: req.body.education,
        deadline: new Date(req.body.deadline),     // Subject to change (Postman was being a weird)
        status: req.body.status,
    }
    const request = jobPostingsSchemaSchema.parse(job);    
    const user = await createJobPosting(request);
    res.status(CREATED).json(user);
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