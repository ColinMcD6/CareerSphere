import API from "../config/apiClient.config";

interface UserResponse {
  username: string;
  email: string;
  _id: string;
  userRole: string;
  experience: string[];
  education: string[];
  skills: string[];
  hiringDetails: string[];
  companyDetails: string;
  preferences: number[];
  phoneNumber: string;
  userlink: string;

}

export const getUser = async (): Promise<UserResponse> =>
  API.get("/user");

export const updateUser = async(data: {
  experience: string[],
  education: string[],
  skills: string[],
  hiringDetails: string[],
  companyDetails: string,

  preference: number
  phoneNumber: string,
  userlink: string,

}) => 
  API.put("/user/update", data);

export const checklogIn = async (data: { email: string, password: string }) => 
  API.post("/auth/login", data)

export const registerUser = async (data: {
  email: string, 
  username: string, 
  user_role: string, 
  password: string,
  confirm_password: string
}) => 
  API.post("/auth/signup", data)

export const logoutUser = async()=> 
  API.get("/auth/logout")

export const verifyEmail = async(code: string) => 
  API.get(`/auth/email/verify/${code}`)

export const sendresetPassEmail = async(data: {
  email: string
}) =>
  API.post("/auth/password/forgot", data)

export const changePassword = async(data: { verifycode: string, password: string }) =>
  API.post("/auth/password/reset", data)

export const createJobPosting = async (data : any ) => 
  API.post("/job/add", data)

interface JobPostingResponse {
  jobPostings: [];
}

interface ResumeResponse {
  resume: {
    _id: string
  };
}

interface ResumeResponse2 {
  pdf_name: string;
  file_name: string;
}

interface ApplicationsResponse {
  applications : [];
}

export const getAllJobPostings = async(query : string) : Promise<JobPostingResponse> => 
  API.get(`/job${query}`)

export const getIndividualJobPosting = async( id : string, candidate_id: any ) : Promise<any> => 
  API.get(`/job/${id}?candidate_id=${candidate_id}`)

export const addResume = async(application: any) : Promise<ResumeResponse> =>
  API.post("/resume/add", application)

export const getResumeName = async(id: string) : Promise<ResumeResponse2> =>
  API.get(`/resume/${id}`)

export const applyforJob = async(data: any) =>
  API.post("/job/applications/apply", data)

export const checkwhoApplied = async(data: { emp_id: string, job_id: string}) : Promise <ApplicationsResponse>=> 
  API.get(`/job/applications/all/query?employer_id=${data.emp_id}&job_id=${data.job_id}`)


export const editJobApplicationStatus = async(data: { id: string, status: string}) =>
  API.put(`/job/applications/edit/${data.id}`, data)


interface SavedJobsResponse {
  _id: string;
  job_id: string;
  candidate_id: string;
}

export const saveJob = async(data: { job_id: string, candidate_id: string}) : Promise<any> =>
  API.post("/job/save", data)

export const unsaveJob = async(id: string) =>
  API.delete(`/job/save/${id}`)

export const getSavedJobs = async(candidate_id: string, job_id: string): Promise<SavedJobsResponse> => 
  API.get(`/job/save/query?candidate_id=${candidate_id}&job_id=${job_id}`)

export const createQuizForJobPosting = async( data: { jobId: string, body: {}}) : Promise <any>=> 
  API.post(`job/${data.jobId}/quizzes`, data.body)

export const getAllQuizzesForJob = async( jobId : string) : Promise <any>=> 
  API.get(`job/${jobId}/quizzes`)

export const getSpecificQuiz = async(  data: { jobId: string, quizId: string}) : Promise <any>=> 
  API.get(`job/${data.jobId}/quizzes/${data.quizId}`)

export const submitQuizResponse = async(  data: { jobId: string, quizId: string, body: {}}) : Promise <any>=> 
  API.post(`job/${data.jobId}/quizzes/${data.quizId}/submissions`, data.body)

export const fetchQuizResults = async(  data: { jobId: string, quizId: string}) : Promise <any>=> 
  API.get(`job/${data.jobId}/quizzes/${data.quizId}/submissions`)

