import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//TODO make a page where the portals will go
//TODO make a page for edit profiles: experience, educations, Candidate only(skills, projects), Employer only(company details, hiring details)
//edit profiles will fetch user details to determine which forms to place up
const Home = () => {
  const navigate = useNavigate();

  const handleLogIn = async () => {
    navigate("/login");
  };

  //would be good to wrap the buttons in something to position them nicely
  let out = (
    <>
      <h1>Welcome to CareerSphere</h1>
      <Button className="logButton" onClick={handleLogIn}>
        Log In
      </Button>
    </>
  );

  return out;
};

export default Home;
