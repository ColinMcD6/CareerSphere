import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobPostings } from "../lib/api";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/user";
import { FaPlus } from "react-icons/fa"; // Importing the plus icon

interface Job {
  _id: string;
  title: string;
  positionTitle: string;
  description: string;
  employer: string;
  location: string;
  skills: string[];
}

const ViewAllJobs: React.FC = () => {
  const { user, isLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }
      try {
        console.log("Contacting Express server to query jobs");
        const query = user?.userRole === "Employer" ? `?employer_id=${user._id}` : "";
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
  }, [user]);

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

  // Compute the filtered jobs list based on the search query
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.skills && job.skills.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mt-5">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{user.userRole === "Employer" ? "My Job Postings" : "All Job Postings"}</h1>
          {user.userRole === "Employer" && (
            <button className="btn btn-success" onClick={createJobPosting}>
              <FaPlus /> Create
            </button>
          )}
        </div>
        {/* Adding the Search Bar above the job list */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>
        {/* If no jobs match the search, show a message */}
        {filteredJobs.length === 0 ? (
          <div className="alert alert-info mt-3">
            No available job that matches the search!
          </div>
        ) : (
        <div className="list-group">
          {filteredJobs.map((job) => (
            <div key={job._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{job.title}</span>
              <button className="btn btn-primary" onClick={() => viewJobPosting(job._id)}>
                View Job Posting
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllJobs;