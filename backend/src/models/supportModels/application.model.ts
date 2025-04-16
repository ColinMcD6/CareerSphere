import mongoose, { mongo } from "mongoose";


export interface ApplicationDocument extends mongoose.Document {
    jobId: string,
    employerId: string,
    candidateId: string
    resumeId: string,
    dateApplied: Date,
    status: string

}

const applicationSchema = new mongoose.Schema<ApplicationDocument>({
    jobId: {type: String, required: true},
    employerId: {type: String, required: true},
    candidateId: {type: String, required: true},
    resumeId: {type: String, required: true},
    dateApplied: { type: Date, default: Date.now },
    status: {type: String, enum: ["Pending", "Accepted", "Rejected"] , default: "Pending"}

})

const ApplicationModel = mongoose.model<ApplicationDocument>("Application", applicationSchema);
export default ApplicationModel;
