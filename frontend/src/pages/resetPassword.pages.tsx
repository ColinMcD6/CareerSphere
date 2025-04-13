import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { changePassword } from "../lib/api.lib";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code") || ""; // 
  const exp = searchParams.get("exp") || ""; // 

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  
  /*
  useEffect to check if the reset link is expired
  This will run when the component mounts and whenever the exp changes.
  */
  useEffect(() => {
    if (exp) {
      const expirationTime = new Date(Number(exp) * 1000); // Convert to milliseconds
      if (new Date() > expirationTime) {
        setIsExpired(true);
      }
    }
  }, [exp]);


  /*
  Handler function for form submission
  This function prevents the default form submission behavior,
  sets the loading state to true,
  and calls the changePassword function with the user's new password and verification code.
  If the password change is successful, it sets the submitted state to true.
  If there is an error, it alerts the user.
  Finally, it resets the loading state.
  */
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
    } catch (error: any){
      const message = error.message
      alert(`Error resetting password. Please try again. ${message}`);
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
                isInvalid={!isPasswordValid && newPassword.length > 0}
                required
              />
              {newPassword.length > 0 && (
                <Form.Text className={isPasswordValid ? "text-success" : "text-danger"}>
                  {isPasswordValid
                    ? "✅ Password length is sufficient."
                    : "❌ Password must be at least 8 characters long."}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!doPassMatch && confirmPassword.length > 0}
                required
              />
              {confirmPassword.length > 0 && (
                <Form.Text className={doPassMatch ? "text-success" : "text-danger"}>
                  {doPassMatch
                    ? "✅ Passwords match."
                    : "❌ Passwords do not match."}
                </Form.Text>
              )}
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