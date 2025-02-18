import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  let candidate = true;
  const handleSubmit = () => {
    let email = document.getElementById("inputEmail") as HTMLInputElement;
    let name = document.getElementById("inputName") as HTMLInputElement;
    let password = document.getElementById("inputPassword") as HTMLInputElement;
    //need a function that takes these + candidate and makes a profile -> from backend layer
    //REMEMBER to take email.value not just email||||||||||||||||||||||||||||||||||||||||||||||||
    //should this then send you back to home page or automatically log you in? -> ask group
    navigate("/");
    //navigate("/menu");?
  };
  const handleClick1 = () => {
    candidate = true;
  };
  const handleClick2 = () => {
    candidate = false;
  };

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
            name="roleRadio"
            id="radio1"
            onClick={handleClick1}
          />
          <label className="form-check-label" htmlFor="radio1">
            Candidate (default)
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="roleRadio"
            id="radio2"
            onClick={handleClick2}
          />
          <label className="form-check-label" htmlFor="radio2">
            Employer
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <Button onClick={handleSubmit}>Back</Button>
    </>
  );
  return out;
};

export default SignUp;
