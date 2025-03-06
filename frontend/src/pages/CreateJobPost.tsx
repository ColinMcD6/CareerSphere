import React, { useState, useEffect } from "react";
const BACK_END_URL = import.meta.env.VITE_API_URL;
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import { createJobPosting } from "../lib/api";
import useUser from "../hooks/user";
import { Navigate } from "react-router-dom";
import JobPostingValidation from "../../../backend/src/common/JobPostingValidation"

interface JobPostingInterface {
  title: string;
  positionTitle: string;
  description: string;
  startDate?: string;
  dueDate?: string;
  startDateEnabled: boolean; // Only for react front end, not used by back end
  dueDateEnabled: boolean; // Only for react front end, not used by back end
  location: string;
  deadline: string;
  salary: number;
  startingDate: string;
  status: string;
  skills: [];
  education: [];
  experience: [],
  compensationType: "salary" | "hourly" | "do-not-disclose";
  jobType: string;

}

const CreateJobPost: React.FC = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track submission state
  const navigate = useNavigate(); // For redirection
  const { user, isLoading } = useUser();

  // Feed back errors, allowing user to know what information is invalid
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]
  );

  const [formData, setFormData] = useState<JobPostingInterface>({
    title: "",
    positionTitle: "",
    description: "",
    startDate: "",
    startDateEnabled: false,  
    dueDate: "",
    dueDateEnabled: false, 
    location: "",
    deadline: "",
    salary: 0,
    startingDate: "",
    status: "Open",
    experience: [],
    skills: [],
    education: [],
    compensationType: "do-not-disclose",
    jobType: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const castType = event.currentTarget.getAttribute('data-cast-type') || 'string';

    setFormData((prev) => {
      let newFormData = undefined;
      if (castType === "array")
        newFormData = { ...prev, [name]: value.split(",") };
      else if (castType === "number")
        newFormData = { ...prev, [name]: Number(value) };
      else if (castType === "check") {
        const isCheckbox = type === "checkbox";
        const checked = isCheckbox ? (event.target as HTMLInputElement).checked : undefined;
        newFormData = { ...prev, [name]: Boolean(checked) };
      }
      else
        newFormData = { ...prev, [name]: value };

      errorCheckAfterChange(name, newFormData); // Pass the newFormData to errorCheckAfterChange
      return newFormData;
    });
  };

  const errorCheckAfterChange = (target: string, formData: any) => {
    const result = JobPostingValidation.safeParse(transformData(formData));
    let targetError = undefined;
    if (!result.success) {
      targetError = result.error.errors.find((error) => error.path[0] === target);
    }

    let filteredErrors = errors.filter((error) => error.field !== target);
    // If targetError is defined, add it to the errors array
    if (targetError) {
      filteredErrors = [...filteredErrors, { field: target, message: targetError.message }];
    }
    setErrors(filteredErrors);
  }

  const transformData = (formData: JobPostingInterface) => {
    const transformedData = { ...formData };
    if (!transformedData.startDateEnabled)
      transformedData.startDate = undefined;

    if (!transformedData.dueDateEnabled)
      transformedData.dueDate = undefined;

    return transformedData
  }

  // If the user is not logged in, redirect them away from this page
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);


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

    console.log(`Sending a create job post request to ${BACK_END_URL}/job/add`);

    try {

      setIsSubmitting(true); // Disable inputs and buttons
      await createJobPosting(transformData({ ...formData }));

      // The job posting was successfully created - Let user know, then redirect to home page
      console.log("Job post successfully created and okay response received!");
      resetErrors(); // Reset validation errors

      const WAIT_TIME = 3000;
      // Show success toast
      toast.success("Job posting created successfully!", {
        position: "top-center",
        autoClose: WAIT_TIME,
      });

      setTimeout(() => {
        navigate("/view-all-jobs"); // Redirect to the home page
      }, WAIT_TIME);
    } catch (error: any) {
      setIsSubmitting(false); // Re-enable inputs and buttons

      if (error.error === "Validation Error") {
        setErrors(error.details); // Set validation errors
        console.log("Received Validation error: ");
        console.log(error);
      } else {
        console.log("Received an unknown error when trying to submit job posting");
        console.log(error);
      }
    }
  }; // End of function that handles submit button

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <ToastContainer aria-label={undefined} />
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
                className={`form-control ${getErrorForField("title") === undefined ? "" : "is-invalid"
                  }`}
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("title")}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Job Position Title:</label>
              <input
                type="text"
                name="positionTitle"
                className={`form-control ${getErrorForField("positionTitle") === undefined
                  ? ""
                  : "is-invalid"
                  }`}
                value={formData.positionTitle}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("positionTitle")}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Job Description:</label>
              <textarea
                className={`form-control ${getErrorForField("description") === undefined
                  ? ""
                  : "is-invalid"
                  }`}
                value={formData.description}
                name="description"
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("description")}
              </div>
            </div>

            <div className="mb-3">
              <input
                type="checkbox"
                className="form-check-input me-2"
                id="startDateEnabled"
                name="startDateEnabled"
                checked={formData.startDateEnabled}
                data-cast-type="check"
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <label className={`form-label`}>Starting Date For Job:</label>
              <input
                type="date"
                style={{ textAlign: "center" }}
                className={`form-control justify-content-center ${getErrorForField("startDate") === undefined || !formData.startDateEnabled ? "" : "is-invalid"}`}
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={isSubmitting || !formData.startDateEnabled}
              />
              <div className="invalid-feedback">
                {getErrorForField("startDate")}
              </div>
            </div>

            <div className="mb-3">
              <input
                type="checkbox"
                className="form-check-input me-2"
                id="dueDateEnabled"
                name="dueDateEnabled"
                checked={formData.dueDateEnabled}
                data-cast-type="check"
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <label className="form-label">Due Date for Applying:</label>
              <input
                style={{ textAlign: "center" }}
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-control ${getErrorForField("dueDate") === undefined || !formData.dueDateEnabled ? "" : "is-invalid"}`}
                disabled={isSubmitting || !formData.dueDateEnabled}
              />
              <div className="invalid-feedback">
                {getErrorForField("dueDate")}
              </div>
            </div>
            <div className="mt-3 p-3 border rounded bg-light">
              <div className="mb-3">
                <label className="form-label">Compensation Type:</label>
                <select
                  className={`form-select ${true ? "" : "is-invalid"}`}
                  name="compensationType"
                  value={formData.compensationType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ textAlign: "center" }}
                >
                  <option value="do-not-disclose">Do Not Disclose</option>
                  <option value="salary">Salary</option>
                  <option value="hourly">Hourly Wage</option>
                </select>
              </div>

              {formData.compensationType !== "do-not-disclose" && (
                <div className="mb-3">
                  <label className="form-label">
                    {formData.compensationType === "salary" ? "Salary" : "Hourly Wage"}:
                  </label>
                  <input
                    type="number"
                    className={`form-control ${getErrorForField("salary") === undefined
                      ? ""
                      : "is-invalid"
                      }`}
                    value={formData.salary == 0 ? "" : formData.salary}
                    name="salary"
                    data-cast-type="number"
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <div className="invalid-feedback">
                    {getErrorForField("salary")}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Location:</label>
              <input
                type="text"
                className={`form-control ${getErrorForField("location") === undefined ? "" : "is-invalid"
                  }`}
                value={formData.location}
                name="location"
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="invalid-feedback">
                {getErrorForField("location")}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Skills (comma-separated):</label>
              <textarea
                className="form-control"
                name="skills"
                value={formData.skills}
                data-cast-type="array"
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Education (comma-separated):</label>
              <textarea
                className="form-control"
                name="education"
                value={formData.education}
                data-cast-type="array"
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <div
                className={`d-flex justify-content-center align-items-center  ${getErrorForField("jobType") === undefined ? "" : "is-invalid"
                  }`}
              >
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
                          checked={formData.jobType === value}
                          onChange={handleChange}
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
                {getErrorForField("jobType") === undefined
                  ? ""
                  : "Employment type is required!"}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              Create Job Posting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateJobPost;
