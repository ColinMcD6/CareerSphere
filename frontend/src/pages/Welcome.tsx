import useUser from "../hooks/user";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//at some point this will request user details and put up either the candidate or employer portal
const Welcome = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate("/");
  };
  const handleProfile = async () => {
    navigate("/account");
  };

  let out = (
    <>
      <h1>Welcome {user?.username}!</h1>
      <Button onClick={handleBack}>Log Out</Button>
      <Button onClick={handleProfile}>Edit Profile</Button>
    </>
  );
  return out;
};

export default Welcome;
