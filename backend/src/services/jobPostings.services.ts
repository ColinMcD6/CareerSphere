import { CONFLICT } from "../constants/http";
import ApplicationModel from "../models/application.model";
import JobPostingsModel, { JobPostingsDocument } from "../models/jobPostings.model";
import SaveJobPostingsModel from "../models/saveJobPostings.model";
import UserModel from "../models/users.model";
import appAssert from "../utils/appAssert";
import jobPostingsDAO from "../dao/jobPosting.dao";
const mongoose = require("mongoose");

export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await jobPostingsDAO.create(data);
    return {
        jobPosting: jobPosting,
    };
};

// Get Job Posting with application and saved status
export const getJobPosting = async (id: string, candidate_id: any) => {
    if (!mongoose.isValidObjectId(id))
        appAssert(false, CONFLICT, "Job Posting does not exist, invalid ID!"); // This will throw an error, and return a 409 response

    const jobPosting = await JobPostingsModel.findById(id);
    
    const application = await ApplicationModel.findOne({
        job_id: id,
        candidate_id: candidate_id,
    });

    return {
        jobPosting: jobPosting,
        application: application
    };
}

//include paging
export const getAllJobPostingsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const jobPostings = await JobPostingsModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    const total = await JobPostingsModel.countDocuments();
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

    const jobPostings = await JobPostingsModel.aggregate(aggregation_rules);
    let output: JobPostingsDocument[] = [];

    //organize
    if(user_id)
    {
        const user = await UserModel.findById(user_id)
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
                //console.log(order[i]);
                for(var j = 0; j < jobDisplay[order[i]].length; j++)
                {
                    output.push(jobDisplay[order[i]][j]);
                }
                
            }
        }
        else
        {
            //console.log("No preferences");
            output = jobPostings;
        }
    }
    else
    {
        //console.log("No user_id");
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

//include paging
export const getAllJobPostings = async (page: number, limit: number) => {
    const jobPostings = await JobPostingsModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    const total = await JobPostingsModel.countDocuments();

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};
// SAVING JOBS ----------------------------------------------

export const saveJobPosting = async (data: any) => {
    const savedJobPosting = await SaveJobPostingsModel.create(data);
    return savedJobPosting;
}

export const unsaveJobPosting = async (id: any) => {
    const savedJobPosting = await SaveJobPostingsModel.findByIdAndDelete(id);
    return savedJobPosting;
}

export const getSavedJobPostings = async (candidate_id: any, job_id: any) => {
    console.log(candidate_id, job_id);
    const savedJobPosting = await SaveJobPostingsModel.findOne(
        { 
            candidate_id: candidate_id,
            job_id: job_id
        });
    return savedJobPosting;
}





//APPLICATIONS----------------------------------------------

export const addJobPostingApplication = async (data: any) => {
    const jobApplication = await ApplicationModel.create(data);
    return {
        jobApplication: jobApplication,
    };
};

export const editJobPostingApplicationStatus = async (id: any, status: any) => {
    const jobApplication = await ApplicationModel.findByIdAndUpdate(id, { status: status }, { new: true });
    return jobApplication;

};

export const deleteJobPostingApplication = async (id: any) => {
    const jobPosting = await ApplicationModel.findByIdAndDelete(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};

export const getJobPostingApplications = async (id: any) => {
    const jobPosting = await ApplicationModel.findById(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};

export const getJobPostingApplicationsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const applications = await ApplicationModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    const total = await ApplicationModel.countDocuments(query);

    // The following code attaches the username to the applications
    const applicationsWithUser = await Promise.all(
        applications.map(async (application) => {
            const user = await UserModel.findOne({
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
