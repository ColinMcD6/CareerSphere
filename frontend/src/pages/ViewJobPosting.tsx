import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getIndividualJobPosting } from "../lib/api";

const ViewJobPosting = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");

  interface JobPosting {
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
  const [data, setJob] = useState<JobPosting | null>(null); // Define the type for job

  useEffect(() => {
    if (jobId) {
      fetchJobPosting(jobId);
    }
  }, [jobId]);

  const fetchJobPosting = async (id: string) => {
    try {
      console.log("Contacting Express server to get a job posting with id : " + id );
      const response = await getIndividualJobPosting(id); // Wait for the promise to resolve
      console.log("successfully received job posting response");
      setJob(response);
    } catch (error) {
      console.log("Error getting job from server")
      console.error(error);
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
        </div>
      </div>
    </div>
  );
};

export default ViewJobPosting;