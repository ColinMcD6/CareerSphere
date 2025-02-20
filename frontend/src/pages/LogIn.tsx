import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// TODO add a forgot password button that takes you to home page and sends an email to change password
//I will not implement the email thing, that is sukhmeet
const LogIn = () => {
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate("/");
  };
  const handleSubmit = () => {
    let email = document.getElementById("inputEmail") as HTMLInputElement;
    let password = document.getElementById("inputPassword") as HTMLInputElement;
    //need a function that takes these and fetches profile
    //take variable.value not just the variable||||||||||||||||||||||
    navigate("/welcome");
  };
  let out = (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
      <Button onClick={handleBack}>Back</Button>
    </>
  );
  return out;
};

export default LogIn;
