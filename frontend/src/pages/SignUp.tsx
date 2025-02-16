import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate("/");
  };
  //TODO, make the radios actually swap
  //TODO, change labe
  let out = (
    <>
      <form>
        <div className="emailDiv">
          <label htmlFor="inputEmail" className="form-label">
            Email address
          </label>
          <input type="email" className="form-control" id="inputEmail" />
        </div>
        <div className="nameDiv">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input type="name" className="form-control" id="inputName" />
        </div>
        <div className="passwordDiv">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" id="inputPassword" />
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="candidateRadio"
            id="radio1"
            checked
          />
          <label className="form-check-label" htmlFor="radio1">
            Candidate
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="employerRadio"
            id="radio2"
          />
          <label className="form-check-label" htmlFor="radio2">
            Employer
          </label>
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
