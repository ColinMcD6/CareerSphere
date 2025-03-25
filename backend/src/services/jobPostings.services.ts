import { CONFLICT } from "../constants/http";
import {JobPostingsDocument } from "../models/jobPostings.model";
import appAssert from "../utils/appAssert";
import jobPostingsDAO from "../dao/jobPosting.dao";
import userDAO from "../dao/user.dao";
import saveJobPostingDAO from "../dao/saveJobPosting.dao"; 
import applicationDAO from "../dao/application.dao";

const mongoose = require("mongoose");

export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await jobPostingsDAO.create(data);
    return {
        jobPosting: jobPosting,
    };
};

export const getJobPostingAndApplication = async (id: string, candidate_id: any) => {
    const jobPosting = await getJobPosting(id);
    const application = await getApplication(id, candidate_id);
    return {
        jobPosting: jobPosting,
        application: application
    };
}

// Get Job Posting with application and saved status
export const getJobPosting = async (id: string) => {
    const jobPosting = await jobPostingsDAO.findById(id);
    if (!jobPosting)
        appAssert(false, CONFLICT, "Job Posting does not exist, invalid ID!"); // This will throw an error, and return a 409 response
    
    return jobPosting;
}

//include paging
export const getAllJobPostings = async (page: number, limit: number) => {
    return await getAllJobPostingsQuery({},page, limit);
};

//include paging
export const getAllJobPostingsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const jobPostings = await jobPostingsDAO.find(query, page, limit);

    const total = await jobPostingsDAO.countJobs();
    const pages = Math.ceil(total / limit);

    return {
        jobPostings,
        total,
        page: page <= pages ? page : pages,
        pages: pages,
    };
};

export const getAllJobPostingsQueryWithSaved = async (
    query: any,
    page: number,
    limit: number,
    saved_posting_candidate_id: any,
    user_id: any
) => {

    //The default aggregation rules
    const aggregation_rules: any[] = [
        {$match: query},
        {$skip: (page - 1) * limit},
        {$limit: limit}
    ]

    //Checks if user wants to view all saved jobs
    if(saved_posting_candidate_id){
        aggregation_rules.push(
            {
                $lookup: {
                    from: "savejobpostings",
                    let: { job_posting_id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$candidate_id", saved_posting_candidate_id] } } },
                        { $match: { $expr: { $eq: [{ $toObjectId: "$job_id" }, "$$job_posting_id"] } } } // Ensure job_id is compared as ObjectId
                    ],
                    as: "saved_posting",
                },
            },
            {
                $addFields: {
                    isSaved: {
                        $in: [saved_posting_candidate_id, "$saved_posting.candidate_id"],
                    },
                },
            },
            {
                $match: {isSaved: true}
            }
        )
    }

    const jobPostings = await jobPostingsDAO.aggregate(aggregation_rules);
    let output: JobPostingsDocument[] = [];

    //organize
    if(user_id)
    {
        const user = await userDAO.findById(user_id)
        const preferences = user?.preferences;
        
        if(preferences)
        {
            let jobDisplay: JobPostingsDocument[][] = [];
            let order = Array.from(preferences.keys()).sort((a, b) => preferences[b]- preferences[a]);
            
            for(var i = 0; i < preferences.length; i++){
                jobDisplay[i] = [];
            }
            for(var i = 0; i < jobPostings.length; i++)
            {
                let parseJob: JobPostingsDocument = jobPostings[i];
                jobDisplay[parseJob.category].push(parseJob);
            }
            for(var i = 0; i < order.length; i++)
            {
                for(var j = 0; j < jobDisplay[order[i]].length; j++)
                {
                    output.push(jobDisplay[order[i]][j]);
                }
                
            }
        }
        else
        {
            output = jobPostings;
        }
    }
    else
    {
        output = jobPostings;
    }
    
    const total = jobPostings.length;
    const pages = Math.ceil(total / limit);


    return {
        jobPostings: output,
        total,
        page: page <= pages ? page : pages,
        pages: pages,
    };
};


// SAVING JOBS ----------------------------------------------

export const saveJobPosting = async (data: any) => {
    const savedJobPosting = await saveJobPostingDAO.create(data);
    return savedJobPosting;
}

export const unsaveJobPosting = async (id: any) => {
    const savedJobPosting = await saveJobPostingDAO.findByIdAndDelete(id);
    return savedJobPosting;
}

export const getSavedJobPostings = async (candidate_id: any, job_id: any) => {
    console.log(candidate_id, job_id);
    const savedJobPosting = await saveJobPostingDAO.findOne(
        { 
            candidate_id: candidate_id,
            job_id: job_id
        });
    return savedJobPosting;
}

//APPLICATIONS----------------------------------------------

export const addJobPostingApplication = async (data: any) => {
    const jobApplication = await applicationDAO.create(data);
    return {
        jobApplication: jobApplication,
    };
};

export const editJobPostingApplicationStatus = async (id: any, status: any) => {
    const jobApplication = await applicationDAO.findByIdAndUpdate(id, { status: status }, { new: true });
    return jobApplication;

};

export const deleteJobPostingApplication = async (id: any) => {
    const jobPosting = await applicationDAO.findByIdAndDelete(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};

// Get Job Posting with application and saved status
export const getApplication = async (id: string, candidate_id: any) => {
    const application = await applicationDAO.findOne({
        job_id: id,
        candidate_id: candidate_id,
    });
    return application;
}

export const getJobPostingApplications = async (id: any) => {
    const jobPosting = await applicationDAO.findById(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};

export const getJobPostingApplicationsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const applications = await applicationDAO.find(query)

    const total = await applicationDAO.countDocuments(query);

    // The following code attaches the username to the applications
    const applicationsWithUser = await Promise.all(
        applications.map(async (application) => {
            const user = await userDAO.findOne({
                _id: application.candidate_id,
            });
            return {
                ...application.toObject(),
                username: user ? user.username : null,
                email: user ? user.email : null,
                experience: user ? user.experience : null,
                education: user ? user.education : null,
                skills: user ? user.skills : null,
            };
        })
    );
    return {
        applications: applicationsWithUser,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};
