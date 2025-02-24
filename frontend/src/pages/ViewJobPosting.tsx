import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FormModalPopupComponent from "../components/popup";
const PORT = 3000; // TEMPORARY SOLUTION, NEEDS TO CHANGE LATER

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");

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
    // Add other fields as needed
  }

  const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job
  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState<FormData | null>(null)

  //const [resume, setResume] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchJobPosting(jobId);
    }
  }, [jobId]);

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

  const fetchJobPosting = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/job/${id}`);
      console.log(response);
      const data = await response.json();
      console.log(data);
      setJob(data);
    } catch (error) {
      console.error("Error fetching job posting:", error);
    }
  };

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
            Position Title: {data.positionTitle}
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
                <strong>Compensation Type:</strong> {data.compensationType}
              </p>
              <p className="card-text">
                <strong>Salary:</strong> ${data.salary}
              </p>
              <p className="card-text">
                <strong>Job Type:</strong> {data.jobType}
              </p>
            </div>

            <div className="col-md-6">
              <p className="card-text">
                <strong>Location:</strong> {data.location}
              </p>
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

          <div className="mb-3">
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
              handleSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                setApplication(formData);
                
                
              }}
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
