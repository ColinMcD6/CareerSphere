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
1. **Successful Account Creation**
   - _Objective_: Verify that a new user can successfully register as a Candidate or Employer.
   - _Steps_:
       1. On the login page, click on “Need to create Account?”
       2. On the sign-up page, enter:
           - Username: `test1`
           - Email Address: `test1@gmail.com`
           - Password: `test1234`
           - Confirm Password: `test1234`
       3. Ensure the "Registering As" role is set to `Candidate` (default selected).
       4. Click on the Sign Up button.
   - _Expected Result_:
       - User sees a confirmation message for successful registration.
       - The interface redirects the user back to the login screen.
2. **Duplicate Account Prevention**
   - _Objective_: Ensure the system prevents duplicate registrations with the same email.
   - _Steps_:
       1. Perform Acceptance Test 1 to register with `test1@gmail.com`.
       2. Repeat the sign-up steps using the same email address `test1@gmail.com`.
   - _Expected Result_:
       - The user sees the error message: "Registration failed. Please try again."
       - Registration fails and the user remains on the sign-up page.
3. **Password Strength Feedback**
   - _Objective_: Ensure that users receive real-time feedback on weak passwords.
   - _Steps_:
       1. On the sign-up page, enter a password shorter than 8 characters (e.g., `test`).
       2. Attempt to submit the form.
   - _Expected Result_:
       - The Sign Up button remains disabled.
       - A warning appears below the password field: "Password must be at least 8 characters."
4. **Login Success**
   - _Objective_: Ensure users can log in with valid credentials.
   - _Steps_:
       1. Complete Acceptance Test 1.
       2. On the login screen, enter:
           - Email Address: `test1@gmail.com`
           - Password: `test1234`
       3. Click on the Log In button.
   - _Expected Result_:
       - User is redirected to the appropriate dashboard (Candidate or Employer).
       - A home screen is displayed with the website header.
5. **Login Error Handling**
   - _Objective_: Ensure that login fails gracefully with incorrect credentials.
   - _Steps_:
       1. On the login page, enter:
           - Email Address: `wrong@gmail.com`
           - Password: `test1234`
       3. Click on the Log In button.
   - _Expected Result_:
       - The system displays: "Invalid email or password. Please try again."
       - User remains on the login screen.
6. **Session Persistence**
   - _Objective_: Ensure that user session remains active after reopening the browser.
   - _Steps_:
       1. Log in successfully.
       2. Copy the site URL.
       3. Close the browser tab.
       4. Open a new tab and paste the copied URL.
   - _Expected Result_:
       - The system remembers the logged-in session.
       - User lands back on the home screen without needing to log in again.
7. **Logout Functionality**
   - _Objective_: Ensure logout works and redirects the user back to the login page.
   - _Steps_:
       1. Log in successfully.
       2. Click on the profile icon in the bottom left.
       3. Click the Log Out button.
   - _Expected Result_:
       - User is redirected to the login page.
       - A logout confirmation message is displayed.
8. **Security After Logout**
   - _Objective_: Ensure user cannot access restricted pages after logging out.
   - _Steps_:
       1. Perform `Acceptance Test 7`.
       2. Use the browser's back button.
   - _Expected Result_:
       - User remains on the login screen.
       - The home/dashboard page does not load without logging in again.

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
1. **Employer Dashboard and Role Access**
   - _Objective_: Ensure that Employers can access Employer-specific features and see “Edit Profile”.
   - _Steps_:
       1. Go to the login page and click “Need to create Account?”
       2. Enter the following details:
           - Username: `test2`
           - Email Address: `test2@gmail.com`
           - Password: `test1234`
           - Confirm Password: `test1234`
           - Set role: Employer (click the “Employer” radio button)
       3. Click Sign Up.
       4. On login page, log in with:
           - Email: `test2@gmail.com`
           - Password: `test1234`
       5. On home page, click the briefcase icon labeled “Jobs”.
   - _Expected Result_:
       - “My Job Postings” page is shown.
       - “+” button to create a job and search bar are visible.
       - “Edit Profile” option is accessible via bottom-left profile dropdown.
2. **Employer Profile Update**
   - _Objective_: Ensure Employers can successfully update and persist changes to their company profile.
   - _Steps_:
       1. Log in as an Employer using `test2@gmail.com` and password `test1234`.
       2. Click the profile icon in the bottom-left corner.
       3. Click Edit Profile.
       4. In the “Company Details” field, enter: `Located in New York`.
       5. Click the Save button.
       6. Return to the Edit Profile page.
   - _Expected Result_:
       - The updated company detail (`Located in New York`) appears in the field.
       - The change is saved and persisted across sessions.
3. **Post a New Job**
   - _Objective_: Ensure Employers can create a new job and view it in “My Job Postings” and public listings.
   - _Steps_:
       1. Log in as Employer `test2@gmail.com`.
       2. Click Jobs > “My Job Postings” page.
       3. Click on the `+` icon to add a new job.
       4. Fill in the job form fields:
           - Title of Job: `Frontend Developer`
           - Position Title: `Frontend Developer`
           - Description: A valid description over 50 characters.
           - Starting Date: Select a valid future date.
           - Due Date: Select a valid future date.
           - Compensation Type: `Salary`
           - Location: `Remote`
           - Education: e.g., `Bachelor’s Degree`
           - Skills: e.g., `React, CSS`
           - Employment Type: `Temporary`
           - Category: `Technology`
       5. Click Create Job Posting.
   - _Expected Result_:
       - A confirmation message indicates the job was successfully posted.
       - “Frontend Developer” appears in the employer’s list under “My Job Postings”.
4. **Track Applicants**
   - _Objective_: Ensure Employers can view candidates who applied and their submitted resumes.
   - _Steps_:
       1. Complete `Acceptance Test 3` to create a job.
       2. Log out and log in as a Candidate who will apply for the job.
       3. Go to “All Job Postings”, click View for “Frontend Developer”.
       4. Click Apply.
       5. Upload a PDF resume file and click Submit.
       6. Log out as Candidate and log back in as Employer `test2@gmail.com`.
       7. Go to “My Job Postings” > click View on “Frontend Developer”.
       8. Scroll to the Applicants section.
   - _Expected Result_:
       - Candidate test1 appears with application status as “Pending”.
       - Clicking View Details opens a modal with candidate's information.
       - Clicking View Resume opens or downloads the resume file.

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
1. **Candidate Dashboard and Role Access**
   - _Objective_: Ensure that Candidates can access Candidate-specific features and view job listings.
   - _Steps_:
       1. Go to the login page and click “Need to create Account?”.
       2. Enter the following details:
           - Username: `test1`
           - Email Address: `test1@gmail.com`
           - Password: `test1234`
           - Confirm Password: `test1234`
           - Leave role as `Candidate` (default selected).
       3. Click Sign Up.
       4. On login page, log in with:
           - Email: `test1@gmail.com`
           - Password: `test1234`
       5. On home page, click the suitcase icon labeled Jobs.
   - _Expected Result_:
       - “All Job Postings” page is displayed.
       - Search bar and “Show Saved Jobs” button are visible.
       - “Edit Profile” option is accessible via bottom-left profile dropdown.
2. **Update Candidate Profile Details**
   - _Objective_: Ensure Candidates can add and persist new skills or other profile details.
   - _Steps_:
       1. Log in as Candidate `test1@gmail.com`.
       2. Click the profile icon in the bottom-left corner.
       3. Click Edit Profile.
       4. In the User Skills section, click Add Skill.
       5. Enter the skill: `Software Engineering`.
       6. Click Save.
       7. Return to Edit Profile.
   - _Expected Result_:
       - Skill `Software Engineering` is displayed.
       - Profile update is saved and visible across sessions.
3. **View Job Details**
   - _Objective_: Ensure Candidates can open and view details of a specific job posting.
   - _Steps_:
       1. Log in as Candidate `test1@gmail.com`.
       2. Click Jobs.
       3. Click View beside the “Frontend Developer” job posting.
   - _Expected Result_:
       - Job details page opens.
       - Title, description, salary, location, and application buttons are visible.
4. **Resume Upload Success**
   - _Objective_: Ensure Candidates can upload and attach their resume during application.
   - _Steps_:
       1. Continue from `Acceptance Test 3`.
       2. Click Apply at the bottom of the job posting page.
       3. Upload a PDF resume file.
       4. Click Submit.
   - _Expected Result_:
       - Resume file is uploaded successfully.
       - Application confirmation message is displayed.
5. **Apply for a Job**
   - _Objective_: Ensure the Candidate can apply for a job and UI reflects application state.
   - _Steps_:
       1. Complete `Acceptance Test 4`.
   - _Expected Result_:
       - "Apply" button becomes `Applied`.
       - "Save" button changes to `Unsave` automatically.
       - Application status beside job title displays "Pending".
6. **View Application Status**
   - _Objective_: Ensure Candidate can see the status of submitted applications.
   - _Steps_:
       1. Log in as Candidate `test1@gmail.com`.
       2. Click Jobs, then click View on “Frontend Developer”.
       3. Observe status label in top-left of job window.
   - _Expected Result_:
       - Application status is shown as “Pending”, “Accepted”, or “Rejected” based on employer's review.

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
1. **Quiz Creation and Association**
   - _Objective_: Ensure that employers can create and associate a quiz with a job posting.
   - _Steps_:
       1. Log in as an Employer.
       2. On the home page, click the Jobs button.
       3. Click the View button beside any job you created (e.g., “Frontend Developer”).
       4. Scroll to the Quiz Management section.
       5. Click Create New Quiz.
       6. Enter `quiz` in the Quiz Name field.
       7. Enter `question` in the Question 1 field.
       8. Fill in four options uniquely: “correct”, “incorrect1”, “incorrect2”, “incorrect3”.
       9. Select the radio button beside “correct” as the correct answer.
       10. Click Create Quiz.
   - _Expected Result_:
       - Quiz creation is confirmed.
       - Quiz appears under “Existing Quizzes” for the job.
2. **Quiz Submission and Scoring**
   - _Objective_: Ensure Candidates can take a quiz and receive an appropriate score.
   - _Steps_:
       1. Log out the Employer account.
       2. Log in as a Candidate.
       3. Go to Jobs > click View beside “Frontend Developer”.
       4. Scroll to Available Quizzes.
       5. Click Take Quiz beside the quiz.
       6. Select one answer for each question.
       7. Click Submit Quiz Answers.
   - _Expected Result_:
       - Quiz submission is successful.
       - Score is displayed under quiz name.
       - “Take Quiz” button becomes disabled or changes to “Quiz Taken”.
3. **Duplicate Submission Prevention**
   - _Objective_: Ensure that Candidates cannot retake the same quiz.
   - _Steps_:
       1. Complete `Acceptance Test 2`.
       2. Return to the same job’s quiz section.
   - _Expected Result_:
       - The “Take Quiz” button is greyed out or changed to “Quiz Taken”.
       - Candidate cannot resubmit the same quiz.
4. **Quiz Retrieval and Result Display**
   - _Objective_: Ensure Employers can view quiz submissions and see scores per Candidate.
   - _Steps_:
       1. Log out of Candidate account.
       2. Log back in as Employer.
       3. Go to Jobs, click View beside “Frontend Developer”.
       4. In the Quiz Management section, locate the quiz.
       5. Click View Results.
   - _Expected Result_:
       - A list of Candidates who attempted the quiz is shown.
       - Each row shows Candidate username and score.
5. **Duplicate Answers in Quiz Question**
   - _Objective_: Ensure that all the multiple choice options to a quiz question are unique.
   - _Steps_:
       1. Log in as an Employer.
       2. On the home page, click the Jobs button.
       3. Click the View button beside any job you created (e.g., “Frontend Developer”).
       4. Scroll to the Quiz Management section.
       5. Click Create New Quiz.
       6. Enter `quiz` in the Quiz Name field.
       7. Enter `question` in the Question 1 field.
       8. Fill in four options: “correct”, “incorrect1”, “incorrect1”, “incorrect3”.
   - _Expected Result_:
       - Shows a warning message "Options must be unique".
       - Quiz creation is paused due to duplicate options to this quiz question.

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
1. **Neutral Recommendations Without Applications**
   - _Objective_: Verify that job listings are shown in their original order when the user has not submitted any applications.
   - _Steps_:
       1. Log in as an Employer.
       2. Create a job posting titled "Frontend Developer II" with category set to "Technology".
       3. Create another job posting titled "Test Job 2" with category set to "Engineering".
       4. Log out.
       5. Log in as a Candidate.
       6. Navigate to the Jobs page.
   - _Expected Result_:
       - The job listings should display “Frontend Developer II” above “Test Job 2” since the user has no submitted applications.
       - The order is neutral and unaffected by any preference logic.
2. **Increased Visibility of Preferred Job Types**
   - _Objective_: Ensure that applying to a job in a specific category increases its visibility in future searches.
   - _Steps_:
       1. Complete the previous test to confirm initial order.
       2. Apply to "Test Job 2" (category: Engineering):
           - Click View beside “Test Job 2”.
           - Click Apply.
           - Upload a resume (PDF or DOC file).
           - Click Submit.
       3. Return to the Jobs page.
   - _Expected Result_:
       - “Test Job 2” should now appear above “Frontend Developer II” in the listings.
       - Home page recommendations should also reflect the Engineering category.
3. **Dynamic Reordering Based on Application History**
   - _Objective_: Ensure job recommendations adapt dynamically as more applications are submitted.
   - _Steps_:
       1. Continue from the previous test.
       2. Apply to "Frontend Developer II":
           - Click View beside “Frontend Developer II”.
           - Click Apply.
           - Upload a resume (PDF or DOC file).
           - Click Submit.
       3. Return to the Jobs page.
   - _Expected Result_:
       - Job order may revert or shift based on total applications across categories.
       - The listing adapts to current application behavior, dynamically showing the most relevant jobs at the top.

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
1. **Display All Job Postings**
   - _Objective_: Ensure that all job postings are displayed when the search field is empty.
   - _Steps_:
       1. Log in as an Employer.
       2. Create a job posting titled "Backend Developer".
       3. Create another job posting titled "Test Job 3".
       4. Log out.
       5. Log in as a Candidate.
       6. Navigate to the Jobs page.
       7. Ensure the search bar is empty.
   - _Expected Result_:
       - Both “Backend Developer” and “Test Job 3” job postings are visible in the listings.
2. **Real-Time Search Filtering**
   - _Objective_: Confirm that typing in the search bar filters job postings in real-time.
   - _Steps_:
       1. Continue from the previous test or `Acceptance Test 1`.
       2. Ensure you are logged in as a Candidate and on the Jobs page.
       3. In the search bar, type the term “Back”.
   - _Expected Result_:
       - Only the “Backend Developer” job posting remains visible.
       - All non-matching jobs are hidden immediately as you type.
3. **No Matching Results Message**
   - _Objective_: Verify that an appropriate message appears when no jobs match the search term.
   - _Steps_:
       1. Continue from the previous test or `Acceptance Test 1`.
       2. Delete the word “Back” from the search bar or ensure the search bar is empty.
       3. Type “Incorrect” in the search bar ensuring that "Incorrect" phrase is not present in any job title, description, location, employer name or qualification.
   - _Expected Result_:
       - No job postings are displayed.
       - A message appears: “No available job that matches the search!".
4. **Case-Insensitive Search**
   - _Objective_: Confirm that the search is not case-sensitive.
   - _Steps_:
       1. Continue from the previous test or `Acceptance Test 1`.
       2. Clear the search bar or ensure the search bar is empty.
       3. Type “test job” (lowercase) into the search bar.
   - _Expected Result_:
       - “Test Job 3” is displayed in the results.
       - The result is the same as if typed in proper case (e.g., “Test Job”).
5. **Clearing the Search Input**
   - _Objective_: Validate that clearing the search input restores the full job listing view.
   - _Steps_:
       1. Continue from the previous test or `Acceptance Test 1`.
       2. After typing something, clear the search bar entirely.
   - _Expected Result_:
       - Both “Backend Developer” and “Test Job 3” are displayed again.
       - The job list resets to its default, full state.

### Non-functional Feature
- Implemented in later sprint (For load testing, when design the load, make sure at least twos request associated with
every core feature is inlcuded in the test load.)

### 2.2 Test Completeness
Below is the criteria for test completeness:
- 85% of the backend codebase should be covered by unit tests
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
