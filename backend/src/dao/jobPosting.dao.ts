import { Model } from "mongoose";
import JobPostingsModel, { JobPostingsDocument } from "../models/main/jobPostings.model";
import mongoose from "mongoose";



/**
 * * JobPostingsDAO Class
 * * @description - This class handles the data access operations for the JobPostings model.
 * * It provides methods to create, find, update, and delete job postings in the database.
 */
class JobPostingsDAO {
    private model: Model<JobPostingsDocument>;

    constructor() {
        this.model = JobPostingsModel
    }

    async create(jobPosting: JobPostingsDocument) {
        return await this.model.create(jobPosting);
    }

    isValidId(jobId: string) : boolean
    {
        return mongoose.isValidObjectId(jobId);
    }

    async findById(jobPostingId: string): Promise<JobPostingsDocument | null> {
        return await this.model.findById(jobPostingId);
    }

    async save(jobPosting: JobPostingsDocument): Promise<JobPostingsDocument | null> {
        return await jobPosting.save();
    }


    async find(query: Object, page: number, limit: number): Promise<JobPostingsDocument[]> {
        return await this.model.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async countJobs() {
        return await JobPostingsModel.countDocuments()
    }

    async aggregate(aggregation_rules : any) : Promise<JobPostingsDocument[]> 
    {
        return await JobPostingsModel.aggregate(aggregation_rules)
    }
}

const jobPostingsDAO = new JobPostingsDAO();
export default jobPostingsDAO;
