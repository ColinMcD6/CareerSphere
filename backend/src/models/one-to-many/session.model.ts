import mongoose from "mongoose";
import { weekfromnow } from "../../utils/auth_helpers/calc";

export interface sessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt?: Date;
    expiredAt: Date;
}

const sessionSchema = new mongoose.Schema<sessionDocument>({
    userId: {
        ref: "User",
        type: mongoose.Schema.Types. ObjectId,
        index: true,
    },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now},
    expiredAt: { type: Date, default: weekfromnow(), }
})

const sessionModel = mongoose.model<sessionDocument>("Session", sessionSchema);

export default sessionModel;
