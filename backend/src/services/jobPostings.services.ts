import { CONFLICT } from "../constants/http";
import ApplicationModel from "../models/application.model";
import JobPostingsModel from "../models/jobPostings.model";
import SaveJobPostingsModel from "../models/saveJobPostings.model";
import UserModel from "../models/users.model";
import appAssert from "../utils/appAssert";
const mongoose = require("mongoose");

export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await JobPostingsModel.create(data);
    return {
        jobPosting: jobPosting,
    };
};

export const getJobPosting = async (id: string) => {
    if (!mongoose.isValidObjectId(id))
        appAssert(false, CONFLICT, "Job Posting does not exist, invalid ID!"); // This will throw an error, and return a 409 response

    const jobPosting = await JobPostingsModel.findById(id);
    appAssert(jobPosting, CONFLICT, "Job Posting does not exist!");
    return jobPosting;
};

// Get Job Posting with application and saved status
export const getJobPostingImproved = async (id: string, candidate_id: any) => {
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

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};

export const getAllJobPostingsQueryWithSaved = async (
    query: any,
    page: number,
    limit: number,
    saved_posting_candidate_id: any
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

   
    const total = jobPostings.length;

    return {
        jobPostings,
        total,
        page,
        pages: Math.ceil(total / limit),
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
