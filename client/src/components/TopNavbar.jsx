import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import { EXPRESS_PORT } from '../../../settings.js';



function TopNavbar() {
  const location = useLocation();
  const { isAuthenticated, checkAuth, logout } = useAuth();
  
  const handleLogout = async () => {
        logout();
    };
  

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Career Sphere</Navbar.Brand> {}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-md-center"> {}
          <Nav> {/* Remove ml-auto */}
            <Nav.Link as={Link} to="/" active={location.pathname === "/"} className='btn mr-2'>Home</Nav.Link>
            {isAuthenticated ? (
          <>
            <span className="mr-4">Welcome, {isAuthenticated}!</span>
            <Nav.Link as={Link} to="/Home" active={location.pathname === "/Home"} className='mx-2'>Job Listing</Nav.Link> // Fix later
            <Nav.Link as={Link} to="/Home" active={location.pathname === "/Home"} className='mx-2'>Account Management</Nav.Link> // Fix later
            <Nav.Link as={Link} to="/Home" onClick={handleLogout} className='mx-2'>Sign out</Nav.Link> // Fix later
           </>
        ) : 
        (
          <>
             <Nav.Link as={Link} to="/login" active={location.pathname === "/login"} className='mx-2'>Login</Nav.Link>
             <Nav.Link as={Link} to="/Signup" active={location.pathname === "/Signup"} className='mx-2'>sign-up</Nav.Link>
          </>
        )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}



export default TopNavbar;