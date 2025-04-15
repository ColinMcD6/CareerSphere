import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { OK } from "../constants/http.constants";
import {
    createResume,
    getResume
} from "../services/resume.services";
import catchErrors from "../utils/catchErrors";


const resumeSchema = z.object({
    pdfName: z.string(),
    fileName: z.string(),
    path: z.string(),
    dateUploaded: z.date(),
})


/**
 * * Add Resume Handler
 * * @description - This handler processes the resume upload and saves it to the database.
 * * @param {Request} req - The request object containing the resume file information.
 * * @param {Response} res - The response object to send the response back to the client.
 * * @throws {Error} - Throws an error if the resume upload fails.
 */
export const addResumeHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Adding resume");
    const resume = {
        pdfName: req.file?.originalname,
        fileName: req.file?.filename,
        path: req.file?.destination, // Save the file path or any other relevant info
        dateUploaded: new Date(), // Set the current date
    };
    //check if file is pdf
    if (!resume.pdfName && !(resume.pdfName as string).endsWith('.pdf')) {
        res.status(400).json({ message: "File is not a pdf" });
    }
    else{
        const request = resumeSchema.parse(resume);    
        const resume_result = await createResume(request);
        res.status(OK).json(resume_result);
    }
});


/**
 * * Get Resume Handler
 * * @description - This handler sends the resume file based on the provided ID.
 * * @param {Request} req - The request object containing the resume ID.
 * * @param {Response} res - The response object to send the resume information back to the client.
 * * @throws {Error} - Throws an error if the resume retrieval fails.
 */
export const getResumeDownloadHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const resume = await getResume(id);
        const directory = 'resume\\uploads\\' + resume.fileName;
        res.download(directory,resume.fileName, err => {
            if (err) {
                console.log(err);
            }
        });
    
})

/**
 * * Get Resume Name Handler
 * * @description - This handler retrieves the resume name based on the provided ID.
 * * @param {Request} req - The request object containing the resume ID.
 * * @param {Response} res - The response object to send the resume name back to the client.
 * * @throws {Error} - Throws an error if the resume retrieval fails.
 */
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
