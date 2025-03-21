
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Category } from "../../../backend/src/common/Category";
import ApplicationPopupComponent from "../components/applicantPopup";
import FormModalPopupComponent from "../components/popup";
import useUser from "../hooks/user";
import {
  addResume,
  applyforJob,
  checkwhoApplied,

  editJobApplicationStatus,
  getAllQuizzesForJob,
  getIndividualJobPosting,
  getResumeName,
  getSavedJobs,
  saveJob,
  unsaveJob,
  updateUser
} from "../lib/api";

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");
  const { user, isLoading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState<FormData | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false); // New state for tracking application submission
  const [quizzes, setQuizzes] = useState<quizInterface[]>([]);
  const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job
  const [jobNotFound, setJobNotFound] = useState<boolean>(false); // Define the type for job
  const [appliedApplications, setAppliedApplications] = useState<
    SingleApplication[]
  >([]);

  //Below is dedicated to Candidate information
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSavedID, setIsSavedID] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<string>("");

  //Below is used for Employer
  const [showApplicantPopup, setShowApplicantPopup] = useState<boolean>(false);
  const [applicantIndex, setApplicantIndex] = useState<number>(0);
  //const [applicantData, setApplicantData] = useState<SingleApplication | null>(null);


  interface SingleApplication {
    _id: string;
    candidate_id: string;
    username: string;
    status: string;
    email: string;
    experience: string[];
    education: string[];
    skills: string[];
    resume_id: string;
  }
  interface JobPosting {
    _id: string;
    title: string;
    positionTitle: string;
    description: string;
    employer: string;
    employer_id: string;
    location: string;
    salary: number;
    jobType: string;
    experience: string[];
    skills: string[];
    education: string[];
    compensationType: string;
    datePosted: string;
    startDate: string;
    dueDate: string;
    status: string;
    category: number;
  }

  interface submissionInterface {
    candidateUsername: string;
    score: number;
  }

  interface quizInterface {
    _id: string;
    quizName: string;
    submissions: submissionInterface[];
    expanded: boolean;
  }

  const navigate = useNavigate();

  // Query to get job posting ----------------------------------------------------
  useEffect(() => {
    if (jobId !== undefined && jobId !== null) {
      console.log("Fetching the job post");
      fetchJobPosting(jobId);
      fetchQuizzes(jobId);
    } else {
      setJobNotFound(true);
    }
  }, [user, isApplied]);

  useEffect(() => {
    const queryForSavedJobs = async () => {
      if (user?.userRole === "Candidate" && jobId !== null) {
        try {
          console.log("Checking if job is saved");
          const response = await getSavedJobs(user._id, jobId);
          console.log(response);
          if(response !== null)
          {

            setIsSaved(true);
            setIsSavedID(response?._id);
          }
          console.log("Received job posting");
        } catch (error) {
          console.log("Error trying to geting saved jobs");
          console.log(error);
        }
      }
    };
    queryForSavedJobs();

  }, [user, isSaved]);

  // Query to get applications if Employer is viewing page ----------------------------------------------------
  useEffect(() => {
    const queryForApplications = async () => {
      if (user?.userRole == "Employer" && jobId !== null) {
        try {
          console.log("Fetching job applications for employer");
          const response = await checkwhoApplied({
            emp_id: user._id,
            job_id: jobId,
          });
          console.log(response)
          setAppliedApplications(response.applications);
          console.log("Received applications for job posting");
        } catch (error) {
          console.log("Error trying to get applications");
          console.log(error);
        }
      }
    };
    queryForApplications();
  }, [data]);

  // Send Application ----------------------------------------------------
  useEffect(() => {
    try {
      if (data && application && !isApplied) {
        const submitApplication = async () => {
          if (!application || !data) return;
          try {
            console.log("SENDING FILE");
            application.append("job_id", data._id);
            application.append("employer_id", data.employer_id);
            application.append(
              "candidate_id",
              user?._id || "unknown_candidate"
            );

            // Upload resume
            const resumeResponse = await addResume(application);
            console.log(resumeResponse.resume._id);

            // Apply for the job
            const applicationResponse = await applyforJob({
              job_id: data._id,
              employer_id: data.employer_id,
              candidate_id: user?._id || "unknown_candidate",
              resume_id: resumeResponse.resume._id,
              status: "Pending",
            });
            console.log(applicationResponse.data);

            setIsApplied(true);
            if(!isSaved){
              saveJobPosting();
            }
          } catch (error) {
            console.error("Error submitting application:", error);
          }
        };
        updateUser({
          experience: user?.experience || [],
          education: user?.education || [],
          skills: user?.skills || [],
          hiringDetails: user?.hiringDetails || [],
          companyDetails: user?.companyDetails || "",
          preference: data.category,
          phoneNumber: user?.phoneNumber || "",
          userlink: user?.userlink || ""
        });
        submitApplication();
      }
    } catch (error) {
      console.error("Error fetching job posting:", error);
    }
  }, [application, isApplied]);

  // Handler to submit form Makes sure the user applies for a job
  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setApplication(formData);
    setShowModal(false);
  };

  // Function to call when fetching jobs
  const fetchJobPosting = async (id: string) => {
    try {
      console.log(
        "Contacting Express server to get a job posting with id : " + id
      );
      
      const response = await getIndividualJobPosting(id, user?._id); // Wait for the promise to resolve
      console.log("successfully received job posting response");
      setJob(response.jobPosting);
      if(user?.userRole === "Candidate" && !jobNotFound && response.application)
      {
        setIsApplied(true);
        setApplicationStatus(response.application.status);
      }

    } catch (error: any) {
      if (error.status == 409) {
        console.log("Job posting could not be found!");
        setJobNotFound(true);
      } else {
        console.log("Unknown Error occurred when requesting job from server");
        console.error(error);
      }
    }
  };

  //Save Job Posting. For Save Button
  const saveJobPosting = async () => {
    if(isSaved)
    {
      console.log("Unsaving job");
      console.log(isSavedID);
      unsaveJob(isSavedID);
      setIsSaved(false);
    }
    else{
      if(user?._id && jobId)
      {
        saveJob({
          job_id: jobId,
          candidate_id: user._id
        });
        setIsSaved(true);
      }
    }
  }

  // View Applicant Handler
  const viewApplicantHandler = (index : number) => {
    setApplicantIndex(index);
    setShowApplicantPopup(true);
  }

  const changeApplicantStatusHandler = (newStatus: string) => {
    if(user?.userRole === "Employer" && appliedApplications[applicantIndex])
    {
      editJobApplicationStatus({id: appliedApplications[applicantIndex]._id, status: newStatus});
      setShowApplicantPopup(false);
      appliedApplications[applicantIndex].status = newStatus;
    }
  }

  const showResumeHandler = (resume_id:string) => {
    const showResume = async () => {
      const response = await getResumeName(resume_id);
      console.log(response);
      
      if(response !== null){
        window.open(import.meta.env.VITE_API_URL + `/resume/uploads/${response.file_name}`);
      }
    }
    showResume();
  
  }

  const viewResults = async (index: number) => {
    const newQuiz: quizInterface[] = [...quizzes];
    newQuiz[index].expanded = !newQuiz[index].expanded;
    setQuizzes(newQuiz);
  };

  // Function to call when fetching jobs
  const fetchQuizzes = async (id: string) => {
    try {
      console.log("Contacting Express server to get all quizzes for job post");
      const response = await getAllQuizzesForJob(id); // Wait for the promise to resolve
      console.log("successfully received quizzes");
      console.log(response);
      response.quizzes.expanded = false;
      setQuizzes(response.quizzes);
    } catch (error: any) {
      if (error.status == 409) {
        console.log("No quizzes for job posting could be found!");
      } else {
        console.log(
          "Unknown Error occurred when requesting quizzes from server"
        );
        console.error(error);
      }
    }
  };

  const takeQuizLink = (quizId: string) => {
    navigate(`/Take-Quiz?ID=${jobId}&quizId=${quizId}`);
  };

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (jobNotFound) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center p-5 bg-white rounded shadow">
          <h2 className="text-primary mb-4">Job posting could not be Found</h2>
          <p className="text-danger mb-4">
            A job post with that id could not be found!
          </p>
        </div>
      </div>
    );
  }

  const checkIfQuizTaken = (quiz: quizInterface) => {
    for (const submission of quiz.submissions)
      if (submission.candidateUsername === user.username) return true;

    return false;
  };

  const getScore = (quiz: quizInterface) => {
    for (const submission of quiz.submissions)
      if (submission.candidateUsername === user.username) 
        return submission.score;

    return "Could not find score";
  };

  const createQuizPage = (id: string | null) => {
    navigate(`/Create-Quiz-For-Job?ID=${id}`);
  };

  const DateToString = (time: string) => {
    if (time === "" || time === undefined) return "Not listed";
    else return time;
  };

  // This needs to be below and separate from the isLoading div
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
  <div className="pt-1">
    <div className="container mt-5">
      <div className="card mb-4 shadow">
        <h2 className="card-header bg-primary text-white">

          {user?.userRole === "Candidate" && (
            <span className={`badge bg-warning float-start`}>
              {applicationStatus}
            </span>
            )
          }

          {data.title}
         
          {user?.userRole === "Candidate" && (
            <button
              className="btn btn-primary float-end"
              style={{ backgroundColor: "#f8f9fa", color: "#0d6efd" }}
              onClick={saveJobPosting}
            >
              {isSaved ? "Unsave" : "Save"}
            </button>
            )
          }
            
        </h2>
        <div className="card-body">
          <h5 className="card-subtitle mb-3 text-muted">
            Job Position: {data.positionTitle}
          </h5>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Description</h5>
              <p className="card-text">{data.description}</p>
              
              </div>

            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p className="card-text">
                  <strong>Location:</strong> {data.location}
                </p>
                <p className="card-text">
                  <strong>Compensation Type:</strong> {data.compensationType}
                </p>
                {data.compensationType !== "do-not-disclose" && (
                  <p className="card-text">
                    <strong>Salary:</strong> ${data.salary}
                  </p>
                  )
                }
                <p className="card-text">
                  <strong>Job Type:</strong> {data.jobType}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <strong>Status:</strong> {data.status}
                </p>
                <p className="card-text">
                  <strong>Date Posted:</strong>{" "}
                  {new Date(data.datePosted).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Deadline:</strong>{" "}
                  {DateToString(data.dueDate)}
                </p>
                <p className="card-text">
                <strong>Starting Date For Job:</strong>{" "}
                {DateToString(data.startDate)}
              </p>

              <p className="card-text">
                <strong>Job Category:</strong> {Category[data.category]}
              </p>

              </div>

            </div>
            <div className="mb-3">
              <h6>Education:</h6>
              <ul className="list-group">
                {data.education.map((edu, index) => (
                  <li key={index} className="list-group-item">
                    {edu}
                  </li>
                  ))}
              </ul>
            </div>
            {user.userRole === "Candidate" && (
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                  disabled={isApplied} // Disable the button if already applied
                >
                  {isApplied ? "Applied" : "Apply"} {/* Change text */}
                </button>
              </div>
              )
            }
            <FormModalPopupComponent
              show={showModal}
              handleClose={() => setShowModal(false)}
              handleSubmit={submitHandler}
              title="Application Submitted"
              body="Fill out the following "
              submitText="Submit"
            >
              <div className="form-group">
                <label htmlFor="resume">Resume</label>
                <input
                  type="file"
                  className="form-control"
                  id="resume"
                  name="resume"
                  accept=".pdf , .docx"
                  required
                />
              </div>
            </FormModalPopupComponent>
          </div>
          {(user?.userRole == "Candidate" && quizzes.length > 0) && (
            <div className="mt-3">
              <h6> Available Quizzes!</h6>
              <div className="list-group">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{quiz.quizName}</span>
                    <span>
                      {checkIfQuizTaken(quiz)
                        ? `Score : ${getScore(quiz)} `
                        : ""}
                    </span>
                    <button
                      className={`btn ${
                        checkIfQuizTaken(quiz) ? "btn-secondary" : "btn-success"
                      }`}
                      onClick={() => takeQuizLink(quiz._id)}
                      disabled={checkIfQuizTaken(quiz)}
                    >
                      {`${checkIfQuizTaken(quiz) ? "Quiz Taken" : "Take Quiz"}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
          <FormModalPopupComponent
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleSubmit={submitHandler}
            title="Application Submitted"
            body="Fill out the following "
            submitText="Submit"
          >
            <div className="form-group">
              <label htmlFor="resume">Resume</label>
              <input
                type="file"
                className="form-control"
                id="resume"
                name="resume"
                accept=".pdf , .docx"
                required
              />
            </div>
          </FormModalPopupComponent>
        {user?.userRole == "Employer" && (
          <div className="container mt-3 ">
            <h3 className="mb-3 ">Quizz Section</h3>
            <h6>Existing Quizzes</h6>
            <div className="row justify-content-center">
              <div className="col-6">
                <div className="list-group width">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={quiz._id}
                      className="list-group-item d-flex flex-column"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{quiz.quizName}</span>
                        <span>Quiz submissions: {quiz.submissions.length}</span>
                        <button
                          className={`btn ${
                            quiz.expanded ? "btn-warning" : "btn-success"
                          }`}
                          onClick={() => viewResults(index)}
                        >
                          {quiz.expanded ? "Hide results ▲" : "View results ▼"}
                        </button>
                      </div>
                      {quiz.expanded && (
                        <div className="mt-3">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quiz.submissions.map((submission, subIndex) => (
                                <tr key={subIndex}>
                                  <td>{submission.candidateUsername}</td>
                                  <td>{submission.score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
            <button
              className="btn btn-primary mt-3 mb-3"
              onClick={() => createQuizPage(jobId)}
            >
              Create new Quiz for job Posting
            </button>
          </div>
        )}
      </div>
      {user?.userRole == "Employer" && (
        <div className="container mt-4">
          <h2 className="mb-4">Applications</h2>
          <p className="text-muted mt-4">
            You have <strong>{appliedApplications?.length}</strong> Applications
            to this job post!
          </p>
          <ul className="list-group">
            {appliedApplications?.map((application, index) => (
              <li key={index} className="list-group-item">
                <div 
                  className="d-flex justify-content-between align-items-center"
                  onClick = {() => viewApplicantHandler(index)}
                  style = {{cursor: "pointer"}}
                  >
                  <div>
                    <h5 className="mb-1">
                      User : <strong>{application.username}</strong>
                    </h5>
                  </div>
                  <div>
                   {"Status:  "}
                  <span className={`badge bg-success`} >
                    {application.status}
                  </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {
        user?.userRole == "Employer" && appliedApplications.length > 0 && (
          <ApplicationPopupComponent
            show={showApplicantPopup}
            username={appliedApplications[applicantIndex].username}
            email={appliedApplications[applicantIndex].email}
            experience={appliedApplications[applicantIndex].experience}
            education={appliedApplications[applicantIndex].education}
            skills={appliedApplications[applicantIndex].skills}
            resume_id={appliedApplications[applicantIndex].resume_id}
            editStatusApplicationHandler = {changeApplicantStatusHandler}
            onClose = {() => setShowApplicantPopup(false)}
            showResumeHandler = {showResumeHandler}
          >
          </ApplicationPopupComponent>
        )
      }
    </div>
    
  );
};

export default ViewJobPosting;
