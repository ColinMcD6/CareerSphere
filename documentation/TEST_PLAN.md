# Test Plan for Career Sphere
## Changelog
| Version | Change Date | By             | Description              |
|---------|-------------|----------------|--------------------------|
| 1.0     |Feb 23, 2025 | Colin McDonell | Create initial test plan |
| 1.1     |Feb 27, 2025 | Sukhmeet Singh Hora | Added unit tests for Signup, Login, Logout, Reset password, Verify Code and View Applicants |

## 1 Introduction
### 1.1 Scope
Scope defines the features, functional or non-functional requirements of the software that will be
tested

### 1.2 Roles and Responsibilities
| Name                | Email                   | Github Username | Role |
|---------------------|-------------------------|-----------------|------|
| Sudip Dip           | dips@myumanitoba.ca     | sudipta2621     |      |
| Bryce Erichsen      | erichseb@myumanitoba.ca | Bry-er          |      |
| Ethan Lapkin        | lapkine@myumanitoba.ca  | EthanLapkin     |      |
| AJ Manique          | manigqua@myumanitoba.ca | ThreshvsGaming  |      |
| Colin McDonell      | mcdonelc@myumanitoba.ca | ColinMcD6       |      |
| Sukhmeet Singh Hora | horass@myumanitoba.ca   | sukhmeet468     |      |

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
- Placeholder

#### 2. Employer Portal
##### Unit Tests
1. Should return applications with usernames for specific employer ID and job ID: Ensures that job applications for a given employer and job ID are retrieved, including candidate usernames.
2. Should return applications with usernames for another specific employer ID and job ID: Verifies that job applications for a different employer and job ID are correctly fetched with candidate usernames.
3. Should handle no applications: Confirms that the function correctly handles cases where no applications exist, returning an empty list.

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
- Placeholder

#### 3. Candidate Portal
##### Unit Tests
- placeholder (we need 10)
- placeholder (we need 10)
- placeholder (we need 10)
- placeholder (we need 10)

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
- Placeholder

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
