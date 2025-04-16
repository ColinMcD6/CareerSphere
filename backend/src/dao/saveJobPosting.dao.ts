import { Model } from "mongoose";
import SaveJobPostingsModel, { SaveJobPostingsDocument } from "../models/supportModels/saveJobPostings.model";
import mongoose from "mongoose";



/**
 * * SaveJobPostingDAO Class
 * * @description - This class handles the data access operations for the SaveJobPostings model.
 * * It provides methods to create, find, update, and delete saved job postings in the database.
 */
class SaveJobPostingDAO {
    private model: Model<SaveJobPostingsDocument>;

    constructor() {
        this.model = SaveJobPostingsModel
    }

    async create(saveJobPosting: SaveJobPostingsDocument) {
        return await this.model.create(saveJobPosting);
    }

    isValidId(jobId: string) : boolean
    {
        return mongoose.isValidObjectId(jobId);
    }

    async findById(saveJobPostingId: string): Promise<SaveJobPostingsDocument | null> {
        return await this.model.findById(saveJobPostingId);
    }

    async findByIdAndDelete(id: string): Promise<SaveJobPostingsDocument | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async findOne(searchCritera: any): Promise<SaveJobPostingsDocument | null> {
        return await this.model.findOne(searchCritera);
    }

    async save(saveJobPosting: SaveJobPostingsDocument): Promise<SaveJobPostingsDocument | null> {
        return await saveJobPosting.save();
    }


    async find(query: Object, page: number, limit: number): Promise<SaveJobPostingsDocument[]> {
        return await this.model.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }
}

const saveJobPostingDAO = new SaveJobPostingDAO();
export default saveJobPostingDAO;
