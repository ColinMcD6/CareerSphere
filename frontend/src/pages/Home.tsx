import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogIn = async () => {
    navigate("/welcome");
  };
  const handleSignUp = async () => {
    navigate("/welcome");
  };
  //would be good to wrap the buttons in something to position them nicely
  let out = (
    <>
      <h1>Welcome to CareerSphere</h1>
      <Button className="log" onClick={handleLogIn}>
        Log In
      </Button>
      <Button className="sign" onClick={handleSignUp}>
        Sign up
      </Button>
    </>
  );

  return out;
};

export default Home;
