import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the type for a job object
interface Job {
  _id: string;
  title: string;
}

const ViewAllJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]); // State to store the list of jobs
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5500/job");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data.jobPostings);       ;
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred"); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchJobs();
  }, []);

  // Function to handle viewing a job posting
  const viewJobPosting = (id: string) => {
    navigate(`/view-job-posting?ID=${id}`);
  };

  // Display loading state
  if (loading) {
    return <div className="text-center mt-4">Loading jobs...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="text-center mt-4 text-danger">Error: {error}</div>;
  }

  // Display the list of jobs
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">All Job Postings</h1>
      <div className="list-group">
        {jobs.map((job) => (
          <div key={job._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{job.title}</span>
            <button
              className="btn btn-primary"
              onClick={() => viewJobPosting(job._id)}
            >
              View Job Posting
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllJobs;