import { MONGO_URI } from '../settings.js';
import User from "./models/User.js";
import mongoose from "mongoose";


mongoose
  .connect(MONGO_URI)
  .then(() => {
    return User.collection.drop();
  })
  .then(() => {
    console.log('Collection dropped successfully');
    mongoose.disconnect(); // Close the connection when done
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });