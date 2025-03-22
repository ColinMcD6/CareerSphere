import { Model } from "mongoose";
import JobPostingsModel, { JobPostingsDocument } from "../models/jobPostings.model";

class JobPostingsDAO {
    private model: Model<JobPostingsDocument>;

    constructor() {
        this.model = JobPostingsModel
    }

    async create(jobPosting: JobPostingsDocument) {
        return await this.model.create(jobPosting);
    }

    async findById(jobPostingId: string): Promise<JobPostingsDocument | null> {
        return await this.model.findById(jobPostingId);
    }

    async find()
}

const jobPostingsDAO = new JobPostingsDAO();
export default jobPostingsDAO;