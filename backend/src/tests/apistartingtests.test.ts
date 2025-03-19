import request from "supertest";
import app from "../index";



const email = "testemail@gmail.com"
const password = "password1234"
const roll = "Employer"

// This is the beginning of the API test call procedure
describe("Test signup API", () => {
  test("Test signup API", async () => {
    const mockData = {
      username: "test_user",
      email: email,
      password: password,
      confirm_password: password,
      user_role: roll,
    };
    const response = await request(app)
      .post("/auth/Signup")
      .send(mockData)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(201);
  }, 2000000);
});


describe("Test job posting API", () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Sign in to get the JWT token
    const loginResponse = await request(app)
      .post("/auth/Login")
      .send({
        email: email,
        password: password,
        user_role: roll,
      })
      .set("Accept", "application/json");

    // Check if the login was successful
    expect(loginResponse.statusCode).toBe(200);

    // Ensure cookies is treated as an array
    const cookies = Array.isArray(loginResponse.headers["set-cookie"])
      ? loginResponse.headers["set-cookie"]
      : [loginResponse.headers["set-cookie"]];

    // Extract tokens from the Set-Cookie header
    accessToken = cookies.find((cookie: string) =>
      cookie.startsWith("accessToken=")
    );
    refreshToken = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken=")
    );

    // Ensure tokens were extracted successfully
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  test("Add a job posting", async () => {

    const jobPosting = {
        title: "Job to do fun things",
        description: "Best job in the world. Everyday you will wake up and be so happy and inspired to come to work.",
        positionTitle: "Software developer",
        location: "Winnipeg",
        compensationType: "hourly",
        salary: 100,
        jobType: "Full-time",
        experience: ["None"],
        skills: ["ChatGPT"],
        education: ["None"],
        status: "Open"
    }

    const response = await request(app)
      .post("/job/add")
      .send(jobPosting)
      .set("Accept", "application/json")
      .set('Cookie', accessToken); // Include the access token in the Cookie header

    expect(response.statusCode).toBe(201);
  }, 2000000);
});
