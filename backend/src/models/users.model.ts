import mongoose from "mongoose";
import { comparePass, hashPass } from "../utils/auth_helpers/bcrypt";

export interface UserDocument extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    userRole: "Employer" | "Candidate";
    verified: boolean;
    education?: string[];
    skills?: string[];
    experience?: string[];
    hiringDetails?: string[];
    companyDetails?: string;
    createdAt: Date;
    updatedAt: Date;
    checkPassword(val: string): Promise<boolean>;
    removePassword(): Pick<UserDocument, "_id" | "email" | "verified" | "userRole" | "createdAt" | "updatedAt">;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verified: { type: Boolean, required: true, default: false },
        userRole: {
            type: String,
            required: true,
            enum: ["Employer", "Candidate"],
            default: "Candidate",
        },
        experience: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: UserDocument) {
                    return this.userRole === "Candidate" || this.experience === undefined;
                },
                message: "Only Candidates can have experience.",
            },
        },
        education: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: UserDocument) {
                    return this.userRole === "Candidate" || this.education === undefined;
                },
                message: "Only Candidates can have education.",
            },
        },
        skills: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: UserDocument) {
                    return this.userRole === "Candidate" || this.skills === undefined;
                },
                message: "Only Candidates can have skills.",
            },
        },
        companyDetails: {
            type: String,
            default: undefined,
            validate: {
                validator: function (this: UserDocument) {
                    return this.userRole === "Employer" || this.companyDetails === undefined;
                },
                message: "Only Employers can have companyDetails.",
            },
        },
        hiringDetails: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: UserDocument) {
                    return this.userRole === "Employer" || this.hiringDetails === undefined;
                },
                message: "Only Employers can have hiringDetails.",
            },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await hashPass(this.password);
    next();
});

userSchema.methods.checkPassword = async function (val: string) {
    return comparePass(val, this.password);
};

userSchema.methods.removePassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
