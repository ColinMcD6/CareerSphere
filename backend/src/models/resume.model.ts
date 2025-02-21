import mongoose, { mongo } from "mongoose";

// Resume Model
export interface ResumeDocument extends mongoose.Document {
    pdf: string,
    job_id: string,         // job id itself
    candidate_id: string,   // Person who submitted the resume
    employer_id: string,    // Employer who posted the job
    dateUploaded: Date
}

const resumeSchema = new mongoose.Schema<ResumeDocument>({
    pdf: {type: String, required: true},
    job_id: {type: String, required: true},
    candidate_id: {type: String, required: true},
    employer_id: {type: String, required: true},
    dateUploaded: { type: Date, default: Date.now }
})

const ResumeModel = mongoose.model<ResumeDocument>("Resume", resumeSchema);
export default ResumeModel;
