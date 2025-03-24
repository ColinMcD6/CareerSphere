import mongoose from "mongoose";

export interface SaveJobPostingsDocument extends mongoose.Document {
    job_id: string,
    candidate_id: string,
}

const saveJobPostingsSchema = new mongoose.Schema<SaveJobPostingsDocument>({
    job_id: {type: String, required: true},
    candidate_id: {type: String, required: true},
})

const SaveJobPostingsModel = mongoose.model<SaveJobPostingsDocument>("SaveJobPostings", saveJobPostingsSchema);
export default SaveJobPostingsModel;