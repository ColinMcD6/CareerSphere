import { CONFLICT } from "../constants/http";
import JobPostingsModel  from "../models/jobPostings.model";
import ApplicationModel from "../models/application.model";
import appAssert from "../utils/appAssert";

export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await JobPostingsModel.create(data);
    return {
        jobPosting: jobPosting
    };
};


export const getJobPosting = async (id: string) => {
    const jobPosting = await JobPostingsModel.findById(id);
    appAssert(jobPosting, CONFLICT, "Job Posting does not exist!");
    return jobPosting;
}

//include paging
export const getAllJobPostingsQuery = async (query:any, page: number, limit: number) => {
    const jobPostings = await JobPostingsModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit).exec();
    
    const total = await JobPostingsModel.countDocuments();

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit)
    };

}

//include paging
export const getAllJobPostings = async (page: number, limit: number) => {
    const jobPostings = await JobPostingsModel.find()
        .skip((page - 1) * limit)
        .limit(limit).exec();
    
    const total = await JobPostingsModel.countDocuments();

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit)
    };

}

//APPLICATIONS----------------------------------------------

export const addJobPostingApplication = async (data: any) => {
    const jobApplication = await ApplicationModel.create(data);
    return {
        jobApplication: jobApplication
    };
}

export const deleteJobPostingApplication = async (id: any) => {
    const jobPosting = await ApplicationModel.findByIdAndDelete(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
}

export const getJobPostingApplications = async (id: any) => {
    const jobPosting = await ApplicationModel.findById(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
}

export const getJobPostingApplicationsQuery = async (query: any, page: number, limit: number ) => {
    console.log(query);
    const application = await ApplicationModel.find(query).skip((page - 1) * limit).limit(limit).exec();
    const total = await ApplicationModel.countDocuments(query);
    return {
        application,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
}
