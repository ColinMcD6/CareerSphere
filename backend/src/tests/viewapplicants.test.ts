import UserModel from '../models/main/users.model';
import * as db from './db'
import ApplicationModel from '../models/supportModels/application.model';
import { getJobPostingApplicationsQuery } from '../services/jobPostings.services';

describe("getJobPostingApplicationsQuery", () => {

    beforeAll(async () => {
        await db.connect();
    });
    
    afterEach(async () => {
        await db.clearDatabase();
    });
    
    afterAll(async () => {
        await db.closeDatabase();
    });

    test("should return applications with usernames for specific employer id and job id", async () => {
        const mockUser1 = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });
        const mockUser2 = await UserModel.create({
            username: "test_user2",
            email: "test_user2@gmail.com",
            password: "test123456789",
            userRole: "Employer",
        });

        await ApplicationModel.create([
            {
                jobId: "job1",
                employerId: "emp1",
                candidateId: mockUser1._id,
                resumeId: "res1",
                status: "Pending",
            },
            {
                jobId: "job2",
                employerId: "emp2",
                candidateId: mockUser2._id,
                resumeId: "res2",
                status: "Accepted",
            }
        ]);

        const result = await getJobPostingApplicationsQuery({ employer_id: "emp1", job_id: "job1" }, 1, 10);

        expect(result.applications.length).toBe(1);
        expect(result.applications[0]).toHaveProperty("username", "test_user");
    });

    test("should return applications with usernames for another specific employer id and job id", async () => {
        const mockUser1 = await UserModel.create({
            username: "test_user",
            email: "test_user@gmail.com",
            password: "test123456789",
            userRole: "Candidate",
        });
        const mockUser2 = await UserModel.create({
            username: "test_user2",
            email: "test_user2@gmail.com",
            password: "test123456789",
            userRole: "Employer",
        });

        await ApplicationModel.create([
            {
                jobId: "job1",
                employerId: "emp1",
                candidateId: mockUser1._id,
                resumeId: "res1",
                status: "Pending",
            },
            {
                jobId: "job2",
                employerId: "emp2",
                candidateId: mockUser2._id,
                resumeId: "res2",
                status: "Accepted",
            }
        ]);

        const result = await getJobPostingApplicationsQuery({ employer_id: "emp2", job_id: "job2" }, 1, 10);

        expect(result.applications.length).toBe(1);
        expect(result.applications[0]).toHaveProperty("username", "test_user2");
    });

    test("should handle no applications", async () => {
        const result = await getJobPostingApplicationsQuery({}, 1, 10);

        expect(result.applications).toEqual([]);
        expect(result.total).toBe(0);
        expect(result.page).toBe(1);
        expect(result.pages).toBe(0);
    });
});
