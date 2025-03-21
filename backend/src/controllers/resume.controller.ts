import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { OK } from "../constants/http";
import {
    createResume,
    getResume
} from "../services/resume.services";
import catchErrors from "../utils/catchErrors";


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

export const getResumeDownloadHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const resume = await getResume(id);
        const directory = 'resume\\uploads\\' + resume.file_name;
        res.download(directory,resume.file_name, err => {
            if (err) {
                console.log(err);
            }
        });
    
})

export const getResumeNameHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const resume = await getResume(id);
    res.status(OK).json(resume);
})




// export const downloadhandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const resume = await getResume(id);
//     res.download(resume.path, resume.pdf_name);
// })