import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaBriefcase } from "react-icons/fa";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top" className="shadow">
      <Container>
        <Nav className="ms-auto d-flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-1 ${isActive ? "text-secondary" : "text-light"}`
            }
          >
            <FaHome /> Home
          </NavLink>
          <NavLink
            to="/view-all-jobs"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-1 ${isActive ? "text-secondary" : "text-light"}`
            }
          >
            <FaBriefcase /> Jobs
          </NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;