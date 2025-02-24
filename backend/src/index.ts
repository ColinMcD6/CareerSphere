import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import { NODE_ENV, PORT, APP_ORIGIN } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import userRoutes from "./routes/user.route";
import jobPostingRoutes from "./routes/jobPostings.route";
import resumeRoutes from "./routes/resume.routes";
import multer from "multer";
import authRoutes from "./routes/auth.route";
import authenticate from "./middleware/authenticate";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());

app.get("/", (req, res, next) => {
    res.status(OK).json({
        status: "healthy", 
    });
});

app.use("/job", authenticate, jobPostingRoutes); // As of right now this does not differentiate between employee and candidates, as it just uses the authenticate middleware 
app.use("/resume", resumeRoutes);
app.use("/auth", authRoutes);
// to get info about user accounts - protected routes
app.use("/user", authenticate, userRoutes);
app.use(errorHandler);

app.listen(
    PORT,
    async () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment.`);
        try {
            await connectToDatabase();
        } catch (error) {
            console.error("Failed to connect to the database:", error);
            process.exit(1); // Exit the process with a failure code
        }
    }
).on("error", (error) => {
    console.error("Server failed to start:", error);
    process.exit(1); // Exit the process with a failure code
});
