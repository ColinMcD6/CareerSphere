import { CONFLICT } from "../constants/http";
import JobPostingsModel  from "../models/jobPostings.model";
import appAssert from "../utils/appAssert";
const mongoose = require("mongoose");

export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await JobPostingsModel.create(data);
    return {
        jobPosting: jobPosting
    };
};


export const getJobPosting = async (id: string) => {
    if (!mongoose.isValidObjectId(id))
        appAssert(false, CONFLICT, "Job Posting does not exist, invalid ID!"); // This will throw an error, and return a 409 response

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
