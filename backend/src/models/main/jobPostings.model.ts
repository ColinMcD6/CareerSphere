import mongoose from "mongoose";

// Job Posting Model
export interface JobPostingsDocument extends mongoose.Document {
    title: string,
    positionTitle: string,
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
    datePosted: string,
    startDate: string,
    dueDate: string,
    status: string,
    category: number,
    quizzes: string[];

}

export enum Category {Technology = 0, Agriculture = 1, Service = 2, Business = 3, Engineering = 4, Other = 5}


// Function to get current date in yyyy-mm-dd format
const TimeNow = (): string => {
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`; // Format as yyyy-mm-dd

    return formattedDate;

}

const jobPostingsSchema = new mongoose.Schema<JobPostingsDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    positionTitle: { type: String, required: true },
    employer: { type: String, required: true },
    employer_id: { type: String, required: true },
    location: { type: String, required: true },
    compensationType: { type: String, enum: ["do-not-disclose", "salary", "hourly"], required: true }, // Require later
    salary: { type: Number }, // Changed to not required for now
    jobType: { type: String, required: true },
    experience: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    datePosted: { type: String, default: TimeNow() },
    dueDate: { type: String, required: false },
    startDate: { type: String, required: false },
    status: { type: String, enum: ["Open", "Close"], required: true },
    category: {type: Number, enum: [0, 1, 2, 3, 4, 5]},
    quizzes: { type: [String], default: [] },

})

const JobPostingsModel = mongoose.model<JobPostingsDocument>("JobPostings", jobPostingsSchema);
export default JobPostingsModel;
// END Job Posting Model
