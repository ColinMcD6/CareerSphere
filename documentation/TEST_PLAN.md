# Test Plan for Career Sphere
## Changelog
| Version | Change Date | By             | Description              |
|---------|-------------|----------------|--------------------------|
| 1.0     |Feb 23, 2025 | Colin McDonell | Create initial test plan |
| 1.1     |Feb 27, 2025 | Sukhmeet Singh Hora | Added unit tests for Signup, Login, Logout, Reset password, Verify Code and View Applicants |
| 1.2     |Feb 28, 2025 | Colin McDonell | Documented all unit and acceptance tests for sprint 2 |
| 1.3     |Mar 20, 2025 | Sukhmeet Singh Hora | Added unit tests for Quizzing for Job Screening Process: creating quiz, getting quiz, submitting response and getting candidate response with score, Also added some integration API Tests for Account Managemnt|

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
1. Signup should create a new user and log in successfully with correct credentials: This test verifies that a user can successfully sign up and log in using the correct email and password and tokens are assigned in the cookies. POST /auth/signup and POST /auth/login
2. Signup and verify user email: This test ensures that after signing up, a user can verify their email address using a verification code. POST /auth/signup and GET /auth/email/verify/:verifycode
3. Signup should create a new user but log in fails with wrong password: This test checks that login fails when an incorrect password is used for an existing account. POST /auth/signup and POST /auth/login
4. Signup should create a new user but log in fails with wrong email: This test confirms that login fails when an incorrect email is provided. POST /auth/signup and POST /auth/login
5. Signup, login successfully, and logout: This test verifies that a user can sign up, log in, and successfully log out and clear the tokens in the cookies. POST /auth/signup, POST /auth/login and GET /auth/logout
6. Signup, Login, Reset password, and Login successfully again: This test checks that after signing up and logging in, a user can reset their password and log in again with the new password. POST /auth/signup, POST /auth/login and POST /auth/password/reset
7. Create an account, login, get the JWT token in the cookie, and then access user information via /user route. Tests that information can be retreived, and response it ok
8. Create an account, and then try to access user information via /user route WITHOUT sending JWT tokens. Tests that information cannot be retreived without proper authentication.
9. Create an account, login, get JWT token, then update user information via /user/update route, then request user information via /user. Tests that user information can be updated via routes.

##### Acceptance Tests
1. Successful Account Creation
    - A new user fills in their name, email, password, and selects "Candidate" or "Employer."   
    - After clicking "Sign Up," they are redirected back to the login screen.  
Instructions: Open the website and click the button labeled "Need to Create Account?" enter the username "test1" to the "Username" field, the email address "test1@gmail.com" to the "Email Address" field, and the password "test1234" into both the "Password" and "Confirm Password" fields. Ensure the dot next to "Candidate" is blue and press the "Sign Up" button. You should be informed of a successful account creation and sent back to the previous screen, concluding the test.

2. Duplicate Account Prevention   
    - A user tries to sign up with an email already registered.   
    - They see an error: "Account already exists!"  
Instructions: Perform the Successful Account Creation acceptance test, and then click the "Need to Create Account?" button once more. Enter the same credentials into the same slots and expect to be informed that the account already exists, signalling a successful test.

3. Password Strength Feedback 
    - A user enters a password with less than 8 characters while signing up 
    - They see: "Password must be at least 8 characters"   
Instructions: Open the website and click the button labeled "Need to Create Account?" enter the username "test1", the email address "test1@gmail.com", and the password "test" into both the password and confirm password fields. Ensure the dot next to "Candidate" is blue and attempt to press the "Sign Up" button. You should be unable to click the button and can look underneath the password field to see in red that your password must be 8 characters long, signalling a successful test.

4. Login Success 
    - A user enters their email and password.   
    - They are redirected to their role-specific dashboard (e.g., Employer Dashboard).   
Instructions: Perform the Successful Account Creation acceptance test. In the field labelled "Email address" enter the email given in that test, and in the "Password" field enter the given password. Press the "Log In" button and expect to be taken to a home screen with the website label in the center, signalling a successful login.

5. Login Error Handling 
    - A user enters an incorrect password or invalid email.   
    - They see: "Invalid email or password"   
Instructions: Perform the Successful Account Creation acceptance test. In the field labelled "Email address" enter the email "wrong@gmail.com", and in the "Password" field enter the given password. Press the "Log In" button and expect to be informed "Invalid email or password. Please try again" above the email field.

6. Session Persistence 
    - After closing and reopening the browser, the user remains logged in.  
Instructions: Perform the Login Success acceptance test. Now go the top of your screen, right below the tabs where it says "https://CareerSphere" and click on it. Now press    Ctrl+c or an equivalent method of copying the highlighted text. Press the X on the tab with the same name as the text you just copied. Open a new tab and press Ctrl+v or some equivalent method of pasting the copied text, press enter. You should be returned to the home screen that was there before, signalling a successful test.

7. Logout Functionality  
    - After clicking "Logout," the user is redirected to the login page.   
    - The user sees “Logout Successful”  
Instructions: Perform the Login Success acceptance test. On the bottom left of your screen you will see a symbol of a grey circle containing the simplified outline of a persons head and shoulders. Click this and then the words "Log Out" that appear above it. You should be taken back to the login screen signalling a successful test.

8. Security 
    - After logging out, a user cannot access `/dashboard` without logging in again.  
Instructions: Perform the Logout Functionality acceptance test. Now go to the top left of your screen and click the arrow pointing left (back). You should remain on the login screen and not be shown the home screen at any point using the back arrow. This signifies a successful test.

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

1. Job posting API test. Create multiple jobs through API route /job/add using an Employer account. Make sure the response from the server is ok, and that response includes jobs.
2. Job posting API test. Create multiple jobs through API route /job/add using an Employer account. Query all jobs, and query individual jobs ( GET /job and job/:id)

##### Acceptance Tests
1. Employer View
    - A user can see “Edit Profile” option as an employer 
    - Employers see "Post Job" and "View Applicants" but no "Apply" button. 
Instructions: Open the website and click the button labeled "Need to Create Account?" enter the username "test2" to the "Username" field, the email address "test2@gmail.com" to the "Email Address" field, and the password "test1234" into both the "Password" and "Confirm Password" fields. Press the Dot next to the word "Employer" and ensure it is blue. Press the "Sign Up" button. You should be informed of a successful account creation and sent back to the previous screen, Enter the given email to the "Email" field and the password to the "Password" field. Press the "Log In" button and expect to be taken to the home screen. Near the top right of the screen you will see a briefcase and the word "Jobs", click on that. You will be taken to a new screen with the words "My Job Postings" at the top. You should also see a green button labelled "Create" and a search bar. There should be no postings on this page. This concludes the test.

2. Employer Profile Update 
    - An Employer updates their company’s location to "New York."   
    - The change is reflected on their company profile page. 
Instructions: Open the website and click the button labeled "Need to Create Account?" enter the username "test2" to the "Username" field, the email address "test2@gmail.com" to the "Email Address" field, and the password "test1234" into both the "Password" and "Confirm Password" fields. Press the Dot next to the word "Employer" and ensure it is blue. Press the "Sign Up" button. You should be informed of a successful account creation and sent back to the previous screen, Enter the given email to the "Email" field and the password to the "Password" field. Press the "Log In" button and expect to be taken to the home screen. At the bottom left you will see a grey circle with the outline of a persons head and shoulders, click it. Click the words "Edit Profile" that appear above it and expect to be taken to a new screen with the information you entered at the top, followed by several fields. In the field labelled "Company Details" enter the words "Located in New York" and then click the blue "Confirm" button. Expect to be taken to the home screen. Repeat the process of moving to the edit profile screen and observe that the typed message remains in the "Company Details" field to conclude the test.

3. Post a New Job 
    - An Employer fills out a job form (title: "Frontend Developer," location: "Remote").   
    - The job appears in the public "Job Listings" page.   
Instructions: Perform the Employer View acceptance test, click the "Create" button and expect to be shown a form. Enter in order from top to bottom: "Frontend Developer", "title", "description satisfying requirement of 50 characters", nothing, nothing, nothing, "Remote", "skills", "education". Click the round button next to the word "Temporary", followed by the one next to "Technology". Click the "Create Job Posting" button at the bottom. Observe a message confirming that the job posting was created, and that there is now a job labeled "title of job" in the list of postings to conclude the test.

4. Track Applicants 
    - An Employer can see a list of Candidates who applied, with usernames below the specific job posting.   
Instructions: Perform the Post a New Job acceptance test. Near the top right of the screen you will see a house symbol and the word "Home", click on it. You will be sent to a new screen with a grey circle containing the simplified outline of a person. Click on that, followed by the words "Log Out". Perform the Login Success acceptance test from feature 1. Click on the "Jobs" button with the briefcase again and expect to be shown the job named "title of job". Click on the blue "View Job Posting" button and expect to be shown the job details you entered before. Now click on the blue "Apply" button. If you are willing and able to enter a PDF into the website, do so by clicking the "Browse..." button and selecting it. If you are not, end the test here. If you submitted the file, press the "Submit" button. Now press the "Home" button and then log out using the grey circle once again. Log In once more using the credentials from Employer View, and click on the "Jobs" button in the top right. Click on the "View Job Posting" button and scroll downward. You should see that you have 1 applicant, along with a horizontal rectangle with the name "test1". Click on this to show the details of the candidate you created and then the "View Resume" button in order to verify the file is correct and complete the test.

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
16. Test if you can saved job postings
17. Test if you can save a job posting
18. Test if you can unsave a job postings

##### Integration Tests

1. Look for all Job Posting then look for saved job postings. Then used both the user's and job posting information to retrieve records that show case that a specific job posting is saved by the user
2. Unsave a job and check if it correctly effects the query that showcases saved jobs
3. Save a job and check if it correctly effects the query that showcases saved jobs
4. Create multiple applications for a single job and check if you can access each application catered to that specific job. Some applications will have the same Candidate.
5. Attached a Resume to the request and see if you can download the same resume using the information from the response
6. Edit an application status and use a GET route which returns a job posting and a application related to the edited application and the user
7. Unsave all job postings and check if the save job posting query returns an indicator that the search was empty
8. Save all job postings and check if the number of saved postings match the total amount of job postings
9. Query Applications using information related to different users and job postings
10. Check whether or not job postings and saved job postings are empty regardless of query


##### Acceptance Tests
1. Candidate View  
    - A user can see “Edit Profile” option as a candidate 
    - Candidates see "Apply for Jobs" but no "Create Job" button.  
Instructions: Perform the Login Success acceptance test from feature 1. Near the top right of your screen you will see a suitcase symbol next to the word "Jobs", click on it. You should be taken to a new screen with the words "All Job Postings" in blue, along with a smaller button for "Saved Jobs" and a search bar. This should be all that is there, concluding the test.

2. Update Profile Details 
    - A Candidate adds their "Software Engineering" skills and saves the profile.   
Instructions: Perform the Login Success acceptance test from feature 1. at the bottom left of your screen you will see a grey circle with the simplified outline of a persons head and shoulders, click that. Now click the words "Edit Profile" that appear above it and expect to be taken to a new screen. This screen should list the information you entered when signing up, followed by several fields. In the field labelled "User Skills", there should be a button labelled "Add Skill". Click this button and enter the words "Software Engineering" into the section that is created. Press the "Confirm" button and expect to be taken back to the home screen. Repeat the steps for entering the edit profile screen and observe that the added skill is still there to conclude the test.

*I reccomend the next four tests be done in one session, as each follows directly from the next*

3. View Job Details
    - A Candidate clicks on a job titled "Frontend Developer."   
    - They see the full description, salary, and location.   
Instructions: Complete the Track Applicants acceptance test up to and including the part where you click on the "View Job Posting" button as a candidate. Observe the details are displayed as they were entered to conclude the test

4. Resume Upload Success   
    - A Candidate uploads a PDF resume. 
Instructions: Continue from View Job Details and press the "Apply" button. If you are willing and able to do so: upload a PDF file from your computer. Press the "Browse..." button to open your files, and then the "Submit" button to confirm.

5. Apply for a Job 
    - A Candidate clicks "Apply" on a job, uploads their resume, and submits. The apply button changes to applied. 
Instructions: Continue from Resume Upload Success and observe that upon pressing submit, the Apply button changes to "Applied".

6. View Application Status 
    - A Candidate checks "My Applications" and sees their status: "Pending," "Accepted". 
Instructions: Continue from Apply for a Job, look to the top left of the window containing the job information to see the word "Pending". This concludes the test.

#### 4. Quizzing for Job Screening Process
##### Unit Tests

1. Creating a Quiz and Updating Job Posting: The test verifies that a quiz is successfully created and linked to a job posting. It checks that the response status is CREATED, the success message is returned, and the job posting is updated with the new quiz.
2. Handling Empty Quiz Questions: This test ensures that an attempt to create a quiz without questions results in a BAD_REQUEST response. It confirms that no quiz is added to the database and that the job posting remains unchanged.
3. Handling No QuizName: This test ensures that an attempt to create a quiz without quiz name results in a BAD_REQUEST response. It confirms that no quiz is added to the database and that the job posting remains unchanged.
4. Ensures the handler returns a "Not Found" error when trying to create a quiz for a non-existent job.
5. Retrieving Quizzes for a Job Posting: The test verifies that when valid job ID is provided, all quizzes associated with that job are successfully retrieved. The response contains the correct quizzes, and the status is OK.
6. Handling Missing Quizzes for a Job: When a job posting exists but has no quizzes, this test confirms that the response status is NOT_FOUND, and the appropriate message is returned, ensuring proper error handling.
7. Retrieving a Specific Quiz: The test confirms that a specific quiz can be retrieved by providing a valid job ID and quiz ID. The response contains the correct quiz details, and the status is OK.
8. Ensures the handler returns a "Not Found" error when trying to retrieve a quiz that does not exist.
9. Submitting a Quiz and Calculating Score: A candidate submits quiz responses, and the test checks that the submission is recorded correctly, the score is calculated, and a CREATED response with the correct details is returned.
10. Handling Missing Candidate ID or Responses: This test ensures that if the candidate ID or responses are missing in the submission, the request is rejected with a BAD_REQUEST status and an appropriate error message.
11. Preventing Duplicate Quiz Submissions: The test verifies that a candidate cannot submit responses for the same quiz more than once. If a duplicate submission is attempted, a BAD_REQUEST response is returned with a relevant error message.
12. Retrieving Quiz Submissions: This test ensures that when a valid quiz ID is provided, all candidate submissions for that quiz are retrieved successfully, including usernames and scores, with a response status of OK.
13. Ensures the handler returns an empty array when a quiz has no submissions.
14. Handling No Quiz Submissions: If a quiz exists but has no submissions, this test confirms that the response is an empty array with a status of OK, ensuring the system properly handles cases where no candidates have taken the quiz yet.

##### Integration Tests

1. Create a job posting, create a quiz, and verify results: Tests the ability to create a job posting, add a quiz to it, and verify that the quiz is successfully stored in the database.
2. Create a job posting, create two quizzes, and get all quizzes for the specific job: Verifies that multiple quizzes can be created for a job and ensures they are correctly retrieved when fetching all quizzes for the job.
3. Create a job posting, create a quiz, get quizzes for the job, and get a specific quiz: Confirms that a specific quiz can be retrieved from a list of quizzes associated with a job.
4. Create a job posting, create a quiz, get quizzes for the job, get a specific quiz, and submit a response to the quiz: Ensures that a candidate can submit responses to a quiz and that the score is calculated correctly.
5. Create a job posting, create a quiz, get quizzes for the job, get a specific quiz, submit a response, and retrieve submissions: Validates that quiz submissions are stored and can be accessed by an employer.

##### Acceptance Tests
1. Quiz Creation and Association
    - An employer creates a quiz for a job posting using the quiz creation form.
    - The quiz is successfully linked to the job posting and a confirmation message is displayed.
2. Quiz Submission and Scoring
    - A candidate submits their responses to a quiz.
    - The system records the submission, calculates the score, and displays a success confirmation.
3. Duplicate Submission Prevention
    - A candidate attempts to submit responses for the same quiz more than once.
    - The system prevents the duplicate submission and displays an error message.
4. Quiz Retrieval and Display
    - When a valid job ID and quiz ID are provided, the correct quiz details and all associated submissions (with candidate names and scores) are retrieved and displayed.

#### 5. Recommendation Engine
##### Unit Tests

1. Check if updateUserDetails will update single preference correctly: test creates a user and updates one preference one time, checks that only that category has been set to 1, all others remain 0
2. Check if updateUserDetails will update multiple preferences correctly: test creates a user and updates multiple preferences once, checks that all correct preferences are 1, and incorrect are still 0
3. Check if updateUserDetails will update preference multiple times: creates a user and updates one preference multiple times, checks that preference stores the correct value and all others remain 0
4. Ensure updateUserDetails will not update negative preferences: creates a user and attempts to pass negative values, ensures no values are updated and no crash occurs
5. Ensure updateUserDetails will not update out of bounds preferences: creates a user and attempts to pass out of bound values, ensures no values are updated and no crash occurs
6. Ensure updateUserDetails will not update on char input: creates a user and attempts to pass chars instead of numbers, ensures no values are updated and no crash occurs
7. Ensure updateUserDetails will not update on String input: creates a user and attempts to pass strings instead of numbers, ensures no values are updated and no crash occurs
8. Ensure updateUserDetails will not update on null input: creates a user and attempts to pass null, ensures no values are updated and no crash occurs
9. Make sure user preferences are individual: creates multiple users, updates the preferences of one and makes sure that only that user was changed
10. See if multiple accounts can be updated in concert: creates multiple users and updates both of them multiple times, makes sure both accounts have correct preference values

##### Integration Tests
1. Check if sort behaves OK on single job: creates a single job and a single user with no preference updates. Calls api to get all jobs and passes user id, ensures that the status is 200, only one job is returned and that it is unchanged
2. Check if jobs get sorted correctly based on no preferences: creates multiple jobs and a single user with no preference updates. Calls api to get all jobs and passes user id, ensures that the status is 200, the correct number of jobs are returned and that they are sorted in ascending order by category
3. Check if jobs get sorted correctly based on existing preferences: creates multiple jobs and a single user with preference updates. Calls api to get all jobs and passes user id, ensures that the status is 200, the correct number of jobs are returned and that they are sorted according to the preferences of the user (which does not align with ascending category)

##### Acceptance Tests
1. Update Single and Multiple Preferences
    - A user updates one or more job preference values via the profile update form.
    - The updated preferences are correctly saved and reflected in the job recommendations.
2. Invalid Preference Handling
    - A user attempts to update preferences with invalid inputs (e.g., negative or non-numeric values).
    - The system rejects the update and displays an appropriate error message without crashing.
3. Individual and Concurrent Preference Updates
    - Multiple users update their preferences simultaneously.
    - Each user's recommendations update correctly and remain isolated from one another.

#### 6. Search Engine
##### Unit Tests
1. Verify that when no search parameter is provided, all job postings are returned with a status of OK and the returned array length matches the inserted data.
2. Verify that a search term matching the job title (e.g., "Senior") returns the corresponding job posting and a status of OK.
3. Verify that a search term matching the position title (e.g., "Developer") returns the correct postings and a status of OK.
4. Verify that a search term matching the description (e.g., "high quality") returns the appropriate job posting and a status of OK.
5. Verify that a search term matching the employer (e.g., "Tech") returns job postings from that employer and a status of OK.
6. Verify that a search term matching the location (e.g., "San Francisco") returns job postings located in that city and a status of OK.
7. Verify that a search term matching a skill (e.g., "React") returns the corresponding job posting and a status of OK.
8. Confirm that the search functionality is case-insensitive by ensuring that queries like "tech corp" match "Tech Corp" and return a status of OK.
9. Confirm that a non-matching search query (e.g., "nonexistent") returns an empty array and a status of OK.
10. Confirm that any valid search query (e.g., "Data") returns a response with a status of OK.

##### Acceptance Tests
1. Display All Job Postings
    - When the job listings page is loaded with an empty search field, all available job postings are displayed.
Instructions: 
2. Real-Time Search Filtering
    - As a candidate types a valid search term, the job listings update in real time to show only postings matching the term in the title, position, description, employer, location, or skills.
3. No Matching Results Message
    - When a candidate enters a search term that does not match any postings, the message "No available job that matches the search" is displayed.
4. Case-Insensitive Search
    - The candidate enters search queries in different cases (e.g., "tech corp" and "Tech Corp") and receives consistent results.
5. Clearing the Search Input
    - Clearing the search input restores the full list of job postings on the page.

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
