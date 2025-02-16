import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogIn = async () => {
    navigate("/login");
  };
  const handleSignUp = async () => {
    navigate("/signup");
  };
  //would be good to wrap the buttons in something to position them nicely
  let out = (
    <>
      <h1>Welcome to CareerSphere</h1>
      <Button className="logButton" onClick={handleLogIn}>
        Log In
      </Button>
      <Button className="signButton" onClick={handleSignUp}>
        Sign up
      </Button>
    </>
  );

  return out;
};

export default Home;
