import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaBriefcase } from "react-icons/fa";

const NavBar = () => {
  return (
    <Navbar bg="dark" expand="lg" fixed="top" className="shadow">
      <Container>
      <Navbar.Toggle aria-controls="basic-navbar-nav"style={{ borderColor: 'white', padding: 0, backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', width: "30px", height: '30px' }} className="menu">
        <span className="menu" style={{ backgroundColor: 'black', width: '24px', height: '3px', borderRadius: '5px', display: 'block'}}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex gap-3">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `nav-link ${isActive ? "disabled text-secondary" : "text-primary"}`
              }>
              <FaHome /> Home
            </NavLink>
            <NavLink
              to="/view-all-jobs"
              className={({ isActive }) => 
                `nav-link ${isActive ? "disabled text-secondary" : "text-primary"}`
              }>
              <FaBriefcase /> Jobs
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
