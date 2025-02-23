import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobPostings } from "../lib/api";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/user";

// Define the type for a job object
interface Job {
  _id: string;
  title: string;
}

const ViewAllJobs: React.FC = () => {
  const { user, isLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]); // State to store the list of jobs
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  // Fetch jobs from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Contacting Express server to get all jobs")
        const response = await getAllJobPostings(); // Wait for the promise to resolve
        console.log("Received response from express server will all jobs")
        setJobs(response.jobPostings);  
      } catch (error) {

        console.error('Error fetching all jobs posting :', error);
      }
      finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);

  // Function to handle viewing a job posting
  const viewJobPosting = (id: string) => {
    navigate(`/view-job-posting?ID=${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

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