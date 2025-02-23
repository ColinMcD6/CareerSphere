import mongoose from "mongoose";
import verificationType from "../constants/verificationTyes";

export interface verification extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    type: verificationType
    expireAt: Date,
    createdAt: Date,
}

const verificationSchema = new mongoose.Schema<verification>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true},
    createdAt: { type: Date, required: true, default: Date.now },
    expireAt: { type: Date, required: true },
})

const verificationModel = mongoose.model<verification>(
    "VerificationCode", 
    verificationSchema, 
    "verificaion_codes", 
);

export default verificationModel;