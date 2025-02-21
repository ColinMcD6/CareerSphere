import { CONFLICT } from "../constants/http";
import JobPostingsModel from "../models/jobPostings.model";
import appAssert from "../utils/appAssert";

export type CreateJobPostingParams = {
    title: string,
    description: string,
    employer: string,
    employer_id: string,
    location: string,
    salary: number,
    jobType: string,
    experience: string[],
    skills: string[],
    education: string[],
    deadline: Date,
    status: string
};

export const createJobPosting = async (data: CreateJobPostingParams) => {    
    const jobPosting = await JobPostingsModel.create({
        title: data.title,
        description: data.description,
        employer: data.employer,
        employer_id: data.employer_id,
        location: data.location,
        salary: data.salary,
        jobType: data.jobType,
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        deadline: data.deadline,
        status: data.status
    })

    return {
        jobPosting: jobPosting
    };
}

export const getJobPosting = async (id: string) => {
    const jobPosting = await JobPostingsModel.findById(id);
    appAssert(jobPosting, CONFLICT, "Job Posting does not exist!");
    return jobPosting;
}

//include paging
export const getAllJobPostings = async (page: number, limit: number) => {
    const jobPostings = await JobPostingsModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
    
    const total = await JobPostingsModel.countDocuments();

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit)
    };

}
