import { Dropdown, DropdownButton } from "react-bootstrap";
import { logoutUser } from "../lib/api";
import queryClient from "../config/queryClient";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBriefcase } from "react-icons/fa";
import { Button } from "react-bootstrap";
import image from "../assets/Logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  const handleBack = async () => {
    await logoutUser();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/account");
  };

  const handleJobs = () => {
    navigate("/view-all-jobs");
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}>
        <img src={image} alt="Career Sphere" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
        <Button variant="primary" onClick={handleJobs}>
          <FaBriefcase size= "20px" /> Jobs
        </Button>
      </div>
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
          drop="down"
        >
          <Dropdown.Item onClick={handleProfile}>Edit Profile</Dropdown.Item>
          <Dropdown.Item onClick={handleBack}>Log Out</Dropdown.Item>
        </DropdownButton>
      </div>
    </>
  );
};

export default Welcome;
