import jobPostingsDAO from "../jobPosting.repository";
import JobPostingsModel, { JobPostingsDocument } from "../../models/main/jobPostings.model";

/**
 * * * getAllJobPostingsAggregationRules
 * * @description - This function retrieves all job postings from the database with optional filtering using mongoose's aggregation framework.
 * * It allows for pagination and filtering based on saved job postings for a specific candidate.
 * * @param {any} query - The query object to filter job postings.
 * * @param {number} page - The page number for pagination.
 * * @param {number} limit - The number of job postings to retrieve per page.
 * * @param {any} savedPostingCandidateId - The candidate ID to filter saved job postings.
 * * @returns {Promise<JobPostingsDocument[]>} - A promise that resolves to an array of job postings.
 */
export const getAllJobPostingsAggregationRules = async(
    query: any,
    page: number,
    limit: number,
    savedPostingCandidateId: any,
):Promise<JobPostingsDocument[]> => {
    //The default aggregation rules
    const aggregation_rules: any[] = [
        {$match: query},
        {$skip: (page - 1) * limit},

        {$limit: limit},
        {
            $lookup: {
                from: "applications",
                let: { jobPostingId: "$_id" }, // Reference the _id field from jobPostings
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$jobPostingId", { $toObjectId: "$jobId" }], // Convert job_id to ObjectId
                            },
                        },
                    },
                ],
                as: "applications",
            },
        },
        {
            $addFields: {
                applicationCount: { $size: "$applications" }, // Count the number of applications
            },
        },
        {
            $unset: "applications", // Remove the applications array
        },
        
    ];

    //Checks if user wants to view all saved jobs
    if(savedPostingCandidateId){
        aggregation_rules.push(
            {
                $lookup: {
                    from: "savejobpostings",
                    let: { jobPostingId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$candidateId", savedPostingCandidateId] } } },
                        { $match: { $expr: { $eq: [{ $toObjectId: "$jobId" }, "$$jobPostingId"] } } } // Ensure job_id is compared as ObjectId
                    ],
                    as: "savedPosting",
                },
            },
            {
                $addFields: {
                    isSaved: {
                        $in: [savedPostingCandidateId, "$savedPosting.candidateId"],
                    },
                },
            },
            {
                $match: {isSaved: true}
            }
        )
    }

    const jobPostings = await jobPostingsDAO.aggregate(aggregation_rules);

    return jobPostings

}