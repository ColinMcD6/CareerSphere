import { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(true);
  const [formData, setFormData] = useState({
    username: "", // Changed order: Username is at the top
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    // Determine user role based on selection
    const userRole = candidate ? "Candidate" : "Employer";

    try {
      await registerUser({ ...formData, userRole });
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <h3 className="text-center mb-4">Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            {/* Username Field (Moved to the top) */}
            <Form.Group className="mb-3" controlId="inputUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3" controlId="inputEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3" controlId="inputPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group className="mb-3" controlId="confirm_password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                placeholder="Re-enter password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Role Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Registering As:</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="Candidate (default)"
                  name="roleRadio"
                  checked={candidate}
                  onChange={() => setCandidate(true)}
                />
                <Form.Check
                  type="radio"
                  label="Employer"
                  name="roleRadio"
                  checked={!candidate}
                  onChange={() => setCandidate(false)}
                />
              </div>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>

          {/* Back Button */}
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            className="w-100 mt-3"
          >
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
