import request from "supertest";
import * as db from "../db";
import app from "../..";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http";

describe("API Routes", () => {
  beforeAll(async () => {
    await db.connect();
  }, 10000);
  afterAll(async () => {
    await db.closeDatabase();
  }, 10000);

  test("Create employer account, create 2 jobs, query all jobs, make sure the jobs show up", async () => {
    const userData = {
      username: "test_user",
      email: "test_user@gmail.com",
      password: "12345678",
      confirm_password: "12345678",
      user_role: "Employer",
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
    const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
    expect(accessToken).toBeDefined();

    // Get user information
    const requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);

    
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

    const requestCreateJob1 = await request(app).post("/job/add").send({...newJob1}).set('Cookie', accessToken);
    expect(requestCreateJob1.status).toEqual(CREATED);

    const newJob2 = {
      title: "Job test 1",
      description: "We are looking for a Dog Catcher!, 50 characters needed for title, 50 characters needed for title, 50 characters needed for title, 50 characters needed for title ",
      positionTitle: "Software Engineer",
      employer: "Google",
      location: "Mountain View",
      compensationType: "salary",
      salary: 100000,
      jobType: "Full-time",
      experience: ["2 years"],
      skills: ["React", "Node"],
      education: ["Bachelors"],
      status: "Open",
      startingDate: Date.now(),
      category: 3
  }

  const requestCreateJob2 = await request(app).post("/job/add").send({...newJob2}).set('Cookie', accessToken);
  expect(requestCreateJob2.status).toEqual(CREATED);

  // Now that jobs have been created, query jobs, and see if they show up.
  const requestGetAllJobs = await request(app).get("/job/").set('Cookie', accessToken);
  expect(requestGetAllJobs.status).toEqual(OK);

  expect(requestGetAllJobs.body.jobPostings.length).toEqual(2);
  expect(requestGetAllJobs.body.jobPostings[0].title).toEqual(newJob1.title);
  expect(requestGetAllJobs.body.jobPostings[1].title).toEqual(newJob2.title);

  }, 10000);



  test("Create employer account, create 2 jobs, query all jobs, make sure the jobs show up", async () => {
    const userData = {
      username: "test_user",
      email: "test_user@gmail.com",
      password: "12345678",
      confirm_password: "12345678",
      user_role: "Employer",
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
    const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
    expect(accessToken).toBeDefined();

    // Get user information
    const requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);

    
    const newJob1 = {
        title: "Job test 3, yes 3!",
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

  const requestCreateJob1 = await request(app).post("/job/add").send({...newJob1}).set('Cookie', accessToken);
  expect(requestCreateJob1.status).toEqual(CREATED);

    // Now that jobs have been created, query jobs, and see if they show up.
    const requestGetAllJobs = await request(app).get("/job/").set('Cookie', accessToken);
    expect(requestGetAllJobs.status).toEqual(OK);
  
    expect(requestGetAllJobs.body.jobPostings.length).toEqual(3);
    expect(requestGetAllJobs.body.jobPostings[2].title).toEqual(newJob1.title);


    const jobId = requestGetAllJobs.body.jobPostings[2]._id;

    // Get job posting, and make sure everything is correct
    const requestGetSingleJob = await request(app).get(`/job/${jobId}`).set('Cookie', accessToken);
    expect(requestGetSingleJob.status).toEqual(OK);
    expect(requestGetSingleJob.body.jobPosting.title).toEqual(newJob1.title);



  }, 10000);

  
});