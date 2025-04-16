import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaBriefcase } from "react-icons/fa";
import { getUser } from "../lib/api.lib"; // Import the getUser function

const NavBar: React.FC = () => {
  const [userRole, setUserRole] = useState<string>("Guest"); // Default role is "Guest"

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUser(); // Fetch user data
        setUserRole(user?.userRole || "Guest"); // Set user role or default to "Guest"
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark" fixed="top" className="shadow">
        <Container>
          {/* Title bar to show user role */}
          <Navbar.Text className="text-light fw-bold">
            Role: {userRole}
          </Navbar.Text>
          <Nav className="ms-auto d-flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "text-secondary" : "text-light"
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
            <NavLink
              to="/view-all-jobs"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "text-secondary" : "text-light"
                }`
              }
            >
              <FaBriefcase /> Jobs
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      {/* Add a spacer div with inline styles */}
      <div style={{ marginTop: "70px" }}></div>
    </div>
  );
};

export default NavBar;