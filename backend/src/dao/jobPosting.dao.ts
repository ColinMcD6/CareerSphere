import { Model } from "mongoose";
import JobPostingsModel, { JobPostingsDocument } from "../models/jobPostings.model";
import mongoose from "mongoose";


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
}

const jobPostingsDAO = new JobPostingsDAO();
export default jobPostingsDAO;