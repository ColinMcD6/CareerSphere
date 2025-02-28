import e, { Request, Response } from 'express';
import multer from 'multer';
import * as db from './db'
import {
    addResumeHandler,
    getResumeHandler,
} from '../controllers/resume.controller';
import ResumeModel from '../models/resume.model';
import request from 'supertest';
import fs from "fs";
import path from "path";

const app = e();
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
const upload = multer({ storage: storage });
app.post("/add", upload.single('resume'), addResumeHandler);
app.get("/resume/:id", getResumeHandler);



describe('Test adding resume', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
        const uploadDir = path.join(__dirname, '../../resume/uploads/');
        fs.readdir(uploadDir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                if (file.endsWith('test.pdf')) {
                    fs.unlink(path.join(uploadDir, file), err => {
                        if (err) throw err;
                    });
                }
            }
        });
    });
    afterAll(async () => {
        await db.closeDatabase()
        
    });

    test('Adding a new resume', async () => {
        const filePath = path.join(__dirname, 'test.pdf');
        const response = await request(app)
        .post('/add')
        .attach('resume', filePath)
        .expect(200);

        // Check if the resume is in the database
        const resume = await ResumeModel.find().exec();
        expect(resume).toHaveLength(1);
        expect(resume[0].pdf_name).toBe('test.pdf');

        expect(response.body.resume).toHaveProperty('pdf_name', 'test.pdf'); // Adjust the expected file name
        expect(response.body.resume).toHaveProperty('path', './resume/uploads/');

        const uploadedFilePath = path.join(__dirname, '../../resume/uploads/', resume[0].file_name);
        const fileExists = fs.existsSync(uploadedFilePath);
        expect(fileExists).toBe(true);
        

     });

    test('Getting a resume (downloading)', async () => {
        const filePath = path.join(__dirname, 'test.pdf');
        const response1 = await request(app)
        .post('/add')
        .attach('resume', filePath)
        .expect(200);
        
        const id = response1.body.resume._id;
        // Testing Resume Downloads
        const response = await request(app)
            .get(`/resume/${id}`)
            .expect(200);

        console.log(response1.body);

        // Checking response headers to see if the file is being downloaded
        expect(response.headers['content-disposition']).toContain('attachment; filename="' + response1.body.resume.file_name + '"');
        expect(response.headers['content-type']).toBe('application/pdf');

        
        // const mReq: Partial<Request> = {
        //     params: {
        //         id: response.body.resume._id,
        //     },
        // };
        // const mJson = jest.fn().mockImplementation(() => null)
        // const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }));
        // const mRes: Partial<Response> = {
        //     status: mStatus,
        // };
        // const mNext = jest.fn();
        // await getResumeHandler(mReq as Request, mRes as Response, mNext);

        // expect(mRes.status).toHaveBeenCalledWith(200);
    }, 100000);

});