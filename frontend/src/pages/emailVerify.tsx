import { useNavigate, useParams } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { verifyEmail } from "../lib/api";

const EmailVerify = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    
    // Explicitly define state type as boolean | null
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [error] = useState<string | null>(null);

    useEffect(() => {
        // Call verifyEmail when the component mounts
        const verify = async () => {
            try {
                await verifyEmail(code || "");
                setIsVerified(true);  // Set to true on success
            } catch (err) {
                setIsVerified(false); // Set to false on failure
            }
        };

        verify();
    }, [code]);

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="text-center">
                {isVerified === true && (
                    <Alert variant="success">✅ Your email has been successfully verified!</Alert>
                )}
                {isVerified === false && (
                    <Alert variant="danger">❌ Something went wrong: {error}</Alert>
                )}
                <Button variant="primary" onClick={() => navigate("/login")} className="mt-3">Go to Login</Button>
            </div>
        </Container>
    );
};

export default EmailVerify;