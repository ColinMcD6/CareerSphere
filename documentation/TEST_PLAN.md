# Test Plan for Career Sphere
## Changelog
| Version | Change Date | By             | Description              |
|---------|-------------|----------------|--------------------------|
| 1.0     |Feb 23, 2025 | Colin McDonell | Create initial test plan |
| 1.1     |Feb 27, 2025 | Sukhmeet Singh Hora | Added unit tests for Signup, Login, Logout, Reset password, Verify Code and View Applicants |
| 1.2     |Feb 28, 2025 | Colin McDonell | Documented all unit and acceptance tests for sprint 2 |

## 1 Introduction
### 1.1 Scope
Scope defines the features, functional or non-functional requirements of the software that will be
tested

### 1.2 Roles and Responsibilities
| Name                | Email                   | Github Username | Role |
|---------------------|-------------------------|-----------------|------|
| Sudip Dip           | dips@myumanitoba.ca     | sudipta2621     | Developers     |
| Bryce Erichsen      | erichseb@myumanitoba.ca | Bry-er          | Developers     |
| Ethan Lapkin        | lapkine@myumanitoba.ca  | EthanLapkin     | Developers     |
| AJ Manique          | manigqua@myumanitoba.ca | ThreshvsGaming  | Developers     |
| Colin McDonell      | mcdonelc@myumanitoba.ca | ColinMcD6       | Test Manager     |
| Sukhmeet Singh Hora | horass@myumanitoba.ca   | sukhmeet468     | Developers     |

## 2 Test Methodology 

### 2.1 Test Levels
Below are the core features and how we plan to test them. More details will be added in future sprints.

#### 1. Account Management
##### Unit Tests
1. Successfully creates a new Candidate user: Verifies that a candidate user is created with expected fields (education, skills and experience) and saved to db, email verification code is created and saved to db, tokens and session is created.
2. Successfully creates a new Employer user: Verifies that an employer user is created with expected fields (companyDetails, HiringDetails) and saved to db, email verification code is created and saved to db, tokens and session is created.
3. Fails to create a user if the account already exists: Verifies that signing up with an existing email is not allowed and prevents duplicate accounts.
4. Successfully logs in a user with valid credentials: Verifies that a user can log in with correct credentials, creating a session and generating access and refresh tokens.
5. Fails to log in if user does not exist: Verifies that login fails with an error message (User Account does not exist !) if the email is not signed up and no session or tokens are created.
6. Fails to log in with incorrect password: Checks that login fails with an error message (Invalid email or Password !) if the password is incorrect and no session or tokens are created.
7. Successfully logs out a user and deletes session: Verifies that logging out deletes the user's session, keeps the signup session, and clears cookies forcing the user to log in again.
8. Verify the user email by code successfully: Verifies the generated verification code saved in databases for the user matches to the one function is called with, updates the verification status to true, and deletes the verification code from database.
9. Reset password for an existing user:  Verifies that a user can successfully reset their password using a valid verification code, updated password is saved to database for that user and the code is deleted after successfully resetting the password.
10. Fails to reset the password if the code is inavlid: Verifies that password reset fails without a valid verification code, keeping the user's password unchanged.

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
1. Successful Account Creation
    - A new user fills in their name, email, password, and selects "Candidate" or "Employer."   
    - After clicking "Sign Up," they are redirected to a dashboard matching their role (e.g., Employers see "Post Job," Candidates see "Apply for Jobs").   

2. Duplicate Account Prevention   
    - A user tries to sign up with an email already registered.   
    - They see an error: "Account already exists!"   

3. Password Strength Feedback 
    - A user enters a password with less than 8 characters while signing up 
    - They see: "Password must be at least 8 characters"   

4. Login Success 
    - A user enters their email and password.   
    - They are redirected to their role-specific dashboard (e.g., Employer Dashboard).   

5. Login Error Handling 
    - A user enters an incorrect password or invalid email.   
    - They see: "Invalid email or password"   

6. Session Persistence 
    - After closing and reopening the browser, the user remains logged in.   

7. Reset Password via Email   
    - A user clicks "Forgot Password," enters their email, and receives a reset link. 
    - Clicking the link lets them set a new password.   

8. Expired Reset Link 
    - A user tries to use a password reset link after 60 minutes.   
    - They see: "Invalid or expired reset link" 

9. New Password Validation   
    - After resetting their password, the user should see “Password Reset Successful” 
    - The user can log in with the new password.   

10. Logout Functionality  
    - After clicking "Logout," the user is redirected to the login page.   
    - The user sees “Logout Successful”   

11. Security 
    - After logging out, a user cannot access `/dashboard` without logging in again.  

#### 2. Employer Portal
##### Unit Tests
1. Update hiring details section of employer profile and test whether change is reflected in the database
2. Update hiring details section of employer profile with an integer or string and test whether they are converted to string arrays and the change is reflected in the database
3. Update company details section of employer profile and test whether change is reflected in the database
4. Update company details section of employer profile with an integer and test whether integer is converted to string and update is reflected in the database
5. Update company details section of employer profile with array and test whether mongoose validation error is thrown
6. Retrieve employer information based on UserID
7. Retrieving employer information with UserID that does not exist throws an error
8. Should return applications with usernames for specific employer ID and job ID: Ensures that job applications for a given employer and job ID are retrieved, including candidate usernames.
9. Should return applications with usernames for another specific employer ID and job ID: Verifies that job applications for a different employer and job ID are correctly fetched with candidate usernames.
10. Should handle no applications: Confirms that the function correctly handles cases where no applications exist, returning an empty list.
11. Create a job posting meeting all the field criteria and test whether the job posting is created in the database
12. Create a job posting with a title that is too short and test whether an error is thrown and the job is not created in the database
13. Create a job posting with description that is too short and test whether an error is thrown and the job is not created in the database
14. Create a job posting with an invalid compensation type and test whether an error is thrown and the job is not created in the database

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
1. Employer View
    - A user can see “Edit Profile” option as an employer 
    - Employers see "Post Job" and "View Applicants" but no "Apply" button. 

2. Employer Profile Update 
    - An Employer updates their company’s location to "New York."   
    - The change is reflected on their company profile page.   

3. Post a New Job 
    - An Employer fills out a job form (title: "Frontend Developer," location: "Remote").   
    - The job appears in the public "Job Listings" page.   

4. Track Applicants 
    - An Employer can see a list of Candidates who applied, with usernames below the specific job posting.   

5. Form Validation 
    - A user tries to submit a job form, and then on submit they can see the validation errors. 

#### 3. Candidate Portal
##### Unit Tests

1. Update education section of candidate profile and test whether change is reflected in the database
2. Update education section of candidate profile with string and test whether it is converted to array and the change is reflected in the database
3. Update skill section of candidate profile and test whether change is reflected in the database
4. Update skill section of candidate profile with array containing a string and an integer and test whether integer is converted to a string and change is reflected in the database
5. Update experience section of candidate profile and test whether change is reflected in the database
6. Update experience section of candidate profile with JSON object and test whether mongoose throws a validation error
7. Retrieve candidate information based on UserID
8. Attempt to update a candidate profile that does not exist throws an error
9. Adding a new application. Adds an application and saves it to the db
10. Getting a job application. Checks whether function returns the exact application record
11. Getting a job application with query. Checks whether function is querying for specific applications correctly. Only has 1 query.
12. Getting a job application with query 2. Checks whether function is querying for specific applications correctly. Has multiple queries as well as paging
13. Getting a job application with query 3. Checks whether function is querying for specific applications correctly. Only has paging.
14. Deleting a job application. Checks whether function deletes the correct
15. Test adding resume. Test whether a pdf file is successfully added to the db.

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
1. Candidate View  
    - A user can see “Edit Profile” option as a candidate 
    - Candidates see "Apply for Jobs" but no "Create Job" button.  

2. Update Profile Details 
    - A Candidate adds their "Software Engineering" skills and saves the profile.   

3. Resume Upload Success   
    - A Candidate uploads a PDF resume. 

4. Invalid Resume Handling   
    - File must be PDF/DOCX. 

5. View Job Details
    - A Candidate clicks on a job titled "Frontend Developer."   
    - They see the full description, salary, and location.   

6. Apply for a Job 
    - A Candidate clicks "Apply" on a job, uploads their resume, and submits. The apply button changes to applied. 

7. View Application Status 
    - A Candidate checks "My Applications" and sees their status: "Pending," "Accepted". 

### Non-functional Feature
- Implemented in later sprint (For load testing, when design the load, make sure at least twos request associated with
every core feature is inlcuded in the test load.)

### 2.2 Test Completeness
Below is the criteria for test completeness:
- 100% of the backend codebase should be covered by unit tests
- 100% of API routes should be covered by integration tests
- Before a pull request can be merged into main, all tests must pass
- All tests are run automatically when submitting a pull request to the main branch

## 3 Resource & Environment Needs
### 3.1 Testing Tools
The following testing tools will be used:
- Github actions for automated testing
- Jest for testing backend and frontend javascript code
- React Testing Library to test UI components
- Supertest for API routes
- JMeter for load testing

### 3.2 Test Environment
Tests will be run in the following environments:
- Local operating system (Windows/MacOS)
- Docker
- Github Actions

## 4 Terms/Acronyms
API - Application Program Interface
