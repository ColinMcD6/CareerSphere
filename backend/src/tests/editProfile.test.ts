import * as db from './db'
import { updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import JobPostingsModel from '../models/jobPostings.model';

describe('Test request with mongoose', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    test('Updating education field', async () => {
        const old_education = ["Highschool"]
        const new_education = ["Highschool", "University of Manitoba"]
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: old_education,
            skills: [],
            experience: [],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user?.education).toEqual(old_education);

        const mReq: Partial<Request> = {
            body: { education: new_education},
            userId: newuser._id,
        };
        const mRes: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const mNext = jest.fn();
        await updateUserDetails(mReq as Request, mRes as Response, mNext);
        expect(mRes.status).toHaveBeenCalledWith(200);
        user = await UserModel.findById(newuser._id);
        // Check record is updated with new education
        expect(user?.education).toEqual(new_education);
    });
})