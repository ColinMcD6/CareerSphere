import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectToDatabase from "./configs/db.config";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env.constants";
import { OK } from "./constants/http.constants";
import errorHandler from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import jobPostingRoutes from "./routes/jobPostings.route";
import resumeRoutes from "./routes/resume.routes";
import userRoutes from "./routes/user.route";
import { authenticate } from "./middlewares/authenticate.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use('/resume/uploads', express.static('resume/uploads'));

app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.status(OK).json({
    status: "healthy",
  });
});

app.use("/auth", authRoutes);
// protected routes
app.use("/job", authenticate, jobPostingRoutes);
app.use("/resume", authenticate, resumeRoutes);
app.use("/user", authenticate, userRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app
    .listen(PORT, async () => {
      console.log(
        `Server is running on port ${PORT} in ${NODE_ENV} environment.`
      );
      try {
        await connectToDatabase();
      } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process with a failure code
      }
    })
    .on("error", (error) => {
      console.error("Server failed to start:", error);
      process.exit(1); // Exit the process with a failure code
    });
}

export default app;