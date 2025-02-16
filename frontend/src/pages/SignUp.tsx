import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate("/");
  };
  let out = (
    <>
      <h1>blank</h1>
      <Button onClick={handleBack}>Back</Button>
    </>
  );
  return out;
};

export default SignUp;
