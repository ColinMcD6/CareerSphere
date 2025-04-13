import { Router } from "express";
import {
    addResumeHandler,
    getResumeDownloadHandler,
    getResumeNameHandler
} from "../controllers/resume.controller";

import fs from "fs";
import multer from "multer";
import { auth_verifyCandidate, auth_verifyEmployer } from "../middleware/authenticate.middleware";


/**
 * Configure multer storage options
 * This will store the uploaded files in the 'uploads' directory under 'resume'
 * and will rename the files to a unique name using the current timestamp and a random number.
*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './resume/uploads/';
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create directory recursively
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.' + file.originalname);
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

const resumeRoutes = Router();

//prefix: /resume
resumeRoutes.post("/add", auth_verifyCandidate, upload.single('resume'), addResumeHandler);
resumeRoutes.get("/download/:id", auth_verifyEmployer, getResumeDownloadHandler);
resumeRoutes.get("/:id", auth_verifyEmployer, getResumeNameHandler);

export default resumeRoutes;
