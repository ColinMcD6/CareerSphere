import { z } from "zod";
import e, { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import {
    createResume, 
    getResume 
} from "../services/resume.services";
import { CREATED, OK } from "../constants/http";
import UserModel from "../models/users.model";
import multer from "multer";


const resumeSchema = z.object({
    pdf_name: z.string(),
    file_name: z.string(),
    path: z.string(),
    dateUploaded: z.date(),
})

export const addResumeHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Adding resume");
    console.log(req.body);
    console.log(req.file);
    const resume = {
        pdf_name: req.file?.originalname,
        file_name: req.file?.filename,
        path: req.file?.destination, // Save the file path or any other relevant info
        dateUploaded: new Date(), // Set the current date
    };
    const request = resumeSchema.parse(resume);    
    const resume_result = await createResume(request);
    console.log(resume_result);
    res.status(OK).json(resume_result);
});

export const getResumeHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const resume = await getResume(id);
    const directory = 'resume\\uploads\\' + resume.file_name;
    res.download(directory,resume.file_name, err => {
        if (err) {
            console.log(err);
        }
    });
})




// export const downloadhandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const resume = await getResume(id);
//     res.download(resume.path, resume.pdf_name);
// })