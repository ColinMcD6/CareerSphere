import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobPostings } from "../lib/api";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/user";
import { FaPlus } from "react-icons/fa"; // Importing the plus icon

interface Job {
  _id: string;
  title: string;
  category: number;
}

const ViewAllJobs: React.FC = () => {
  const { user, isLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [showSavedJobs, setShowSavedJobs] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }
      try {
        console.log("Contacting Express server to query jobs");
        let query = user?.userRole === "Employer" ? `?employer_id=${user._id}` : "";
        if(query === ""){
          query = showSavedJobs ? `?saved_posting_candidate_id=${user._id}` : "";
        }
        if(query === ""){
          query = `?user_id=${user._id}`;
        }
        const response = await getAllJobPostings(query);
        console.log("Received response from express server with all jobs");
        setJobs(response.jobPostings);
      } catch (error) {
        console.error("Error fetching all job postings : ", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, showSavedJobs]);

  const viewJobPosting = (id: string) => {
    navigate(`/view-job-posting?ID=${id}`);
  };

  const createJobPosting = () => {
    navigate("/create-job-posting");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="text-center mt-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-danger">Error fetching jobs.</div>;
  }

  return (
    <div className="mt-5">
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{user.userRole === "Employer" ? "My Job Postings" : "All Job Postings"}</h1>
        {user.userRole === "Employer" && (
          <button className="btn btn-success" onClick={createJobPosting}>
            <FaPlus/> Create
          </button>
        )}
        {user.userRole === "Candidate" && (
          <button className="btn btn-primary" onClick={() => setShowSavedJobs(!showSavedJobs)}>
            {showSavedJobs ? "Show All Jobs" : "Show Saved Jobs"}
          </button>
        )}
      </div>
      <div className="list-group">
        {jobs.map((job) => (
          <div key={job._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{job.title}</span>
            <button className="btn btn-primary" onClick={() => viewJobPosting(job._id)}>
              View Job Posting
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
  
};

export default ViewAllJobs;