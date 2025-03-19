import request from 'supertest';
import app from '../index';

// This is the beginning of the API test call procedure
describe("Test API", () => {

    test("Testing api", async () => {
        const mockData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            confirm_password: "test123456789",
            user_role: "Candidate",
        };
        const response = await request(app)
            .post('/auth/Signup') 
            .send(mockData)
            .set('Accept', 'application/json'); 

        expect(response.statusCode).toBe(201);
    }, 1000); 
});