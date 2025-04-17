import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Category } from "./createJobPost.pages";
import ApplicationPopupComponent from "../components/applicantPopup.components";
import FormModalPopupComponent from "../components/popup";
import useUser from "../hooks/user.hooks";
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
  updateUser,
} from "../lib/api.lib";

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");

  const { user, isLoading } = useUser();

  const [quizzes, setQuizzes] = useState<quizInterface[]>([]);
  const [data, setJob] = useState<JobPosting | null>(null);
  const [jobNotFound, setJobNotFound] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSavedID, setIsSavedID] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState<FormData | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  const [showApplicantPopup, setShowApplicantPopup] = useState<boolean>(false);
  const [applicantIndex, setApplicantIndex] = useState<number>(0);
  const [appliedApplications, setAppliedApplications] = useState<
    SingleApplication[]
  >([]);

  interface SingleApplication {
    _id: string;
    candidateId: string;
    username: string;
    status: string;
    email: string;
    experience: string[];
    education: string[];
    skills: string[];
    resumeId: string;
  }
  interface JobPosting {
    _id: string;
    title: string;
    positionTitle: string;
    description: string;
    employer: string;
    employerId: string;
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
          if (response !== null) {
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

  useEffect(() => {
    const queryForApplications = async () => {
      if (user?.userRole == "Employer" && jobId !== null) {
        try {
          console.log("Fetching job applications for employer");
          const response = await checkwhoApplied({
            emp_id: user._id,
            jobId: jobId,
          });
          console.log(response);
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

  useEffect(() => {
    try {
      if (data && application && !isApplied) {
        const submitApplication = async () => {
          if (!application || !data) return;
          try {
            console.log("SENDING FILE");
            application.append("jobId", data._id);
            application.append("employerId", data.employerId);
            application.append(
              "candidateId",
              user?._id || "unknown_candidate"
            );

            const resumeResponse = await addResume(application);
            console.log(resumeResponse.resume._id);

            const applicationResponse = await applyforJob({
              jobId: data._id,
              employerId: data.employerId,
              candidateId: user?._id || "unknown_candidate",
              resumeId: resumeResponse.resume._id,
              status: "Pending",
            });
            console.log(applicationResponse.data);

            setIsApplied(true);
            if (!isSaved) {
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
          userlink: user?.userlink || "",
        });
        submitApplication();
      }
    } catch (error) {
      console.error("Error fetching job posting:", error);
    }
  }, [application, isApplied]);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setApplication(formData);
    setShowModal(false);
  };

  const fetchJobPosting = async (id: string) => {
    try {
      console.log(
        "Contacting Express server to get a job posting with id : " + id
      );

      const response = await getIndividualJobPosting(id, user?._id);
      console.log("successfully received job posting response");
      setJob(response.jobPosting);
      if (
        user?.userRole === "Candidate" &&
        !jobNotFound &&
        response.application
      ) {
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

  const saveJobPosting = async () => {
    if (isSaved) {
      console.log("Unsaving job");
      console.log(isSavedID);
      unsaveJob(isSavedID);
      setIsSaved(false);
    } else {
      if (user?._id && jobId) {
        saveJob({
          jobId: jobId,
          candidateId: user._id,
        });
        setIsSaved(true);
      }
    }
  };

  const viewApplicantHandler = (index: number) => {
    setApplicantIndex(index);
    setShowApplicantPopup(true);
  };

  const changeApplicantStatusHandler = (newStatus: string) => {
    if (
      user?.userRole === "Employer" &&
      appliedApplications[applicantIndex]
    ) {
      editJobApplicationStatus({
        id: appliedApplications[applicantIndex]._id,
        status: newStatus,
      });
      setShowApplicantPopup(false);
      appliedApplications[applicantIndex].status = newStatus;
    }
  };

  const showResumeHandler = (resumeId: string) => {
    const showResume = async () => {
      const response = await getResumeName(resumeId);
      console.log(response);

      if (response !== null) {
        window.open(
          import.meta.env.VITE_API_URL + `/resume/uploads/${response.fileName}`
        );
      }
    };
    showResume();
  };

  const viewResults = async (index: number) => {
    const newQuiz: quizInterface[] = [...quizzes];
    newQuiz[index].expanded = !newQuiz[index].expanded;
    setQuizzes(newQuiz);
  };

  const fetchQuizzes = async (id: string) => {
    try {
      console.log("Contacting Express server to get all quizzes for job post");
      const response = await getAllQuizzesForJob(id);
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

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (jobNotFound) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h2 className="text-danger">Job Not Found</h2>
          <p>The job posting you are looking for does not exist.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/view-all-jobs")}
          >
            Back to Jobs
          </button>
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-4 shadow">
        <h2 className="card-header" style={{ backgroundColor: "#0056b3", color: "white" }}>
          {user?.userRole === "Candidate" && (
            <span
              className={`badge float-start bg-${
                applicationStatus === "Accepted"
                  ? "success"
                  : applicationStatus === "Rejected"
                  ? "danger"
                  : "warning"
              }`}
              style={{
                backgroundColor:
                  applicationStatus === "Accepted"
                    ? "#28a745"
                    : applicationStatus === "Rejected"
                    ? "#dc3545"
                    : "#ffc107",
                color: "white",
              }}
            >
              {applicationStatus}
            </span>
          )}
          {data.title}
          {user?.userRole === "Candidate" && (
            <button
              className="btn btn-light float-end"
              style={{
                color: isSaved ? "#dc3545" : "#0056b3",
                border: "1px solid #ced4da",
              }}
              onClick={saveJobPosting}
            >
              <i
                className={`bi ${
                  isSaved ? "bi-bookmark-fill" : "bi-bookmark"
                } me-2`}
              ></i>
              {isSaved ? "Unsave" : "Save"}
            </button>
          )}
        </h2>
        <div className="card-body">
          <h5 className="card-subtitle mb-3 text-muted">
            Job Position: {data.positionTitle}
          </h5>
          <div className="card mb-3" style={{ backgroundColor: "#e9ecef" }}>
            <div className="card-body">
              <h5 className="card-title text-dark">Description</h5>
              <p className="card-text text-muted">{data.description}</p>
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
              )}
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
                <strong>Deadline:</strong> {DateToString(data.dueDate)}
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
            <h6 className="text-dark">Education:</h6>
            <ul className="list-group">
              {data.education.map((edu, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  {edu}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <h6 className="text-dark">Skills:</h6>
            <ul className="list-group">
              {data.skills.map((edu, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
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
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply"}
              </button>
              <FormModalPopupComponent
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSubmit={submitHandler}
                title="Application Submitted"
                body="Fill out the following"
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
          )}
          {user?.userRole === "Candidate" && quizzes.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-3">Available Quizzes</h4>
              <div className="list-group">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-1">{quiz.quizName}</h6>
                      {checkIfQuizTaken(quiz) && (
                        <small className="text-success">
                          Score: {getScore(quiz)}
                        </small>
                      )}
                    </div>
                    <button
                      className={`btn ${
                        checkIfQuizTaken(quiz)
                          ? "btn-secondary"
                          : "btn-success"
                      }`}
                      onClick={() => takeQuizLink(quiz._id)}
                      disabled={checkIfQuizTaken(quiz)}
                    >
                      {checkIfQuizTaken(quiz) ? "Quiz Taken" : "Take Quiz"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {user?.userRole === "Employer" && (
            <div className="mt-4">
              <h4 className="mb-3">Quiz Management</h4>
              <div className="list-group">
                {quizzes.map((quiz, index) => (
                  <div key={quiz._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{quiz.quizName}</h6>
                        <small className="text-muted">
                          Submissions: {quiz.submissions.length}
                        </small>
                      </div>
                      <button
                        className={`btn ${
                          quiz.expanded ? "btn-warning" : "btn-success"
                        }`}
                        onClick={() => viewResults(index)}
                      >
                        {quiz.expanded ? "Hide Results ▲" : "View Results ▼"}
                      </button>
                    </div>
                    {quiz.expanded && (
                      <div className="mt-3">
                        <table className="table table-hover table-sm">
                          <thead>
                            <tr>
                              <th>Username</th>
                              <th>Score</th>
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
              <button
                className="btn btn-primary mt-3"
                onClick={() => createQuizPage(jobId)}
              >
                Create New Quiz
              </button>
            </div>
          )}
        </div>
      </div>
      {user?.userRole === "Employer" && appliedApplications.length > 0 && (
        <div className="container mt-4">
          <h3>Applications</h3>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appliedApplications.map((application, index) => (
                <tr key={index}>
                  <td>{application.username}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        application.status === "Accepted"
                          ? "success"
                          : application.status === "Rejected"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => viewApplicantHandler(index)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {user?.userRole === "Employer" && showApplicantPopup && (
        <ApplicationPopupComponent
          show={showApplicantPopup}
          username={appliedApplications[applicantIndex].username}
          email={appliedApplications[applicantIndex].email}
          experience={appliedApplications[applicantIndex].experience}
          education={appliedApplications[applicantIndex].education}
          skills={appliedApplications[applicantIndex].skills}
          resumeId={appliedApplications[applicantIndex].resumeId}
          editStatusApplicationHandler={changeApplicantStatusHandler}
          onClose={() => setShowApplicantPopup(false)}
          showResumeHandler={showResumeHandler}
        />
      )}
    </div>
  );
};

export default ViewJobPosting;
