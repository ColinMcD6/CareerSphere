import { Dropdown, DropdownButton } from "react-bootstrap";
import { logoutUser } from "../lib/api.lib";
import queryClient from "../config/queryClient.config";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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


  return (
    <>
      <div
        style={{ position: "absolute", top: "200px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0"}}>
        <img src={image} alt="Career Sphere" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          drop="down">
          <Dropdown.Item onClick={handleProfile}>Edit Profile</Dropdown.Item>
          <Dropdown.Item onClick={handleBack}>Log Out</Dropdown.Item>
        </DropdownButton>
      </div>
    </>
  );
};

export default Welcome;
