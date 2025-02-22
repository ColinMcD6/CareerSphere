import { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { checklogIn } from "../lib/api";

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await checklogIn({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    }
  };

  // Email validation using a simple regex pattern
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <h3 className="text-center mb-4">Log In</h3>
          <Form onSubmit={handleSubmit}>
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
            <div className="text-end mb-3">
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate("/password/forgot")}>
                Forgot Password?
              </Button>
            </div>
            <Button variant="primary" type="submit" className="w-100" disabled={!isFormValid}>
              Log In
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate("/signup")} 
              className="w-100 mt-2">
              Need to Create Account?
            </Button>
          </Form>
          <Button variant="secondary" onClick={() => navigate("/")} className="w-100 mt-3">
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
