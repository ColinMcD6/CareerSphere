import mongoose, { mongo } from "mongoose";


export interface ApplicationDocument extends mongoose.Document {
    job_id: string,
    employer_id: string,
    candidate_id: string
    resume_id: string,
    dateApplied: Date,
    status: string

}

const applicationSchema = new mongoose.Schema<ApplicationDocument>({
    job_id: {type: String, required: true},
    employer_id: {type: String, required: true},
    candidate_id: {type: String, required: true},
    resume_id: {type: String, required: true},
    dateApplied: { type: Date, default: Date.now },
    status: {type: String, enum: ["Pending", "Accepted", "Rejected"] , default: "Pending"}

})

const ApplicationModel = mongoose.model<ApplicationDocument>("Application", applicationSchema);
export default ApplicationModel;