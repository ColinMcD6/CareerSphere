import mongoose, { mongo } from "mongoose";

// Resume Model
export interface ResumeDocument extends mongoose.Document {
    pdfName: string,
    fileName: string,
    path: string,
    dateUploaded: Date
}

const resumeSchema = new mongoose.Schema<ResumeDocument>({
    pdfName: {type: String, required: true},
    fileName: {type: String, required: true},
    path: {type: String, required: true},
    dateUploaded: { type: Date, default: Date.now }
})

const ResumeModel = mongoose.model<ResumeDocument>("Resume", resumeSchema);
export default ResumeModel;
