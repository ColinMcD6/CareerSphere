import express from 'express';
import request from 'supertest';
import * as db from './db';
import { getAllJobPostingsQueryHandler } from '../controllers/jobPostings.controller';
import JobPostingsModel from '../models/main/jobPostings.model';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Wire up the GET /job endpoint with the search-capable handler
app.get('/job', getAllJobPostingsQueryHandler);

describe('Job Postings Search API', () => {
  beforeAll(async () => {
    await db.connect();
    // Clear the collection and insert sample job postings for testing
    await JobPostingsModel.deleteMany({});
    await JobPostingsModel.insertMany([
      {
        title: 'Senior Software Engineer',
        positionTitle: 'Software Engineer',
        description: 'Develop high quality software solutions',
        employer: 'Tech Corp',
        employerId: 'employer1',
        location: 'New York',
        compensationType: 'salary',
        salary: 120000,
        jobType: 'Full-time',
        experience: [],
        skills: ['JavaScript', 'React'],
        education: [],
        status: 'Open',
        startingDate: new Date().toISOString(),
        datePosted: new Date(),
        deadline: new Date()
      },
      {
        title: 'Junior Developer',
        positionTitle: 'Developer',
        description: 'Work on small projects',
        employer: 'Innovative Solutions',
        employerId: 'employer2',
        location: 'San Francisco',
        compensationType: 'hourly',
        salary: 40,
        jobType: 'Part-time',
        experience: [],
        skills: ['Node.js', 'Express'],
        education: [],
        status: 'Open',
        startingDate: new Date().toISOString(),
        datePosted: new Date(),
        deadline: new Date()
      },
      {
        title: 'Data Analyst',
        positionTitle: 'Analyst',
        description: 'Analyze data and generate reports',
        employer: 'Data Insights',
        employerId: 'employer3',
        location: 'Chicago',
        compensationType: 'salary',
        salary: 80000,
        jobType: 'Full-time',
        experience: [],
        skills: ['Python', 'SQL'],
        education: [],
        status: 'Open',
        startingDate: new Date().toISOString(),
        datePosted: new Date(),
        deadline: new Date()
      }
    ]);
  });

  afterEach(async () => {
    // Optionally clear database between tests if needed
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  // Test 1: No search parameter returns all job postings
  test('should return all job postings when no search parameter is provided', async () => {
    const res = await request(app).get('/job');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(3);
  });

  // Test 2: Search term matching job title
  test('should return job postings matching the title', async () => {
    const res = await request(app).get('/job?search=Senior');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].title).toMatch(/Senior Software Engineer/);
  });

  // Test 3: Search term matching position title
  test('should return job postings matching the position title', async () => {
    const res = await request(app).get('/job?search=Developer');
    expect(res.statusCode).toBe(200);
    const titles = res.body.jobPostings.map((job: any) => job.positionTitle);
    expect(titles.some((t: string) => t.includes('Developer'))).toBeTruthy();
  });

  // Test 4: Search term matching description
  test('should return job postings matching the description', async () => {
    const res = await request(app).get('/job?search=high quality');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].description).toMatch(/high quality/);
  });

  // Test 5: Search term matching employer field
  test('should return job postings matching the employer', async () => {
    const res = await request(app).get('/job?search=Tech');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].employer).toMatch(/Tech Corp/);
  });

  // Test 6: Search term matching location field
  test('should return job postings matching the location', async () => {
    const res = await request(app).get('/job?search=San Francisco');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].location).toMatch(/San Francisco/);
  });

  // Test 7: Search term matching skills field (qualification)
  test('should return job postings matching the skills', async () => {
    const res = await request(app).get('/job?search=React');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].skills).toContain('React');
  });

  // Test 8: Verify search is case insensitive
  test('should be case insensitive', async () => {
    const res = await request(app).get('/job?search=tech corp');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(1);
    expect(res.body.jobPostings[0].employer).toMatch(/Tech Corp/);
  });

  // Test 9: Non-matching search returns an empty array
  test('should return an empty array when no postings match the search query', async () => {
    const res = await request(app).get('/job?search=nonexistent');
    expect(res.statusCode).toBe(200);
    expect(res.body.jobPostings.length).toBe(0);
  });

  // Test 10: Valid search query returns status 200
  test('should return status 200 for a valid search query', async () => {
    const res = await request(app).get('/job?search=Data');
    expect(res.statusCode).toBe(200);
  });
});
