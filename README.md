## Career Sphere 
User Friendly Career Platform that connects job seekers and employers through features like personalized job recommendations, dynamic search tools, and real-time communication. Job seekers can manage profiles, apply for jobs, and showcase skills, while employers can post listings, evaluate candidates, and host live quizzes. With forums, messaging, and interview scheduling, the platform fosters collaboration and efficient hiring processes.

## Team Members

| Name  | GitHub Username | Email |
| ------------- | ------------- |:-------------:|
|Sudipta Dip| sudipta2621 | dips@myumanitoba.ca
|Sukhmeet Singh Hora| sukhmeet468 | horass@myumanitoba.ca
|Colin McDonell| ColinMcD6 | mcdonelc@myumanitoba.ca
|Ethan Lapkin| EthanLapkin | lapkine@myumanitoba.ca
|AJ Manigque| ThreshvsGaming | manigqua@myumanitoba.ca
|Bryce Erichsen| Bry-er | erichseb@myumanitoba.ca

## Vision Statement 

Our vision is to create a transformative career ecosystem that seamlessly connects job seekers and employers, empowering them to achieve their professional goals. We aim to provide an intuitive and user-friendly platform where candidates can effectively showcase their skills and connect with employers through personalized job recommendations, advanced search functionalities, and collaborative networking tools. By offering employers a robust system for posting jobs, evaluating candidates through live events, and managing application workflows, we ensure the identification of top talent. Our success criteria is measured by achieving a milestone of 1,000 user signups and 100 job postings per month, demonstrating the platform's effectiveness and widespread adoption. 

## Project Summary 

We seek to streamline the process of job searching, as well as promote a sense of agency and connection for those involved. With features such as customizable account details, dynamic candidate and employer portals, a responsive set of search and recommendation engines, real-time notifications, interactive forums and live quizzing, our platform fosters transparent communication, professional growth and efficient hiring processes. This vision is valuable to professors, teaching assistants, our team, employers, and candidates alike, as it provides employers with efficient hiring tools and job seekers with personalized opportunities. 

## Stakeholders 

* Client (TA) - Provides guidance, requirements elicitation to ensure the platform aligns with user needs and project goals and evaluate the requirements. 

* Employers - Provided with tools to post jobs, access candidates, manage applications, and conduct live quizzes for efficient hiring. 

* Candidates - Provided with tools to showcase their skills, view job opportunities, apply for positions, get recommendations for similar jobs and employer profiles, search for jobs or employers, participate in live quizzing events, engage on forums and message other candidates or employers. 

 

## Main Features 

### Account Management 

* Users should be able to sign up for the website as either an employer or a candidate, login, and then manage their profile information 

### Employer/Candidate Portal 

* Employers will be able to create new job listings. Candidates will be able to view the jobs listings, bookmark or save them, and apply for the job. * Employers will be to see the applications to their job listing. 

### Search engine 

* Both employees and candidates will be able to use basic search features on the website. Candidates will be able to search for an employer by name, and for a certain type of job position Employers can search for candidates by skillset, and by past applications. 

### Recommendation engine 

* A candidate should be shown relevant job positions that the candidate is qualified for. 

### Notifications 

* Candidates will receive notifications about their applications and receive alerts for new job postings that may interest them 

### Interview scheduling 
* Employers will be able to send a candidate a list of potential times and locations for an interview, and the candidate can accept or reject one of those proposals. 

### Live Quizzing event 

* Employers will be able to create a real time quiz that is tailored made for the specific skillset that they are searching for. Candidates can join the quiz, and the candidates' end scores or submissions are sent to the employer. 

### Messaging 

* Users of the website will be able to privately message each other and have a saved log of those messages. 

### Forum 
* Candidates will publicly be able to ask questions on a job posting, and the employers will be able to respond to those questions. 

### Non-Functional feature 

* 150 users will be able to concurrently use our website, and at least 30 people will be able to participate in a live quiz 

## Technologies 

* React - Front-end framework 

* Node.js - JavaScript run-time environment 

* Express.js - back-end framework API 

* MongoDB – Document-based database to store persistent data 

### Other technologies 

* Docker 

* GitHub Actions 

* Bootstrap

### Architecture Diagram

[Architecture_Diagram](https://github.com/ColinMcD6/CareerSphere/blob/documentation/documentation/COMP4350_CareerSphere_ArchitechtureDiagram.png)

## User Stories 

**Account Management**

* As a user, I want to sign up and log in to the website so that I can access and use it to find jobs, or to find candidates. 

* As a candidate, I want to be able to edit and update my personal information like my skills, education and work experience so that I can present myself effectively to employers. 

* As an employer, I want to describe my company, so that candidates are attracted to apply to my company 

**Employer/Candidate Portal** 

Candidates can apply for jobs 

* As a candidate, I should be able to view job postings so that I can be informed about the available jobs. 

* As a candidate, I should be able to apply to a job listing so that the employer knows that I want the position. 

* As a candidate, I should be able to see the status of my application so that I know if I have been accepted or rejected. 

* As a candidate, I should be able to save a job posting so that I can quickly view it later. 

Employers can post jobs 

* As an employer, I should be able to post a job posting that is visible to candidates so that they can find the post and apply to it if interested. 

* As an employer, I should be able to track and access candidates who have applied so that I can quickly select the best candidates for interviews. 

**Search engine**

* As a candidate, I should be able to search for job posting only for my preferred positions so that I can see only positions that I am interested in. 

* As a candidate, I should be able to search for a specific employer by typing a partial name so that I can quickly find the employer I am looking for. 

* As an employer, I should be able to search for job seekers who have my preferred skillset so that I can find a candidate who is qualified for the job. 

* As an employer, I should be able to filter job seekers who have previously applied to my posted jobs so that I can target candidates who are interested in working for me.  

**Recommendation engine**

* As a candidate, I should be recommended job postings that fit my skills so that I can apply to jobs that match my skillset.  

* As a candidate, I should be recommended job postings like the jobs that I have applied for so that I can apply for similar jobs. 

* As a user, I want to be recommended to other users with similar interests or backgrounds, so that I can connect and build a professional network. 

**Notifications**

* As a user, I should be able to get alerts for new job posting in areas I am interested in so that I do not miss an opportunity. 

* As a user, I should be able to get alerts on my application updates or messages so that I track the status of my job application. 

**Interview scheduling**

* As an employer, I should be able to propose an interview time with a candidate so that I can interview them when we are both available. 

* As a candidate I should be able to accept or reject one of the proposed interview times so that I can arrange a meeting that works for both me and the employer. 

**Forum**

* As a candidate, I want to publicly ask questions about a job posting, so that I and other job seekers can get clarifications and make informed decisions. 

* As an employer, I should be able to respond to the questions posted about my job so that my job position information is well communicated. 

**Live Quizzing event**

* As an employer, I want to be able to create custom live quizzes so that I can evaluate candidates based on the skillset I am looking for. 

* As an employer, I want to be able to post quiz events on job postings so that candidates know about them. 

* As an employer, I want to see results and ranking of users on a leaderboard so I can identify the qualified candidates. 

* As a candidate I want to be able to join and participate in a quiz so I can demonstrate my skills and knowledge for a job position that I want. 

**Messaging**

* As a user, I want to be able to message (chat) other users so that I can communicate with fellow job seekers and employers. 
