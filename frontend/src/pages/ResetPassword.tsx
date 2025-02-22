import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { changePassword } from "../lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code") || "";
  const exp = searchParams.get("exp") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (exp) {
      const expirationTime = new Date(Number(exp) * 1000); // Convert to milliseconds
      if (new Date() > expirationTime) {
        setIsExpired(true);
      }
    }
  }, [exp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await changePassword({ verifycode: code, password: newPassword });
      setSubmitted(true);
    } catch {
      alert("Error resetting password. Please try again.");
    }
    setLoading(false);
  };

  if (!code || !exp || isExpired) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Alert variant="danger" className="text-center">
          ❌ Invalid or expired reset link.
        </Alert>
      </Container>
    );
  }

  // Enable the submit button only when passwords match
  const doPassMatch = newPassword == confirmPassword;
  const isPasswordValid = newPassword.length >= 8;
  const isSubmitDisabled = !(doPassMatch && isPasswordValid);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Reset Password</h3>
        {submitted ? (
          <Alert variant="success">✅ Password has been reset successfully!</Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isSubmitDisabled || loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default ResetPassword;