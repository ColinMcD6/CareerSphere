import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env.constants";

/**
 * * Connect to MongoDB database using Mongoose
 * * @returns {Promise<void>} - A promise that resolves when the connection is successful
 * * @throws {Error} - Throws an error if the connection fails
 */
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Successfully connected to DB at : ${MONGO_URI}`);
    } catch (error) {
        console.log("Could not connect to database", error);
        process.exit(1);
    }
};

export default connectToDatabase;
