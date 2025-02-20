import useUser from "../hooks/user";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  let initEmail = user?.email;
  let initName = user?.name;
  let initPassword = user?.password;
  const handleBack = async () => {
    navigate("/welcome");
  };
  const handleSubmit = () => {
    let email = document.getElementById("inputEmail") as HTMLInputElement;
    let name = document.getElementById("inputName") as HTMLInputElement;
    let password = document.getElementById("inputPassword") as HTMLInputElement;
    let experience = document.getElementById(
      "inputExperience"
    ) as HTMLInputElement;
    let education = document.getElementById(
      "inputEducation"
    ) as HTMLInputElement;
    let skills = document.getElementById("inputSkills") as HTMLInputElement;
    let projects = document.getElementById("inputProjects") as HTMLInputElement;
    let companyDetails = document.getElementById(
      "inputCompanyDetails"
    ) as HTMLInputElement;
    let hiringDetails = document.getElementById(
      "inputHiringDetails"
    ) as HTMLInputElement;
    //need a function that takes info and edits existing profile
    //take variable.value not just the variable||||||||||||||||||||||
    navigate("/welcome");
  };
  let out = (
    <>
      <h1>Edit Account Details</h1>
      <form>
        <div className="emailDiv">
          <label htmlFor="inputEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            defaultValue={initEmail}
          />
        </div>
        <div className="nameDiv">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            defaultValue={initName}
          />
        </div>
        <div className="passwordDiv">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            defaultValue={initPassword}
          />
        </div>
        <div className="experienceDiv">
          <label htmlFor="inputExperience" className="form-label">
            Experience
          </label>
          <input type="text" className="form-control" id="inputExperience" />
        </div>
        <div className="educationDiv">
          <label htmlFor="inputEducation" className="form-label">
            Education
          </label>
          <input type="text" className="form-control" id="inputEducation" />
        </div>
        <div className="skillDiv">
          <label htmlFor="inputSkills" className="form-label">
            Skills
          </label>
          <input type="text" className="form-control" id="inputSkills" />
        </div>
        <div className="projectDiv">
          <label htmlFor="inputProjects" className="form-label">
            Projects
          </label>
          <input type="text" className="form-control" id="inputProjects" />
        </div>
        <div className="companyDetailDiv">
          <label htmlFor="inputCompanyDetails" className="form-label">
            Company Details
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCompanyDetails"
          />
        </div>
        <div className="hiringDetailDiv">
          <label htmlFor="inputHiringDetails" className="form-label">
            Hiring Details
          </label>
          <input type="text" className="form-control" id="inputHiringDetails" />
        </div>
      </form>
      <Button onClick={handleSubmit}>Confirm</Button>
      <Button onClick={handleBack}>Cancel</Button>
    </>
  );
  return out;
};

export default Account;
