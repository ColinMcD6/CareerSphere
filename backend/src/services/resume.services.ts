import { CONFLICT } from "../constants/http";
import ResumeModel from "../models/resume.model";
import appAssert from "../utils/appAssert";

export type CreateResumeParams = {
    pdf_name: string,
    file_name: string,
    path: string,
    job_id: string,         // job id itself
    candidate_id: string,   // Person who submitted the resume
    employer_id: string,    // Employer who posted the job
    dateUploaded: Date
};

export const createResume = async (data: CreateResumeParams) => {
    
    
    const resume = await ResumeModel.create({
        pdf_name: data.pdf_name,
        file_name: data.file_name,
        path: data.path,
        job_id: data.job_id,
        candidate_id: data.candidate_id,
        employer_id: data.employer_id,
        dateUploaded: data.dateUploaded
    })

    return {
        resume: resume
    };
}

export const getResume = async (id: string) => {
    const resume = await ResumeModel.findById(id);
    appAssert(resume, CONFLICT, "Resume does not exist!");
    return resume;
}