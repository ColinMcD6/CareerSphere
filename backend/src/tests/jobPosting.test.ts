import {
    getAllJobPostingsQueryHandler,
    saveJobPostingHandler,
    unsaveJobPostingHandler
} from '../controllers/jobPostings.controller';
import * as db from './db';


import express from 'express';
import request from 'supertest';
import JobPostingsModel from '../models/main/jobPostings.model';
import SaveJobPostingsModel from '../models/many-to-many/saveJobPostings.model';
import UserModel from '../models/main/users.model';
import supertest = require('supertest');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/job", getAllJobPostingsQueryHandler);
app.post("/job/save", saveJobPostingHandler);
app.delete("/job/unsave/:id", unsaveJobPostingHandler);


describe('Testing Saved Job Postings', () => {
    beforeAll(async () => {
            await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    test('Get Saved Job Posting', async () => {

        const old_education = ["Highschool"]
        const candidate = ["AJ", "Colin"];
        const employers = ["Sukmeet", "Ethan"];
        const job = ["Mcdonlds", "BurkerKing", "Banana"];

        const newuser = await UserModel.create({
            username: employers[0], 
            email: "aj@gmail.com", 
            password: "12345678", 
            userRole: "Employer",
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        const newuser2 = await UserModel.create({
            username: candidate[1], 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });

        const newuser3 = await UserModel.create({
            username: employers[1],
            email: "OggaBooga@hotmail.com",
            password: "12345678",
            userRole: "Employer",
            companyDetails: undefined,
            hiringDetails: undefined,
        });


        const newJob = {
            title: "Software Engineer",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
        }

        const newJob2 = {
            title: "Civil Engineer",
            description: "We are looking for a civil engineer",
            positionTitle: "Civil Engineer",
            employer: "Google",
            employer_id: newuser._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
        }

        const newJob3 = {
            title: "Pizza Maker",
            description: "We are looking for a pizza maker",
            positionTitle: "Pizza Maker",
            employer: "Google",
            employer_id: newuser3._id,
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
        }


        const jobPosting = await JobPostingsModel.create(newJob);
        const jobPosting2 = await JobPostingsModel.create(newJob2);
        const jobPosting3 = await JobPostingsModel.create(newJob3);


        const saveJob = await SaveJobPostingsModel.create({
            job_id: jobPosting._id,
            candidate_id: newuser2._id
        });

        const saveJob2 = await SaveJobPostingsModel.create({
            job_id: jobPosting2._id,
            candidate_id: newuser2._id
        });

        const response = await request(app).get("/job?saved_posting_candidate_id=" + newuser2._id).expect(200);

        expect(response.body.jobPostings.length).toBe(2);

        const findJob = await JobPostingsModel.findById(response.body.jobPostings[0]._id);
        const findJob2 = await JobPostingsModel.findById(response.body.jobPostings[1]._id);

        expect(findJob).not.toBeNull();
        expect(findJob2).not.toBeNull();

        if(findJob && findJob2 && jobPosting && jobPosting2) {
            expect((findJob._id as unknown as string).toString()).toBe((jobPosting._id as unknown as string).toString());
            expect((findJob2._id as unknown as string).toString()).toBe((jobPosting2._id as unknown as string).toString());
        }
        
    });

    test('Saving Job Postings', async () => {
        const newuser = await UserModel.create({
            username: "AJ",
            email: "OggaBooga@hotmail.com",
            password: "12345678",
            userRole: "Employer",
            companyDetails: undefined,
            hiringDetails: undefined,
        });


        const newJob = {
            title: "Software Engineer",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: "32423423423",
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
        }

        const jobPosting = await JobPostingsModel.create(newJob);

        const body = {
            job_id: (jobPosting._id as unknown as string).toString(),
            candidate_id: (newuser._id as unknown as string).toString()
        }

        console.log(body);

        const response = await request(app).post("/job/save").send(body).set('Accept', 'application/json').expect(201);

        console.log(response.body);

        const findJob = await SaveJobPostingsModel.findById(response.body._id);

        expect(findJob).not.toBeNull();
        if(findJob && jobPosting) {
            expect((findJob.job_id as unknown as string).toString()).toBe((jobPosting._id as unknown as string).toString());
        }
        
    })

    test('Unsaving Job Postings', async () => {
        const newuser = await UserModel.create({
            username: "AJ",
            email: "OggaBooga@hotmail.com",
            password: "12345678",
            userRole: "Employer",
            companyDetails: undefined,
            hiringDetails: undefined,
        });


        const newJob = {
            title: "Software Engineer",
            description: "We are looking for a software engineer",
            positionTitle: "Software Engineer",
            employer: "Google",
            employer_id: "32423423423",
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Full Time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
        }

        const jobPosting = await JobPostingsModel.create(newJob);

        const body = {
            job_id: (jobPosting._id as unknown as string).toString(),
            candidate_id: (newuser._id as unknown as string).toString()
        }

        const saveJob = await SaveJobPostingsModel.create(body);

        const id = (saveJob._id as unknown as string).toString();

        const response = await request(app).delete("/job/unsave/" + id).expect(200);

        const findJob = await SaveJobPostingsModel.findById(response.body._id);

        expect(findJob).toBeNull();
    })
})