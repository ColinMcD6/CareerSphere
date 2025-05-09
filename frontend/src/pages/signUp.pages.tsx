import { useState } from "react";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api.lib";

const SignUp = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /*
  Handler function for form submission
  Updates the formData state with the user's input values.
  This function is called whenever the user types in the input fields.
  */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };


  /*
  Handler function for form submission
  Updates the formData state with the user's input values.
  This function is called whenever the user types in the input fields.
  It also clears any previous error messages when the user starts typing.
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userRole = candidate ? "Candidate" : "Employer";

    try {
      await registerUser({ ...formData, userRole: userRole });
      navigate("/login");
    } catch (error: any) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again.");
    }
  };

  // Email validation
  const isUsernameValid = formData.username.length > 5;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = isEmailValid && isPasswordValid && doPasswordsMatch;

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <h3 className="text-center mb-4">Sign Up</h3>
          {/* General Error Display */}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="inputUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                isInvalid={formData.username.length > 0 && !isUsernameValid}
              />
              <Form.Control.Feedback type="invalid">
                Username must be at least 5 characters long.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="inputEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                isInvalid={formData.email.length > 0 && !isEmailValid}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="inputPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                isInvalid={formData.password.length > 0 && !isPasswordValid}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 8 characters long.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={formData.confirmPassword.length > 0 && !doPasswordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registering As:</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="Candidate"
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
            <Button variant="primary" type="submit" className="w-100" disabled={!isFormValid}>
              Sign Up
            </Button>
          </Form>
          <Button
            variant="secondary"
            onClick={() => navigate("/login")}
            className="w-100 mt-3">
            Sign In To Existing Account!
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;