import { Router } from "express";
import { 
    addResumeHandler,
    getResumeHandler
 } from "../controllers/resume.controller";

import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './resume/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const resumeRoutes = Router();

//prefix: /jobs
resumeRoutes.post("/add", upload.single('resume'), addResumeHandler);
resumeRoutes.get("/:id", getResumeHandler);

export default resumeRoutes;