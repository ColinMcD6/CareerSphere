# Test Plan for Career Sphere
## Changelog
| Version | Change Date | By             | Description              |
|---------|-------------|----------------|--------------------------|
| 1.0     |Feb 23, 2025 | Colin McDonell | Create initial test plan |

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
- placeholder (we need 10)
- placeholder (we need 10)
- placeholder (we need 10)
- placeholder (we need 10)

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
- Placeholder

#### 2. Employer Portal
##### Unit Tests
1. Update hiring details section of Employer profile
2. Update company details section of Employer profile
3. Retreive Employer information based on UserID
4. Retreiving Employer information with UserID that does not exist throws an error
- placeholder (we need 10)
- placeholder (we need 10)

##### Integration Tests
Will be implemented in Sprint 3

##### Acceptance Tests
- Placeholder

#### 3. Candidate Portal
##### Unit Tests
1. Update education section of Candidate profile
2. Update skill section of Candidate profile
3. Update experience section of Candidate profile
4. Retrieve Candidate information based on UserID
5. Attempt to update a Candidate profile that does not exist
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