import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate("/");
  };
  let out = (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="inputEmail" className="form-label">
            Email address
          </label>
          <input type="email" className="form-control" id="inputEmail" />
        </div>
        <div className="mb-3">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input type="name" className="form-control" id="inputName" />
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" id="inputPassword" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <Button onClick={handleBack}>Back</Button>
    </>
  );
  return out;
};

export default SignUp;
