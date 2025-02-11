import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

import {
  passwordCheck,
  emailCheck,
  nameCheck,
} from "../../../common/common.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    accountType: "candidate",
  });

  // Simple popup styling
  const popupStyle = {
    top: "20px",
    left: "50%",
    backgroundColor: "green",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
  };

  const { isAuthenticated } = useAuth();


  const navigate = useNavigate();

  // If user already signed in redirect.
  useEffect(() => {
    // Redirect to home if the user is already authenticated
    if (isAuthenticated) {
      navigate("/home"); // Replace "/home" with your home route
    }
  }, [isAuthenticated, navigate]);

  // State for form inputs
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, SetEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneralError(false);
    let localValid = true;

    //PASSWORD CHECKING
    const passwordCheckResults = passwordCheck(formData.password);
    setPasswordError(
      passwordCheckResults.isValid() ? "" : passwordCheckResults.getMessage()
    );

    // EMAIL CHECKING
    const emailCheckResults = emailCheck(formData.email);
    SetEmailError(
      emailCheckResults.isValid() ? "" : emailCheckResults.getMessage()
    );

    // FirstName CHECKING
    const firstNameCheckResult = nameCheck(formData.firstName);
    setFirstNameError(
      firstNameCheckResult.isValid() ? "" : firstNameCheckResult.getMessage()
    );

    // lastName CHECKING
    const lastNameCheckResult = nameCheck(formData.lastName);
    setLastNameError(
      lastNameCheckResult.isValid() ? "" : lastNameCheckResult.getMessage()
    );

    localValid =
      passwordCheckResults.isValid() &&
      emailCheckResults.isValid() &&
      firstNameCheckResult.isValid() &&
      lastNameCheckResult.isValid();

    if (localValid) {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status == 201) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/login");
          }, 2000);
        } else if (response.status == 400) {
          setPasswordError(data.passwordError);
          SetEmailError(data.emailError);
          setUsernameError(data.usernameError);
        } else {
          setGeneralError(true);
        }
      } catch (error) {
        setGeneralError(true);
      }
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <div className="container mt-5">
        <div className="row justify-content-center signup-div">
          <div className="col-md-6" style={{ marginTop: "50px" }}>
            <div className="card shadow">
              <div className="card-body">
                <h3 className="text-center mb-4">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    {showPopup && (
                      <div style={popupStyle}>
                        <p>Account created successfully!</p>
                      </div>
                    )}

                    <label htmlFor="account-type" className="form-label">
                      Account Type
                    </label>
                    <select
                      type="text"
                      className={`form-control`}
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      required
                    >
                      <option value="candidate">Candidate</option>
                      <option value="employer">Employer</option>
                    </select>
                    <div className="invalid-feedback">{firstNameError}</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        firstNameError === "" ? "" : "is-invalid"
                      }`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                    />
                    <div className="invalid-feedback">{firstNameError}</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        firstNameError === "" ? "" : "is-invalid"
                      }`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                    />
                    <div className="invalid-feedback">{lastNameError}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        emailError === "" ? "" : "is-invalid"
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    <div className="invalid-feedback">{emailError}</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        passwordError === "" ? "" : "is-invalid"
                      }`}
                      id="password"
                      name="password"
                      onChange={handleChange}
                      value={formData.password}
                      placeholder="Enter a new password"
                      required
                    />
                    <div className="invalid-feedback">{passwordError}</div>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <a href="/Login" className="text-decoration-none">
                    Log In
                  </a>
                </p>
              </div>
            </div>
            <p
              className={`general-error-feedback text-center mt-3 alert alert-danger ${
                generalError ? "" : "invisible"
              }`}
            >
              Unkown error has occured
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
