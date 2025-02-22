import { Dropdown, DropdownButton } from "react-bootstrap";
import { logoutUser } from "../lib/api";
import queryClient from "../config/queryClient";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Welcome = () => {
  const navigate = useNavigate();

  const handleBack = async () => {
    await logoutUser();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const handleProfile = async () => {
    navigate("/account");
  };

  return (
    <div
      style={{
        position: "fixed",   // Fixes the position relative to the viewport
        bottom: "20px",      // Distance from the bottom of the screen
        left: "20px",        // Distance from the left of the screen
        zIndex: "1000",      // Ensures the button stays above other content
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
  );
};

export default Welcome;