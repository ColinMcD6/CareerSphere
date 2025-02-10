import mongoose, { mongo } from "mongoose";

export interface UserDocument extends mongoose.Document {
    firstName: string,
    lastName: string
}

const userSchema = new mongoose.Schema<UserDocument>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
})

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;