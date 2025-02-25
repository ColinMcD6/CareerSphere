import { Router } from "express";
import { 
    addResumeHandler,
    getResumeHandler
 } from "../controllers/resume.controller";

import multer from "multer";
import fs from "fs"

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
resumeRoutes.get("/:id", getResumeHandler);

export default resumeRoutes;