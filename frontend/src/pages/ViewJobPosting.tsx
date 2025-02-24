import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FormModalPopupComponent from "../components/popup";
const PORT = 3000; // TEMPORARY SOLUTION, NEEDS TO CHANGE LATER
import { getIndividualJobPosting } from "../lib/api";
import useUser from "../hooks/user";
import { Navigate } from "react-router-dom";

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");

  const {user, isLoading } = useUser();
  const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job
  const [jobNotFound, setJobNotFound] = useState<boolean>(false); // Define the type for job

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
    datePosted: Date;
    deadline: Date;
    status: string;
  }

  // const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job
  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState<FormData | null>(null)

  useEffect(() => {
    if (jobId !== undefined && jobId !== null) {
      fetchJobPosting(jobId);
    } else {
      setJobNotFound(true);
    }
  }, [jobId]);

  //Send Application ----------------------------------------------------
  useEffect(() => {
    try{
      if(data && application){
        const submitApplication = async () => {
          console.log("SENDING FILE");

          application.append("job_id", data._id);
          application.append("employer_id", data.employer_id);
          application.append("candidate_id", "wefgwe");
          const response = await fetch(`http://localhost:${PORT}/resume/add`, {
            method: "POST",
            body: application,
          });
          const json = await response.json();
          console.log(json);
          const applicationResponse = await fetch(`http://localhost:${PORT}/job/applications/apply`, {
            method: "POST",
            body: JSON.stringify({
              job_id: data._id,
              employer_id: data.employer_id,
              candidate_id: "wefgwe",
              resume_id: json.resume._id,
              status: "Pending",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(applicationResponse);

        }
        submitApplication();

        
      }

    }
    catch (error) {
      console.error("Error fetching job posting:", error);
    }
    
    
  }, [application]);
  //End Send Application ----------------------------------------------------

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setApplication(formData);
  }
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
          <h2 className="text-primary mb-4">
              Job posting could not be Found
          </h2>
          <p className="text-danger mb-4">A job post with that id could not be found!</p>
        </div>
      </div>
    );
  }

  // This needs to be below and separate from the isLoading div
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {" "}
      {/* Add a container with margin-top */}
      <div className="card mb-4 shadow">
        {" "}
        {/* Add shadow for better visual appeal */}
        <h2 className="card-header bg-primary text-white ">{data.title}</h2>
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
          <div className="mb-3 d-none">
            <h6>Experience:</h6>
            <ul className="list-group">
              {data.experience.map((exp, index) => (
                <li key={index} className="list-group-item">
                  {exp}
                </li>
              ))}
            </ul>
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
          <div>
            <button className="btn btn-primary w"
              onClick={() => {
                
                setShowModal(true);
              }
              }
            >
              Apply
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default ViewJobPosting;
