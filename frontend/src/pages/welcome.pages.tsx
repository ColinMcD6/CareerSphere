import { Dropdown, DropdownButton } from "react-bootstrap";
import { logoutUser } from "../lib/api.lib";
import queryClient from "../config/queryClient.config";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import image from "../assets/Logo.png";

import { useState, useEffect } from "react";
import useUser from "../hooks/user.hooks";
import { getAllJobPostings } from "../lib/api.lib";


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

const Welcome = () => {

  //
  const { user, isLoading } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);




  const navigate = useNavigate();

  const handleBack = async () => {
    await logoutUser();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/account");
  };


  const viewJobPosting = (id: string) => {
    navigate(`/view-job-posting?ID=${id}`);
  };
    

  useEffect(() => {
      const fetchData = async () => {
        if (!user || user.userRole === "Employer") {
          return;
        }
        try {
          console.log("Contacting Express server to query jobs");
          let query =
            user?.userRole === "Employer" ? `?employerId=${user._id}` : "";
          if (query === "") {
            query = `?user_id=${user._id}`;
          }
          
          const response = await getAllJobPostings(query);
          console.log("Received response from express server with all jobs");
          console.log(response);
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



  return (
    <>
      <div
        style={{ position: "absolute", top: "200px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0"}}>
        <img src={image} alt="Career Sphere" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>


      {/* Job Showcase Section */}
      {
        user?.userRole === "Candidate" && !loading && !error &&
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "550px",
            gap: "20px",
          }}
        >
          <h2 style={{ textAlign: "center", width: "100%", marginBottom: "20px" }}>
            Jobs For You!
          </h2>
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job._id}
              onClick={() => viewJobPosting(job._id)}
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h5 
                style={{
                  textAlign: "center",
                  margin: "0 10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "90%", // Ensure the text fits within the container
                }}
              >
                {job.title}
              </h5>
              <p 
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "90%", // Ensure the text fits within the container
                }}
              >
                {job.location}
              </p>
            </div>
          ))}
        </div>
      }

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: "1000",
        }}
      >
        <DropdownButton
          id="dropdown-menu-align-right"
          variant="outline-secondary"
          title={<FaUserCircle size={30} />}
          align="end"
          drop="down">
          <Dropdown.Item onClick={handleProfile}>Edit Profile</Dropdown.Item>
          <Dropdown.Item onClick={handleBack}>Log Out</Dropdown.Item>
        </DropdownButton>
      </div>
    </>
  );
};

export default Welcome;
