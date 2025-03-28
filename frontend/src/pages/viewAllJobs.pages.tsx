import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobPostings } from "../lib/api.lib";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/user.hooks";
import { FaPlus } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  positionTitle: string;
  description: string;
  employer: string;
  location: string;
  skills: string[];
  category: number;
}

const ViewAllJobs: React.FC = () => {
  const { user, isLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [showSavedJobs, setShowSavedJobs] = useState<boolean>(false);

  const navigate = useNavigate();


  /*
  useEffect to check if the user is logged in and has the correct role
  This will run when the component mounts and whenever the user object changes.
  If the user is not logged in or does not have the correct role, they will be redirected to the login page.
  */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }
      try {
        console.log("Contacting Express server to query jobs");
        let query =
          user?.userRole === "Employer" ? `?employer_id=${user._id}` : "";
        if (query === "") {
          query = showSavedJobs
            ? `?saved_posting_candidate_id=${user._id}`
            : "";
        }
        if (query === "") {
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

  //---Navigation functions----
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
    return (
      <div className="text-center mt-4 text-danger">Error fetching jobs.</div>
    );
  }

  // Compute the filtered jobs list based on the search query
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills &&
        job.skills.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mt-5 pt-1">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex justify-content-center flex-grow-1">
            <h1>
              {user.userRole === "Employer"
                ? "My Job Postings"
                : showSavedJobs ? "My Saved Job Postings" : "All Job Postings"}
            </h1>
          </div>
          {user.userRole === "Employer" && (
            <button className="btn btn-success me-5 w-auto" style={{ minWidth: "50px" }} onClick={createJobPosting}>
              <FaPlus /> 
            </button>
          )}
          {user.userRole === "Candidate" && (
            <button
              className="btn btn-primary"
              onClick={() => setShowSavedJobs(!showSavedJobs)}
            >
              {showSavedJobs ? "Show All Jobs" : "Show Saved Jobs"}
            </button>
          )}
        </div>
     
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
              <div
                key={job._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="text-truncate">{job.title}</span>
                <button
                  className="btn btn-primary w-auto"
                  style={{ minWidth: "80px" }}
                  onClick={() => viewJobPosting(job._id)}
                >
                  View
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
