import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import {
    createResume, 
    getResume 
} from "../services/resume.services";
import { CREATED, OK } from "../constants/http";
import UserModel from "../models/users.model";

const resumeSchema = z.object({
    pdf: z.string(),
    job_id: z.string(),
    candidate_id: z.string(),
    employer_id: z.string(),
    dateUploaded: z.date(),
})

export const addUserHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    
    const request = resumeSchema.parse(req.body);    
    const user = await createResume(request);
    res.status(CREATED).json(user);
});

export const getUserHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await getResume(id);
    res.status(OK).json(user);
})