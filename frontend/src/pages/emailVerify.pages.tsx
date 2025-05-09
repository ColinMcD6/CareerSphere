import { useNavigate, useParams } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { verifyEmail } from "../lib/api.lib";

const EmailVerify = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    
    // Explicitly define state type as boolean | null
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [error] = useState<string | null>(null);


    /*
    useEffect to verify email
    This will run when the component mounts and whenever the code changes.
    It calls the verifyEmail function with the code from the URL parameters.
    If the verification is successful, it sets isVerified to true. If it fails, it sets isVerified to false.
    */
    useEffect(() => {
        // Call verifyEmail when the component mounts
        const verify = async () => {
            await verifyEmail(code as string); // Call the API to verify the email
            setIsVerified(true); 
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