import useUser from "../hooks/user";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
      <h1>
        Welcome {user?.firstName} {user?.lastName}!
      </h1>
      <Button onClick={handleBack}>Log Out</Button>
      <Button onClick={handleProfile}>Edit Profile</Button>
    </>
  );
  return out;
};

export default Welcome;
