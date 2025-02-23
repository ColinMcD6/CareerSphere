import React, { useState } from "react";
const BACK_END_URL = import.meta.env.VITE_API_URL;
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import { createJobPosting } from "../lib/api";

const CreateJobPost: React.FC = () => {
  const [postingTitle, setPostingTitle] = useState<string>("");
  const [positionTitle, setPositionTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>();
  const [location, setLocation] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [compensationType, setCompensationType] = useState<
    "salary" | "hourly" | "do-not-disclose"
  >("do-not-disclose");
  const [compensationAmount, setCompensationAmount] = useState<number>(0);
  const [jobType, setJobType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track submission state
  const navigate = useNavigate(); // For redirection


  // Feed back errors, allowing user to know what information is invalid
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  // Get the Errors
  const getErrorForField = (field: string) => {
    return errors.find((err) => err.field === field)?.message;
  };

  // Reset errors
  const resetErrors = () => {
    setErrors([]); // Reset errors to an empty array
  };

  // Submit job post button clicked
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsSubmitting(true); // Disable inputs and buttons

    const formData = {
      title: postingTitle,
      positionTitle: positionTitle,
      compensationType: compensationType,
      salary: compensationAmount,
      description: description,
      employer: "ASDASDSA",
      employer_id: "ASDASDSA",
      location: location,
      experience: [],
      skills: [],
      education: [],
      deadline: dueDate,
      startingDate: startDate,
      status: "Open",
      jobType: jobType
    };

    console.log(`Sending a create job post request to ${BACK_END_URL}/job/add`);

        try {
          setIsSubmitting(true); // Disable inputs and buttons
          await createJobPosting({ ...formData });

          // The job posting was sucessfully create - Let user know, then redirect to home page
          console.log("Job post sucesfully created and okay response received!");
          resetErrors(); // Reeset validation errors
  
          const WAIT_TIME = 3000;
          // Show success toast
          toast.success("Job posting created successfully!", {
            position: "top-center",
            autoClose: WAIT_TIME,
          });
         
          setTimeout(() => {
            navigate("/"); // Redirect to the home page
          }, WAIT_TIME)
        } catch (error: any) {

          console.error("Error registering user:", error);
          setIsSubmitting(false); // Re-enable inputs and buttons
          
          if (error.error === "Validation Error") {
            setErrors(error.details); // Set validation errors
            console.log("Received Validation error: ");
            console.log(error);
          } else {
            console.log("Recieved an error when trying submit job posting : " + error)

          }
        }
  
  }; // End of function that handles submit button

  return (
    
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">Create Job Posting</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title of Job Posting:</label>
              <input
                type="text"
                className={`form-control ${
                  getErrorForField("title") === undefined ? "" : "is-invalid"
                }`}
                value={postingTitle}
                onChange={(e) => setPostingTitle(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("title")}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Position Name:</label>
              <input
                type="text"
                className={`form-control ${
                  getErrorForField("positionTitle") === undefined
                    ? ""
                    : "is-invalid"
                }`}
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("positionTitle")}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Job Description:</label>
              <textarea
                className={`form-control ${
                  getErrorForField("description") === undefined
                    ? ""
                    : "is-invalid"
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("description")}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Starting Date For Job:</label>
              <input
                type="date"
                style={{ textAlign: 'center' }}
                className="form-control justify-content-center"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-3" >
              <label className="form-label">Due Date for Applying:</label>
              <input
                style={{ textAlign: 'center' }}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`form-control  ${true ? "" : "is-invalid"}`}
                disabled={isSubmitting}
              />
            </div>
            <div className="mt-3 p-3 border rounded bg-light">
              <div className="mb-3">
                <label className="form-label">Compensation Type:</label>
                <select
                  className={`form-select ${true ? "" : "is-invalid"}`}
                  value={compensationType}
                  onChange={(e) => {
                    setCompensationType(
                      e.target.value as "salary" | "hourly" | "do-not-disclose"
                    );
                  }}
                  disabled={isSubmitting}
                  style={{ textAlign: 'center' }}
                >
                  <option value="do-not-disclosee">Do Not Disclose</option>
                  <option value="salary">Salary</option>
                  <option value="hourly">Hourly Wage</option>
                </select>
              </div>

              {compensationType !== "do-not-disclose" && (
                <div className="mb-3">
                  <label className="form-label">
                    {compensationType === "salary" ? "Salary" : "Hourly Wage"}:
                  </label>
                  <input
                    type="number"
                    className={`form-control ${getErrorForField("salary") === undefined ? "" : "is-invalid"}`}
                    value={compensationAmount == 0 ? "" : compensationAmount}
                    onChange={(e) =>
                      setCompensationAmount(Number(e.target.value))
                    }
                    disabled={isSubmitting}
                  />
                  <div className="invalid-feedback">{ getErrorForField("salary")  }</div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Location:</label>
              <input
                type="text"
                className={`form-control ${ getErrorForField("location") === undefined ? "" : "is-invalid"}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("location")}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Skills (comma-separated):
              </label>
              <textarea
                className="form-control"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Education (comma-separated):</label>
              <textarea
                className="form-control"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <div className={`d-flex justify-content-center align-items-center  ${ getErrorForField("jobType") === undefined ? "" : "is-invalid"}`}>
                <div className={`form-label`}>
                  <label className={`form-label`}>
                    What type of Employment is it?
                  </label>
                  <div>
                    {[
                      {
                        id: "fullTime",
                        value: "Full-time",
                        label: "Full-time",
                      },
                      {
                        id: "partTime",
                        value: "Part-time",
                        label: "Part-time",
                      },
                      {
                        id: "temporary",
                        value: "Temporary",
                        label: "Temporary",
                      },
                      {
                        id: "internship",
                        value: "Internship",
                        label: "Internship",
                      },
                    ].map(({ id, value, label }) => (
                      <div
                        key={id}
                        className="form-check d-flex align-items-center gap-2"
                      >
                        <input
                          type="radio"
                          className="form-check-input"
                          id={id}
                          name="jobType"
                          value={value}
                          checked={jobType === value}
                          onChange={(e) => setJobType(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <label className="form-check-label mb-0" htmlFor={id}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="invalid-feedback">
                {getErrorForField("jobType") === undefined ? "" : "Employement type is required!"}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              Create Job Posting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateJobPost;
