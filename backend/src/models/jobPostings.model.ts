import mongoose, { mongo } from "mongoose";

// Job Posting Model
export interface JobPostingsDocument extends mongoose.Document {
    title: string,
    description: string,
    employer: string,
    employer_id: string,
    location: string,
    salary: number,
    jobType: string,
    experience: string[],
    skills: string[],
    education: string[],
    datePosted: Date,
    deadline: Date,
    status: string
}


const jobPostingsSchema = new mongoose.Schema<JobPostingsDocument>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    employer: {type: String, required: true},
    employer_id: {type: String, required: true},
    location: {type: String, required: true},
    salary: {type: Number, required: true},
    jobType: {type: String, required: true},
    experience: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    datePosted: { type: Date, default: Date.now },
    deadline: {type: Date, required: false},
    status: {type: String, enum: ["Open", "Close"] ,required: true}

})

const JobPostingsModel = mongoose.model<JobPostingsDocument>("JobPostings", jobPostingsSchema);
export default JobPostingsModel;
// END Job Posting Model
