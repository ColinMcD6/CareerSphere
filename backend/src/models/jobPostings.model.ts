import mongoose, { Int32 } from "mongoose";
import { number } from "zod";

// Job Posting Model
export interface JobPostingsDocument extends mongoose.Document {
    title: string,
    positionTitle : string,
    description: string,
    employer: string,
    employer_id: string,
    location: string,
    salary: number,
    jobType: string,
    experience: string[],
    skills: string[],
    education: string[],
    compensationType: string,
    datePosted: Date,
    startingDate: string,
    deadline: Date,
    status: string
    category: number
}

export enum Category {Technology = 0, Agriculture = 1, Service = 2, Business = 3, Engineering = 4, Other = 5}

const jobPostingsSchema = new mongoose.Schema<JobPostingsDocument>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    positionTitle: {type: String, required: true}, 
    employer: {type: String, required: true},
    employer_id: {type: String, required: true},
    location: {type: String, required: true},
    compensationType: {type: String, enum: ["do-not-disclose", "salary", "hourly"], required: true}, // Require later
    salary: {type: Number}, // Changed to not required for now
    jobType: {type: String, required: true},
    experience: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    datePosted: { type: Date, default: Date.now }, //FIX DATES LATER
    startingDate: { type: String},
    deadline: {type: Date, required: false, default: Date.now},  //FIX DATES LATER
    status: {type: String, enum: ["Open", "Close"] ,required: true}, 
    category: {type: Number, enum: [0, 1, 2, 3, 4, 5]}
    //category: {type: Number, enum: [Category.Technology, Category.Agriculture, Category.Service, Category.Business, Category.Engineering, Category.Other]}
})

const JobPostingsModel = mongoose.model<JobPostingsDocument>("JobPostings", jobPostingsSchema);
export default JobPostingsModel;
// END Job Posting Model




