import { Router } from "express";
import {
    addResumeHandler,
    getResumeDownloadHandler,
    getResumeNameHandler
} from "../controllers/resume.controller";

import fs from "fs";
import multer from "multer";

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
resumeRoutes.post("/add", upload.single('resume'), addResumeHandler);
resumeRoutes.get("/download/:id", getResumeDownloadHandler);
resumeRoutes.get("/:id", getResumeNameHandler);

export default resumeRoutes;