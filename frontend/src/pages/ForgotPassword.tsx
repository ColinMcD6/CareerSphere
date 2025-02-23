import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { sendresetPassEmail } from "../lib/api";

const ForgotPassword = () => {
  const [userInputEmail, setuserInputEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Disable button while sending request
    try {
      await sendresetPassEmail({email: userInputEmail});
      setSubmitted(true);
    } catch {
      alert("Error sending reset email. Please try again.");
    }
    setLoading(false); // Re-enable button after request completes
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        {submitted ? (
          <Alert variant="success">📩 A password reset link has been sent to your email!</Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="userInputEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="userInputEmail"
                placeholder="Enter your email"
                value={userInputEmail}
                onChange={(e) => setuserInputEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default ForgotPassword;