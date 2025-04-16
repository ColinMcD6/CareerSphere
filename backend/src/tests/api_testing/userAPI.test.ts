import request from "supertest";
import * as db from "../db";
import app from "../..";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http.constants";

describe("API Routes", () => {
  beforeAll(async () => {
    await db.connect();
  }, 10000);
  afterEach(async () => {
    await db.clearDatabase();
  }, 10000);
  afterAll(async () => {
    await db.closeDatabase();
  }, 10000);

  test("Create an account, Login, and then try to access it - should work!", async () => {
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
    const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
    expect(accessToken).toBeDefined();

    // Get user information
    const requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);

    expect(requestUserStuff.status).toEqual(OK); // Response should be okay
    expect(requestUserStuff.body).toHaveProperty("email"); // Response should have email property in body
    expect(requestUserStuff.body.email).toEqual(userData.email); // email should be equal to what we set it to

    expect(requestUserStuff.body).toHaveProperty("username");
    expect(requestUserStuff.body.username).toEqual(userData.username);
  }, 10000);

  test("Create an account, and then try to access account without sending cookies should be - denied!", async () => {
    const userData = {
      username: "test_user",
      email: "test_user@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
      userRole: "Candidate",
    };

    const signupResponse = await request(app);

    // Try to access user information without sending jwt cookie token
    const requestUserStuff = await request(app).get("/user").send(userData);
    expect(requestUserStuff.status).toEqual(UNAUTHORIZED);
    expect(requestUserStuff.body).toHaveProperty("message", "Not authorized");

  }, 10000);

  test("Create an account, login, edit information, and the update information, and check if information has been updated!", async () => {
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
  
      const accessToken = cookies.find((cookie: string) =>cookie.startsWith("accessToken="));
      expect(accessToken).toBeDefined();
  
      const updatedInformation = {
        experience: ["New information", "stuff"],
        phoneNumber: "12345678",
        skills: ["New skills is here", "another new skill"]
      };

      // Update user information
      const requestUserUpdate = await request(app).put("/user/update").send(updatedInformation).set('Cookie', accessToken);
      console.log(requestUserUpdate.error)
      expect(requestUserUpdate.status).toEqual(OK); // Response should be okay


       // Get user information, and see if information has been updated
      const requestUserStuff = await request(app).get("/user").send(userData).set('Cookie', accessToken);
      
      expect(requestUserStuff.status).toEqual(OK); // Response should be okay

      // Check updated properties
      expect(requestUserStuff.body).toHaveProperty("experience");  
      expect(requestUserStuff.body.experience).toEqual(updatedInformation.experience);
     
      expect(requestUserStuff.body).toHaveProperty("phoneNumber");
      expect(requestUserStuff.body.phoneNumber).toEqual(updatedInformation.phoneNumber);

      expect(requestUserStuff.body).toHaveProperty("skills");
      expect(requestUserStuff.body.skills).toEqual(updatedInformation.skills);
  }, 10000);
});