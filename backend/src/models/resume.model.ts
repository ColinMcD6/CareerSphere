import mongoose, { mongo } from "mongoose";

// Resume Model
export interface ResumeDocument extends mongoose.Document {
    pdf_name: string,
    file_name: string,
    path: string,
    dateUploaded: Date
}

const resumeSchema = new mongoose.Schema<ResumeDocument>({
    pdf_name: {type: String, required: true},
    file_name: {type: String, required: true},
    path: {type: String, required: true},
    dateUploaded: { type: Date, default: Date.now }
})

const ResumeModel = mongoose.model<ResumeDocument>("Resume", resumeSchema);
export default ResumeModel;
