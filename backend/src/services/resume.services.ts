import { CONFLICT } from "../constants/http";
import appAssert from "../utils/appAssert";
import resumeDAO from "../dao/resume.controller";

export type CreateResumeParams = {
    pdf_name: string,
    file_name: string,
    path: string,
    dateUploaded: Date
};

export const createResume = async (data: CreateResumeParams) => {
    const resume = await resumeDAO.create({
        pdf_name: data.pdf_name,
        file_name: data.file_name,
        path: data.path,
        dateUploaded: data.dateUploaded
    })
    return {
        resume: resume
    };
}

export const getResume = async (id: string) => {
    const resume = await resumeDAO.findById(id);
    appAssert(resume, CONFLICT, "Resume does not exist!");
    return resume;
}