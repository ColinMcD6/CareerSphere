import { CONFLICT } from "../constants/http.constants";
import appAssert from "../utils/appAssert";
import resumeDAO from "../dao/resume.dao";

export type CreateResumeParams = {
    pdf_name: string,
    file_name: string,
    path: string,
    dateUploaded: Date
};



/**
 * * Create Resume
 * * @description - This function creates a new resume entry in the database.
 * * @param {CreateResumeParams} data - The resume data to be saved.
 * * @returns {Promise<{ resume: any }>} - The created resume object.
 */
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



/**
 * * Get Resume
 * * @description - This function retrieves a resume entry from the database by its ID.
 * * @param {string} id - The ID of the resume to be retrieved.
 * * @returns {Promise<any>} - The retrieved resume object.
 */
export const getResume = async (id: string) => {
    const resume = await resumeDAO.findById(id);
    appAssert(resume, CONFLICT, "Resume does not exist!");
    return resume;
}
