import request from "supertest"
import * as db from '../db'
import app from "../..";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http.constants";
import UserModel from "../../models/main/users.model";
import verificationModel from "../../models/supportModels/verify.model";
import verificationType from "../../constants/verificationTyes.constants";
import { oneyearfromnow } from "../../utils/auth_helpers/calc";

describe('API Routes', () => {
    beforeAll(async () => {
        await db.connect()
    }, 10000);
    afterEach(async () => {
        await db.clearDatabase()
    }, 10000);
    afterAll(async () => {
        await db.closeDatabase()
    }, 10000);

    test('Signup should create a new user and log in successfully with right credentials', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(newuser?.username).toBe("test_user")
    
        const loginData = {
            email: "test_user@gmail.com",
            password: "12345678",
        };
        const loginResponse = await request(app).post('/auth/login').send(loginData);
        expect(loginResponse.status).toBe(OK);
        expect(loginResponse.body).toHaveProperty('message', "Successfully Logged In !");
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();
    }, 10000);

    test('Signup and verify user email', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(newuser?.username).toBe("test_user")
    
        const verificaion_codes = await verificationModel.create({
            userId: newuser?._id, 
            type: verificationType.emailVerification,
            expireAt: oneyearfromnow(),
        })

        const verifyEmailResponse = await request(app).get(`/auth/email/verify/${verificaion_codes._id}`)
        expect(verifyEmailResponse.status).toBe(OK)

        const verifiedUser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(verifiedUser?.verified).toBe(true)
    }, 10000);

    
    test('Signup should create a new user but log in fails with wrong password', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(newuser?.username).toBe("test_user")
    
        const loginData = {
            email: "test_user@gmail.com",
            password: "123456555",
        };
        const loginResponse = await request(app).post('/auth/login').send(loginData);
        expect(loginResponse.status).toBe(UNAUTHORIZED);
        expect(loginResponse.body).toHaveProperty('message', "Invalid email or Password !");
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeUndefined();
    }, 10000);
    
    test('Signup should create a new user but log in fails with wrong email', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(newuser?.username).toBe("test_user")
    
        const loginData = {
            email: "test_use1r@gmail.com",
            password: "12345678",
        };
        const loginResponse = await request(app).post('/auth/login').send(loginData);
        expect(loginResponse.status).toBe(UNAUTHORIZED);
        expect(loginResponse.body).toHaveProperty('message', "User Account does not exist !");
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeUndefined();
    }, 10000);

    test('Signup, login successfully and logout', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        })
        expect(newuser?.username).toBe("test_user")
    
        const loginData = {
            email: "test_user@gmail.com",
            password: "12345678",
        };
        const loginResponse = await request(app).post('/auth/login').send(loginData);
        expect(loginResponse.status).toBe(OK);
        expect(loginResponse.body).toHaveProperty('message', "Successfully Logged In !");
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const logoutResponse = await request(app).get('/auth/logout');
        expect(logoutResponse.status).toBe(OK)
        const nocookies = logoutResponse.headers['set-cookie'];
        const NoaccessToken = nocookies[0].split(';')[0].split('=')[1];
        expect(NoaccessToken).toBe("");
    }, 10000);

    test('Signup, Login, Reset password and Login successfully again', async () => {
        const userData = {
            username: "test_user",
            email: "test_user@gmail.com",
            password: "12345678",
            confirm_password: "12345678",
            user_role: "Candidate"
        };
    
        const signupResponse = await request(app).post('/auth/signup').send(userData);
        expect(signupResponse.status).toBe(CREATED);
        expect(signupResponse.body).toMatchObject({
            username: "test_user",
            email: "test_user@gmail.com",
            userRole: "Candidate",
            education: [],
            skills: [],
            experience: []
        });

        const newuser = await UserModel.findOne({
            email: "test_user@gmail.com"
        });
        expect(newuser?.username).toBe("test_user");
        const newuserId = newuser?._id;
    
        const loginData = {
            email: "test_user@gmail.com",
            password: "12345678",
        };
        const loginResponse = await request(app).post('/auth/login').send(loginData);
        expect(loginResponse.status).toBe(OK);
        expect(loginResponse.body).toHaveProperty('message', "Successfully Logged In !");
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const verification_codes = await verificationModel.create({
            userId: newuserId, 
            type: verificationType.passwordReset,
            expireAt: oneyearfromnow(),
        })

        await request(app).post('/auth/password/reset').send({
            verifycode: verification_codes._id,
            password: "987654321"
        })

        const againloginData = {
            email: "test_user@gmail.com",
            password: "987654321",
        };
        const againloginResponse = await request(app).post('/auth/login').send(againloginData);
        expect(againloginResponse.status).toBe(OK);
        expect(againloginResponse.body).toHaveProperty('message', "Successfully Logged In !");
        const cookies1 = againloginResponse.headers['set-cookie'];
        expect(cookies1).toBeDefined();
    }, 10000);
});