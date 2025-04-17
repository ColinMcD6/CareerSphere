import fs from "fs";
import path from "path";
import request from "supertest";
import app from "../..";
import { CREATED, OK } from "../../constants/http.constants";
import JobPostingsModel from "../../models/main/jobPostings.model";
import UserModel from "../../models/main/users.model";
import * as db from "../db";

let requestUserStuff: any;
let accessToken: any;

let requestUserStuff2: any;
let accessToken2: any;
describe("API Routes for Job Posting, Application, and Saving", () => {
  beforeAll(async () => {
    await db.connect();
    const userData = {
        username: "test_user",
        email: "test_user@gmail.com",
        password: "12345678",
        confirmPassword: "12345678",
        userRole: "Candidate",
    };
    const userData2 = {
        username: "test_emp",
        email: "test_emp@gmail.com",
        password: "12345678",
        confirmPassword: "12345678",
        userRole: "Employer",
    };
        
    // Signup
    const signupResponse = await request(app).post("/auth/signup").send(userData);
    const signupResponse2 = await request(app).post("/auth/signup").send(userData2);
    // login
    const loginResponse = await request(app).post('/auth/login').send(userData);
    const loginResponse2 = await request(app).post('/auth/login').send(userData2);
    expect(loginResponse.status).toBe(OK);
    expect(loginResponse2.status).toBe(OK);

    // Get cookie
    const cookies = Array.isArray(loginResponse.headers["set-cookie"])
    ? loginResponse.headers["set-cookie"]
    : [loginResponse.headers["set-cookie"]];
    expect(cookies).toBeDefined();
    accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
    expect(accessToken).toBeDefined();

    const cookies2 = Array.isArray(loginResponse2.headers["set-cookie"])
    ? loginResponse2.headers["set-cookie"]
    : [loginResponse2.headers["set-cookie"]];
    expect(cookies2).toBeDefined();
    accessToken2 = cookies2.find((cookie: string) =>cookie.startsWith("accessToken="));
    expect(accessToken2).toBeDefined();

    // Get user information
    requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);
    requestUserStuff2 = await request(app).get("/user").send(userData2).set('Cookie', accessToken2);

    const newJob1 = {
        title: "Job test 1",
        description: "We are looking for a software engineer. 50 characters needed for title .50 characters needed for title .50 characters needed for title ",
        positionTitle: "Software Engineer",
        employer: "Google",
        location: "Mountain View",
        compensationType: "salary",
        salary: 100000,
        jobType: "Part-time",
        experience: ["2 years"],
        skills: ["React", "Node"],
        education: ["Bachelors"],
        status: "Open",
        startingDate: Date.now(),
        category: 2
    }

    const newJob2 = {
        title: "Job test 2",
        description: "We are looking for a software engineer. 50 characters needed for title .50 characters needed for title .50 characters needed for title ",
        positionTitle: "Software Engineer",
        employer: "Google",
        location: "Mountain View",
        compensationType: "salary",
        salary: 100000,
        jobType: "Part-time",
        experience: ["2 years"],
        skills: ["React", "Node"],
        education: ["Bachelors"],
        status: "Open",
        startingDate: Date.now(),
        category: 5
    }

    const newJob3 = {
        title: "Job test 3",
        description: "We are looking for a software engineer. 50 characters needed for title .50 characters needed for title .50 characters needed for title ",
        positionTitle: "Software Engineer",
        employer: "Google",
        location: "Mountain View",
        compensationType: "salary",
        salary: 100000,
        jobType: "Part-time",
        experience: ["2 years"],
        skills: ["React", "Node"],
        education: ["Bachelors"],
        status: "Open",
        startingDate: Date.now(),
        category: 3
    }   
    
    const requestCreateJob1 = await request(app).post("/job/add").send({...newJob1}).set('Cookie', accessToken2).expect(CREATED);
    const requestCreateJob2 = await request(app).post("/job/add").send({...newJob2}).set('Cookie', accessToken2).expect(CREATED);
    const requestCreateJob3 = await request(app).post("/job/add").send({...newJob3}).set('Cookie', accessToken2).expect(CREATED);
    
    const jobs = await JobPostingsModel.find().exec();
    expect(jobs).toHaveLength(3);
    const ids = [
        (jobs[0]._id as unknown as string).toString(),
        (jobs[1]._id as unknown as string).toString(),
        (jobs[2]._id as unknown as string).toString()];

    const jobApplication1 = {
        jobId: ids[0],
        employerId: "werwerwerfwerwerwer",
        candidateId: requestUserStuff.body._id,
        status: "Applied",
        resumeId: "dwqfqwefeqwfqwefqe",
        dateApplied: Date.now()
    }

    const jobApplication2 = {
        jobId: jobs[1]._id,
        employerId: "werwerwerfwerwerwer",
        candidateId: requestUserStuff.body._id,
        resumeId: "dwqfqwefeqwfqwefqe",
        status: "Applied",
        dateApplied: Date.now()
    }

    const createJobApplication1 = await request(app).post("/job/applications/apply/").send({...jobApplication1}).set('Cookie', accessToken).expect(CREATED);
    const createJobApplication2 = await request(app).post("/job/applications/apply/").send({...jobApplication2}).set('Cookie', accessToken).expect(CREATED);


    const savedJob1 = {
        jobId: ids[0],
        candidateId: requestUserStuff.body._id
    }

    const savedJob2 = {
        jobId: ids[1],
        candidateId: requestUserStuff.body._id
    }

    const requestSaveJob1 = await request(app).post("/job/save").send({...savedJob1}).set('Cookie', accessToken).expect(CREATED);
    const requestSaveJob2 = await request(app).post("/job/save").send({...savedJob2}).set('Cookie', accessToken).expect(CREATED);

  }, 10000);
  afterAll(async () => {
    await db.closeDatabase();
    const uploadDir = path.join(__dirname, '../../../resume/uploads/');
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
  }, 10000);

  test("Look for all Job Posting then look for saved job postings", async () => {
        const requestAllJobs = await request(app).get("/job/").set('Cookie', accessToken).expect(OK);

        expect(requestAllJobs.body.jobPostings.length).toEqual(3);
        expect(requestAllJobs.body.jobPostings[0].title).toEqual("Job test 1");
        expect(requestAllJobs.body.jobPostings[1].title).toEqual("Job test 2");
        expect(requestAllJobs.body.jobPostings[2].title).toEqual("Job test 3");


        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);
        

        expect(requestAllSavedJobs.body.jobPostings.length).toEqual(2);
        expect(requestAllSavedJobs.body.jobPostings[0].title).toEqual("Job test 1");
        expect(requestAllSavedJobs.body.jobPostings[1].title).toEqual("Job test 2");

        const saveJobRecord = await request(app).get("/job/save/query?candidateId=" + requestUserStuff.body._id + "&jobId=" + requestAllJobs.body.jobPostings[0]._id).set('Cookie', accessToken).expect(OK);
        const saveJobRecord2 = await request(app).get("/job/save/query?candidateId=" + requestUserStuff.body._id + "&jobId=" + requestAllJobs.body.jobPostings[1]._id).set('Cookie', accessToken).expect(OK);

        expect(saveJobRecord.body._id).toBeDefined();
        expect(saveJobRecord2.body._id).toBeDefined();


    });

    test("Unsave a Job Posting and query", async () => {
        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);
        
        expect(requestAllSavedJobs.body.jobPostings.length).toEqual(2);
        expect(requestAllSavedJobs.body.jobPostings[0].title).toEqual("Job test 1");
        expect(requestAllSavedJobs.body.jobPostings[1].title).toEqual("Job test 2");

        const savedJob = requestAllSavedJobs.body.jobPostings[0].savedPosting[0];
        const savedJob2 = requestAllSavedJobs.body.jobPostings[1].savedPosting[0];

        const requestUnsaveJob = await request(app).delete("/job/save/" + savedJob._id).set('Cookie', accessToken).expect(OK);

        const requestAllSavedJobs2 = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        expect(requestAllSavedJobs2.body.jobPostings.length).toEqual(1);
        expect(requestAllSavedJobs2.body.jobPostings[0].savedPosting[0]._id).toEqual(savedJob2._id);
    });

    test("Save a Job Posting", async () => {
        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        expect(requestAllSavedJobs.body.jobPostings.length).toEqual(1);
        

        const searchForJobTest3 = await request(app).get("/job/?search=Test 3").set('Cookie', accessToken).expect(OK);
        expect(searchForJobTest3.body.jobPostings.length).toEqual(1);
        expect(searchForJobTest3.body.jobPostings[0].title).toEqual("Job test 3");

        const savedJob = {
            jobId: searchForJobTest3.body.jobPostings[0]._id,
            candidateId: requestUserStuff.body._id
        }

        const requestSaveJob = await request(app).post("/job/save").send(savedJob).set('Cookie', accessToken).expect(CREATED);


        const requestAllSavedJobs2 = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        expect(requestAllSavedJobs2.body.jobPostings.length).toEqual(2);

    });

    test("Create applications for a single Job Posting", async () => {
        const newJob = {
            title: "Job test 4",
            description: "We are looking for a software engineer. 50 characters needed for title .50 characters needed for title .50 characters needed for title ",
            positionTitle: "Software Engineer",
            employer: "Google",
            location: "Mountain View",
            compensationType: "salary",
            salary: 100000,
            jobType: "Part-time",
            experience: ["2 years"],
            skills: ["React", "Node"],
            education: ["Bachelors"],
            status: "Open",
            startingDate: Date.now(),
            category: 3
        }

        const requestCreateJob3 = await request(app).post("/job/add").send({...newJob}).set('Cookie', accessToken2).expect(CREATED);
        const searchForJobTest3 = await request(app).get("/job/?search=Test 4").set('Cookie', accessToken).expect(OK);
        expect(searchForJobTest3.body.jobPostings.length).toEqual(1);
        expect(searchForJobTest3.body.jobPostings[0].title).toEqual("Job test 4");

        const job = searchForJobTest3.body.jobPostings[0];


        const jobApplication1 = {
            jobId: job._id,
            employerId: "werwerwerfwerwerwer",
            candidateId: requestUserStuff.body._id,
            status: "Applied",
            resumeId: "dwqfqwefeqwfqwefqe",
            dateApplied: Date.now()
        }
    
        const jobApplication2 = {
            jobId: job._id,
            employerId: "werwerwerfwerwerwer",
            candidateId: requestUserStuff.body._id,
            resumeId: "dwqfqwefeqwfqwefqe",
            status: "Applied",
            dateApplied: Date.now()
        }
        const jobApplication3 = {
            jobId: job._id,
            employerId: "werwerwerfwerwerwer",
            candidateId: requestUserStuff.body._id,
            resumeId: "dwqfqwefeqwfqwefqe",
            status: "Applied",
            dateApplied: Date.now()
        }

        const createJobApplication1 = await request(app).post("/job/applications/apply/").send({...jobApplication1}).set('Cookie', accessToken).expect(CREATED);
        const createJobApplication2 = await request(app).post("/job/applications/apply/").send({...jobApplication2}).set('Cookie', accessToken).expect(CREATED);
        const createJobApplication3 = await request(app).post("/job/applications/apply/").send({...jobApplication3}).set('Cookie', accessToken).expect(CREATED);

        const requestAllApplications = await request(app).get("/job/applications/all/query?jobId=" + job._id).set('Cookie', accessToken2).expect(OK);

        expect(requestAllApplications.body.applications.length).toEqual(3);


        //delete Job Application
        for(let i = 0; i < requestAllApplications.body.applications.length; i++) {
            const application = requestAllApplications.body.applications[i];
            const requestDeleteApplication = await request(app).delete("/job/applications/delete/" + application._id).set('Cookie', accessToken2).expect(OK);
        }

        const requestAllApplications2 = await request(app).get("/job/applications/all/query?jobId=" + job._id).set('Cookie', accessToken2).expect(OK);

        expect(requestAllApplications2.body.applications.length).toEqual(0);

        //delete Job Posting
        JobPostingsModel.deleteOne({ _id: job._id }).exec();

    });

    test("Add Resume and download", async () => {
        const filePath = path.join(__dirname, 'test.pdf');
        const response = await request(app).post('/resume/add').attach('resume', filePath).set('Cookie', accessToken).expect(200);
        // Check if the resume is in the database

        const resume = await request(app).get('/resume/' + response.body.resume._id).set('Cookie', accessToken2).expect(OK);

        expect(resume.body.pdfName).toBe('test.pdf');

        expect(response.body.resume).toHaveProperty('pdfName', 'test.pdf'); // Adjust the expected file name
        expect(response.body.resume).toHaveProperty('path', './resume/uploads/');
    
        const uploadedFilePath = path.join(__dirname, '../../../resume/uploads/', resume.body.fileName);
        const fileExists = fs.existsSync(uploadedFilePath);
        expect(fileExists).toBe(true);

        //const resumeId = response.body.resume._id;
        // const downloadResponse = await request(app).get('/resume/download/' + resumeId).set('Cookie', accessToken).expect(200);

        // expect(downloadResponse.headers['content-disposition']).toContain('attachment');
        // expect(downloadResponse.headers['content-type']).toBe('application/pdf');

    }, 20000);

    test("Edit Job Application Status", async () => {
        const searchForJobTest1 = await request(app).get("/job/?search=Test 1").set('Cookie', accessToken).expect(OK);
        expect(searchForJobTest1.body.jobPostings.length).toEqual(1);
        expect(searchForJobTest1.body.jobPostings[0].title).toEqual("Job test 1");

        const job = searchForJobTest1.body.jobPostings[0];

        const requestAllApplications = await request(app).get("/job/" + job._id + "?candidateId="+requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        expect(requestAllApplications.body.application).toBeDefined();

        const application = requestAllApplications.body.application;

        const requestEditApplication = await request(app).put("/job/applications/edit/" + application._id).send({status: "Rejected"}).set('Cookie', accessToken2).expect(OK);

        const requestAllApplications2 = await request(app).get("/job/" + job._id + "?candidateId="+requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        expect(requestAllApplications2.body.application.status).toEqual("Rejected");
    });

    test("Unsave all Job Postings and check if query is empty", async () => {
        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);

        for(let i = 0; i < requestAllSavedJobs.body.jobPostings.length; i++) {
            const savedJob = requestAllSavedJobs.body.jobPostings[i].savedPosting[0];
            const requestUnsaveJob = await request(app).delete("/job/save/" + savedJob._id).set('Cookie', accessToken).expect(OK);
        }

        const requestAllSavedJobs2 = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);
        const requestAllJobs = await request(app).get("/job/").set('Cookie', accessToken).expect(OK);
        expect(requestAllJobs.body.jobPostings.length).toEqual(3);
        expect(requestAllSavedJobs2.body.jobPostings.length).toEqual(0);
    });

    test("Save all Job Postings and check if query to save jobs has same length as default query", async () => {
        const requestAllJobs = await request(app).get("/job/").set('Cookie', accessToken).expect(OK);

        for(let i = 0; i < requestAllJobs.body.jobPostings.length; i++) {
            const job = requestAllJobs.body.jobPostings[i];
            const savedJob = {
                jobId: job._id,
                candidateId: requestUserStuff.body._id
            }
            const requestSaveJob = await request(app).post("/job/save").send(savedJob).set('Cookie', accessToken).expect(CREATED);
        }

        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);
        expect(requestAllSavedJobs.body.jobPostings.length).toEqual(requestAllJobs.body.jobPostings.length);
    });

    test("Query Applications", async () => {
        const newuser = await UserModel.create({
            username: "AJ Manigque", 
            email: "aj@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        const newuser2 = await UserModel.create({
            username: "Noah C", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });

        const newUser = UserModel.create(newuser);
        const newUser2 = UserModel.create(newuser2);

        const ids = [
            (newuser._id as unknown as string).toString(),
            (newuser2._id as unknown as string).toString()
        ]

        const application1 = {
            jobId: "60f3b1b3b3b3b3b3b3b3b3b3",
            employerId: "werwerwerfwerwerwer",
            candidateId: ids[0],
            status: "Applied",
            resumeId: "dwqfqwefeqwfqwefqe",
            dateApplied: Date.now()
        }
        const application2 = {
            jobId: "60f3b1b3b3b3b3b3b3b3b3",
            employerId: "OogaBooga",
            candidateId: requestUserStuff.body._id,
            status: "Applied",
            resumeId: "dwqfqwefeqwfqwefqe",
            dateApplied: Date.now()
        }

        const application3 = {
            jobId: "60f3b1b3b3b3b3b3b3b3b3",
            employerId: "OogaBooga",
            candidateId: requestUserStuff.body._id,
            status: "Applied",
            resumeId: "dwqfqwefeqwfqwefqe",
            dateApplied: Date.now()
        }

        const application4 = {
            jobId: "60f3b1b3b3b3b3b3b3b3b3",
            employerId: "werwerwerfwerwerwer",
            candidateId: ids[1],
            status: "Applied",
            resumeId: "dwqfqwefeqwfqwefqe",
            dateApplied: Date.now()
        }

        const createApplication1 = await request(app).post("/job/applications/apply/").send({...application1}).set('Cookie', accessToken).expect(CREATED);
        const createApplication2 = await request(app).post("/job/applications/apply/").send({...application2}).set('Cookie', accessToken).expect(CREATED);
        const createApplication3 = await request(app).post("/job/applications/apply/").send({...application3}).set('Cookie', accessToken).expect(CREATED);
        const createApplication4 = await request(app).post("/job/applications/apply/").send({...application4}).set('Cookie', accessToken).expect(CREATED);

        const requestAllApplications = await request(app).get("/job/applications/all/query").set('Cookie', accessToken2).expect(OK);

        expect(requestAllApplications.body.applications.length).toEqual(6);

        const requestAllApplications2 = await request(app).get("/job/applications/all/query?candidateId="+requestUserStuff.body._id).set('Cookie', accessToken2).expect(OK);

        expect(requestAllApplications2.body.applications.length).toEqual(4);


        //multiple queries
        const requestAllApplications4 = await request(app).get("/job/applications/all/query?candidateId="+requestUserStuff.body._id + "&employerId=OogaBooga").set('Cookie', accessToken2).expect(OK);


        //delete Job Application
        for(let i = 0; i < requestAllApplications2.body.applications.length; i++) {
            const application = requestAllApplications2.body.applications[i];
            const requestDeleteApplication = await request(app).delete("/job/applications/delete/" + application._id).set('Cookie', accessToken2).expect(OK);
        }

        const requestAllApplications3 = await request(app).get("/job/applications/all/query?candidateId="+requestUserStuff.body._id).set('Cookie', accessToken2).expect(OK);
        expect(requestAllApplications3.body.applications.length).toEqual(0);


    })

    test("Check if the query sends empty array if there are no Jobs", async () => {
        await db.clearDatabase();

        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirmPassword: "12345678",
            userRole: "Candidate",
        };
        // Signup
        const signupResponse = await request(app).post("/auth/signup").send(userData);
        // login
        const loginResponse = await request(app).post('/auth/login').send(userData);
        expect(loginResponse.status).toBe(OK);

        // Get cookie
        const cookies = Array.isArray(loginResponse.headers["set-cookie"])
        ? loginResponse.headers["set-cookie"]
        : [loginResponse.headers["set-cookie"]];
        expect(cookies).toBeDefined();
        accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
        expect(accessToken).toBeDefined();

        // Get user information
        requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);

        const requestAllSavedJobs = await request(app).get("/job/?savedPostingCandidateId=" + requestUserStuff.body._id).set('Cookie', accessToken).expect(OK);
        expect(requestAllSavedJobs.body.jobPostings.length).toEqual(0);

        const requestAllJobs = await request(app).get("/job/").set('Cookie', accessToken).expect(OK);
        expect(requestAllJobs.body.jobPostings.length).toEqual(0);

    });
});