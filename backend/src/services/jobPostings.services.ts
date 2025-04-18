import { CONFLICT } from "../constants/http.constants";
import appAssert from "../utils/appAssert";
import jobPostingsDAO from "../repositories/jobPosting.repository";
import userDAO from "../repositories/user.repository";
import saveJobPostingDAO from "../repositories/saveJobPosting.repository"; 
import applicationDAO from "../repositories/application.repository";
import { 
    getAllJobPostingsAggregationRules 
} from "../repositories/customAggregateRules/customJobPostingRules.aggregate";


/** * Job Postings Service
 * @description - This service handles the business logic for job postings, including creating, retrieving, and managing job postings and applications.
 * * @param {any} data - The data to create a new job posting.
 * * @returns {Promise<JobPostingsDocument>} - Returns a promise that resolves to the created job posting document.
 * * @throws {Error} - Throws an error if the job posting creation fails or if the job posting does not exist.
*/
export const createJobPosting = async (data: any) => {
    // Pass the entire `data` object to Mongoose's `create` method
    const jobPosting = await jobPostingsDAO.create(data);
    return jobPosting;
};


/**
 * * Get Job Posting and Application
 * * @description - This function retrieves a job posting and its associated application for a specific candidate.
 * * @param {string} id - The ID of the job posting.
 * * @param {any} candidateId - The ID of the candidate.
 * * @returns {Promise<{ jobPosting: JobPostingsDocument; application: any }>} - Returns a promise that resolves to an object containing the job posting and application.
 * * @throws {Error} - Throws an error if the job posting does not exist or if the application does not exist.
 */
export const getJobPostingAndApplication = async (id: string, candidateId: any) => {
    const jobPosting = await getJobPosting(id);
    const application = await getApplication(id, candidateId);
    return {
        jobPosting: jobPosting,
        application: application
    };
}

/**
 * * Get Job Posting
 * * @description - This function retrieves a job posting by its ID.
 * * @param {string} id - The ID of the job posting.
 * * @returns {Promise<JobPostingsDocument>} - Returns a promise that resolves to the job posting document.
 * * @throws {Error} - Throws an error if the job posting does not exist.
 */
export const getJobPosting = async (id: string) => {
    const jobPosting = await jobPostingsDAO.findById(id);
    if (!jobPosting)
        appAssert(false, CONFLICT, "Job Posting does not exist, invalid ID!"); // This will throw an error, and return a 409 response
    
    return jobPosting;
}



/** NOT BEING USED (Saved for situational use)
 * * Get All Job Postings
 * * @description - This function retrieves all job postings with pagination.
 * * @param {number} page - The page number for pagination.
 * * @param {number} limit - The number of job postings to retrieve per page.
 * * @returns {Promise<{ jobPostings: JobPostingsDocument[]; total: number; page: number; pages: number }>} - Returns a promise that resolves to an object containing the job postings and pagination information.
 */
export const getAllJobPostings = async (page: number, limit: number) => {
    return await getAllJobPostingsQuery({},page, limit);
};


/** NOT BEING USED (Saved for situational use)
 * * Get All Job Postings with Query
 * * @description - This function retrieves all job postings based on a query with pagination.
 * * @param {any} query - The query object to filter job postings.
 * * @param {number} page - The page number for pagination.
 * * @param {number} limit - The number of job postings to retrieve per page.
 * * @returns {Promise<{ jobPostings: JobPostingsDocument[]; total: number; page: number; pages: number }>} - Returns a promise that resolves to an object containing the job postings and pagination information.
 */
export const getAllJobPostingsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const jobPostings = await jobPostingsDAO.find(query, page, limit);

    const total = await jobPostingsDAO.countJobs();
    const pages = Math.ceil(total / limit);

    return {
        jobPostings,
        total,
        page: page <= pages ? page : pages,
        pages: pages,
    };
};



/** BEING USED
 * * Get All Job Postings with Query and Saved Status
 * * @description - This function retrieves all job postings based on a query with pagination and saved status.
 * * @param {any} query - The query object to filter job postings.
 * * @param {number} page - The page number for pagination.
 * * @param {number} limit - The number of job postings to retrieve per page.
 * * @param {any} savedPostingCandidateId - The ID of the candidate who saved the job posting.
 * * @param {any} userId - The ID of the user.
 * * @returns {Promise<{ jobPostings: JobPostingsDocument[]; total: number; page: number; pages: number }>} - Returns a promise that resolves to an object containing the job postings and pagination information.
 */
export const getAllJobPostingsQueryWithSaved = async (
    query: any,
    page: number,
    limit: number,
    savedPostingCandidateId: any,
    userId: any
) => {

    

    const jobPostings = await getAllJobPostingsAggregationRules(
        query,
        page,
        limit,
        savedPostingCandidateId
    );


    let output: any[] = [];

    //organize
    if(userId){
        const user = await userDAO.findById(userId)
        const preferences = user?.preferences;
        
        if(preferences){
            let jobDisplay: any[][] = [];
            let order = Array.from(preferences.keys()).sort((a, b) => preferences[b]- preferences[a]);
            

            //initialize the jobDisplay array with empty arrays for each preference
            for(var i = 0; i < preferences.length; i++){
                jobDisplay[i] = [];
            }
            //parse the job postings and push them into the corresponding category in jobDisplay
            for(var i = 0; i < jobPostings.length; i++)
            {
                let parseJob: any = jobPostings[i];
                jobDisplay[parseJob.category].push(parseJob);
            }

            //desending order for the job postings
            for(var i = 0; i < jobDisplay.length; i++){
                jobDisplay[i].sort((a: any, b: any) => b.applicationCount - a.applicationCount);
            }

            //push the job postings into the output array in the order of the preferences
            for(var i = 0; i < order.length; i++){
                for(var j = 0; j < jobDisplay[order[i]].length; j++){
                    output.push(jobDisplay[order[i]][j]);
                }
                
            }
        }
        else{
            output = jobPostings;
        }
    }
    else{
        output = jobPostings;
    }
    
    const total = jobPostings.length;
    const pages = Math.ceil(total / limit);


    return {
        jobPostings: output,
        total,
        page: page <= pages ? page : pages,
        pages: pages,
    };
};


// SAVING JOBS ----------------------------------------------

/**
 * * Save Job Posting
 * * @description - This function saves a job posting for a candidate.
 * * @param {any} data - The data to save the job posting.
 * * @returns {Promise<any>} - Returns a promise that resolves to the saved job posting document.
 * * @throws {Error} - Throws an error if the job posting does not exist.
 * */
export const saveJobPosting = async (data: any) => {
    const savedJobPosting = await saveJobPostingDAO.create(data);
    return savedJobPosting;
}


/**
 * * Unsave Job Posting
 * * @description - This function unsaves a job posting for a candidate.
 * * @param {any} id - The ID of the saved job posting to unsave.
 * * @returns {Promise<any>} - Returns a promise that resolves to the unsaved job posting document.
 * * @throws {Error} - Throws an error if the job posting does not exist.
 */
export const unsaveJobPosting = async (id: any) => {
    const savedJobPosting = await saveJobPostingDAO.findByIdAndDelete(id);
    return savedJobPosting;
}


/**
 * * Get Saved Job Postings
 * * @description - This function retrieves a saved job posting for a candidate.
 * * @param {any} candidateId - The ID of the candidate.
 * * @param {any} jobId - The ID of the job posting.
 * * @returns {Promise<any>} - Returns a promise that resolves to the saved job posting document.
 * * @throws {Error} - Throws an error if the job posting does not exist.
 */
export const getSavedJobPostings = async (candidateId: any, jobId: any) => {
    console.log(candidateId, jobId);
    const savedJobPosting = await saveJobPostingDAO.findOne(
        { 
            candidateId: candidateId,
            jobId: jobId
        });
    return savedJobPosting;
}

//APPLICATIONS----------------------------------------------


/**
 * * Add Job Posting Application
 * * @description - This function adds a job posting application for a candidate.
 * * @param {any} data - The data to create a new job application.
 * * @returns {Promise<{ jobApplication: any }>} - Returns a promise that resolves to an object containing the created job application document.
 */
export const addJobPostingApplication = async (data: any) => {
    const jobApplication = await applicationDAO.create(data);
    return {
        jobApplication: jobApplication,
    };
};



/**
 * * Edit Job Posting Application Status
 * * @description - This function updates the status of a job posting application.
 * * @param {any} id - The ID of the job application to update.
 * * @param {any} status - The new status to set for the job application.
 * * @returns {Promise<any>} - Returns a promise that resolves to the updated job application document.
 * * @throws {Error} - Throws an error if the job application does not exist.
 */
export const editJobPostingApplicationStatus = async (id: any, status: any) => {
    const jobApplication = await applicationDAO.findByIdAndUpdate(id, { status: status }, { new: true });
    return jobApplication;

};



/**
 * * Edit Job Posting Application
 * * @description - This function updates a job posting application for a candidate.
 * * @param {any} id - The ID of the job application to update.
 * * @param {any} data - The new data to set for the job application.
 * * @returns {Promise<any>} - Returns a promise that resolves to the updated job application document.
 * * @throws {Error} - Throws an error if the job application does not exist.
 */
export const deleteJobPostingApplication = async (id: any) => {
    const jobPosting = await applicationDAO.findByIdAndDelete(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};


/**
 * * Get Job Posting Application
 * * @description - This function retrieves a job posting application for a candidate.
 * * @param {string} id - The ID of the job posting.
 * * @param {any} candidateId - The ID of the candidate.
 * * @returns {Promise<any>} - Returns a promise that resolves to the job application document.
 * * @throws {Error} - Throws an error if the job application does not exist.
 */
export const getApplication = async (id: string, candidateId: any) => {
    const application = await applicationDAO.findOne({
        jobId: id,
        candidateId: candidateId,
    });
    return application;
}



/**
 * * Get Job Posting Applications
 * * @description - This function retrieves a job posting application by its ID.
 * * @param {any} id - The ID of the job posting application.
 * * @returns {Promise<any>} - Returns a promise that resolves to the job application document.
 * * @throws {Error} - Throws an error if the job application does not exist.
 */
export const getJobPostingApplications = async (id: any) => {
    const jobPosting = await applicationDAO.findById(id);
    appAssert(jobPosting, CONFLICT, "Application does not exist!");
    return jobPosting;
};



/**
 * * Get Job Posting Applications with Query
 * * @description - This function retrieves all job posting applications based on a query with pagination.
 * * @param {any} query - The query object to filter job applications.
 * * @param {number} page - The page number for pagination.
 * * @param {number} limit - The number of job applications to retrieve per page.
 * * @returns {Promise<{ applications: any[]; total: number; page: number; pages: number }>} - Returns a promise that resolves to an object containing the job applications and pagination information.
 */
export const getJobPostingApplicationsQuery = async (
    query: any,
    page: number,
    limit: number
) => {
    const applications = await applicationDAO.find(query)

    const total = await applicationDAO.countDocuments(query);

    // The following code attaches the username to the applications
    const applicationsWithUser = await Promise.all(
        applications.map(async (application) => {
            const user = await userDAO.findOne({
                _id: application.candidateId,
            });
            return {
                ...application.toObject(),
                username: user ? user.username : null,
                email: user ? user.email : null,
                experience: user ? user.experience : null,
                education: user ? user.education : null,
                skills: user ? user.skills : null,
            };
        })
    );
    return {
        applications: applicationsWithUser,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};
