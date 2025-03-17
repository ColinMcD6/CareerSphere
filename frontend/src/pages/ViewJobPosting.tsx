import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FormModalPopupComponent from "../components/popup";
import {
  addResume,
  applyforJob,
  getIndividualJobPosting,
  checkwhoApplied,
  getAllQuizzesForJob
} from "../lib/api";
import useUser from "../hooks/user";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");
  const { user, isLoading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState<FormData | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false); // New state for tracking application submission
  const [quizzes, setQuizzes] = useState <quizInterface[]> ([]);
  const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job
  const [jobNotFound, setJobNotFound] = useState<boolean>(false); // Define the type for job
  const [appliedApplications, setAppliedApplications] = useState<
    SingleApplication[]
  >([]);
  
  interface SingleApplication {
    username: string;
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
  }

  interface quizInterface {
    _id: string;
    quizName: string
  }

  const navigate = useNavigate();

  // Query to get job posting ----------------------------------------------------
  useEffect(() => {
    if (jobId !== undefined && jobId !== null) {
      console.log("Fetching the job post");
      fetchJobPosting(jobId);
      fetchQuizzes(jobId)
    } else {
      setJobNotFound(true);
    }
  }, [jobId]);

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
          setAppliedApplications(response.applications);
          console.log("Received applications for job posting");
        } catch (error) {
          console.log("Error trying to get applications");
          console.log(error);
        }
      }
    };
    queryForApplications();
  }, [user, jobId, data]);

  

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
          } catch (error) {
            console.error("Error submitting application:", error);
          }
        };
        submitApplication();
      }
    } catch (error) {
      console.error("Error fetching job posting:", error);
    }
  }, [application, isApplied]);

  // Handler to submit form
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
      const response = await getIndividualJobPosting(id); // Wait for the promise to resolve
      console.log("successfully received job posting response");
      setJob(response);
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

   // Function to call when fetching jobs
   const fetchQuizzes = async (id: string) => {
    try {
      console.log(
        "Contacting Express server to get all quizzes for job post"
      );
      const response = await getAllQuizzesForJob(id); // Wait for the promise to resolve
      console.log("successfully received quizzes");
      console.log(response)
      setQuizzes(response.quizzes);

    } catch (error: any) {
      if (error.status == 409) {
        console.log("No quizzes for job posting could be found!");
      } else {
        console.log("Unknown Error occurred when requesting quizzes from server");
        console.error(error);
      }
    }
  };

  const takeQuizLink = (quizId: string) => {
    navigate(`/Take-Quiz?ID=${jobId}&quizId=${quizId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
    <div className="mt-5 pt-1">
      <div className="container mt-5">
        <div className="card mb-4 shadow">
          <h2 className="card-header bg-primary text-white">{data.title}</h2>
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
                  <strong>Deadline:</strong>{" "}
                  {new Date(data.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <p className="card-text">
                <strong>Status:</strong> {data.status}
              </p>
              <p className="card-text">
                <strong>Date Posted:</strong> {DateToString(data.datePosted)}
              </p>
              <p className="card-text">
                <strong>Deadline:</strong> {DateToString(data.dueDate)}
              </p>
              <p className="card-text">
                <strong>Starting Date For Job:</strong>{" "}
                {DateToString(data.startDate)}
              </p>
            </div>
            <div className="mb-3">
              <h6>Skills:</h6>
              <ul className="list-group">
                {data.skills.map((skill, index) => (
                  <li key={index} className="list-group-item">
                    {skill}
                  </li>
                ))}
              </ul>
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
            )}
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
          <h6> Available Quizzes!</h6>
          <div className="list-group">
          {quizzes.map((quiz) => (
            <div  key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{quiz.quizName}</span>
              <button className="btn btn-primary"  onClick={() => takeQuizLink(quiz._id)}>
                  Take Quiz
              </button>
            </div>
          ))}
          </div>
        </div>
        {user?.userRole == "Employer" && (
          <div className="container mt-4">
            <h2 className="mb-4">Applications</h2>
            <p className="text-muted mt-4">
              You have <strong>{appliedApplications?.length}</strong>{" "}
              Applications to this job post!
            </p>
            <ul className="list-group">
              {appliedApplications?.map((application, index) => (
                <li key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">
                        User : <strong>{application.username}</strong>
                      </h5>
                    </div>
                    <div>
                      {"Status:  "}
                      <span className={`badge bg-success`}>Open</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn btn-primary" onClick={() => createQuizPage(jobId)} >
            Create Quiz for job Posting
        </button>
      </div>
    </div>
  );
};

export default ViewJobPosting;
