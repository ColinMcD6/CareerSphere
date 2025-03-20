import * as db from './db'
import { getUserHandler, updateUserDetails } from '../controllers/user.controller';
import { Request, Response } from 'express';
import UserModel from '../models/users.model';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http';
import mongoose from 'mongoose';

describe('Test user preference updates', () => {
    beforeAll(async () => {
        await db.connect()
    });
    afterEach(async () => {
        await db.clearDatabase()
    });
    afterAll(async () => {
        await db.closeDatabase()
    });

    test('Update valid preferences and confirm correct changes', async () => {
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        user?.updatePreference(2);
        user?.updatePreference(2);
        user?.updatePreference(2);
        user?.updatePreference(2);
        user?.updatePreference(1);
        user?.updatePreference(4);
        user?.updatePreference(4);
        expect(user?.preferences[0]).toBe(0);
        expect(user?.preferences[1]).toBe(1);
        expect(user?.preferences[2]).toBe(4);
        expect(user?.preferences[3]).toBe(0);
        expect(user?.preferences[4]).toBe(2);
        expect(user?.preferences[5]).toBe(0);
    });

    test('Update invalid preferences and confirm no changes or crashes', async () => {
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();
        user?.updatePreference(-2);
        user?.updatePreference(-2);
        user?.updatePreference(-2);
        user?.updatePreference(-2);
        user?.updatePreference(10);
        user?.updatePreference(14);
        user?.updatePreference(40);
        expect(user?.preferences[0]).toBe(0);
        expect(user?.preferences[1]).toBe(0);
        expect(user?.preferences[2]).toBe(0);
        expect(user?.preferences[3]).toBe(0);
        expect(user?.preferences[4]).toBe(0);
        expect(user?.preferences[5]).toBe(0);
    });

    test('Check if updateUserDetails will update preference correctly', async () => {
        const newuser = await UserModel.create({
            username: "colin", 
            email: "colin@gmail.com", 
            password: "12345678", 
            userRole: "Candidate",
            education: ["University of Manitoba"],
            skills: ["Kendama"],
            experience: ["Software Engineering 2"],
            companyDetails: undefined,
            hiringDetails: undefined,
        });
        let user = await UserModel.findById(newuser._id);
        // Check record is in database
        expect(user).not.toBeNull();

        const mReq1: Partial<Request> = {
            body: {preference: 0},
            userId: newuser._id,
        };
        const mReq2: Partial<Request> = {
            body: {preference: 1},
            userId: newuser._id,
        };
        const mJson = jest.fn().mockImplementation(() => null)
        const mStatus = jest.fn().mockImplementation(() => ({ json: mJson }))
        const mRes: Partial<Response> = {
            status: mStatus
        };
        const mNext = jest.fn();
        
        updateUserDetails(mReq1 as Request, mRes as Response, mNext);
        updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        updateUserDetails(mReq2 as Request, mRes as Response, mNext);
        expect(user?.preferences[0]).toBe(1);
        expect(user?.preferences[1]).toBe(2);
        expect(user?.preferences[2]).toBe(0);
        expect(user?.preferences[3]).toBe(0);
        expect(user?.preferences[4]).toBe(0);
        expect(user?.preferences[5]).toBe(0);
    });
})