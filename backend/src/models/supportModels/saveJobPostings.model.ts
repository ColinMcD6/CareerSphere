import mongoose from "mongoose";

export interface SaveJobPostingsDocument extends mongoose.Document {
    jobId: string,
    candidateId: string,
}

const saveJobPostingsSchema = new mongoose.Schema<SaveJobPostingsDocument>({
    jobId: {type: String, required: true},
    candidateId: {type: String, required: true},
})

const SaveJobPostingsModel = mongoose.model<SaveJobPostingsDocument>("SaveJobPostings", saveJobPostingsSchema);
export default SaveJobPostingsModel;
