import React, { useState } from "react";
const PORT = 5500 // TEMPORARY SOLUTION, NEEDS TO CHANGE LATER

 
const CreateJobPost: React.FC = () => {

  const [postingTitle, setPostingTitle] = useState<string>("");
  const [positionTitle, setPositionTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [compensationType, setCompensationType] = useState<
    "salary" | "hourly" | "do-not-disclose"
  >("do-not-disclose");
  const [compensationAmount, setCompensationAmount] = useState<number>(0);
  const [jobType, setJobType] = useState<string>("");


  // Feed back errors, allowing user to know what information is invalid
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const getErrorForField = (field: string) => {
    return errors.find((err) => err.field === field)?.message;
  };

  // Reset error
  const resetErrors = () => {
    setErrors([]); // Reset errors to an empty array
  };

 
  // Create posting button clicked
  const handleSubmit = async ( e: React.FormEvent) => {
    e.preventDefault();
    const formData = {

        "title": postingTitle,
        "positionTitle": positionTitle,
        "compensationType": compensationType,
        "description": description,
        "employer": "ASDASDSA",
        "employer_id": "ASDASDSA",
        "location": location,
        "salary": 0,
        "jobType": "",
        "experience": [],
        "skills": [],
        "education": [],
        "deadline": 0,     
        "status": "Open",
    }
    
    console.log(`Sending a create job post to http://localhost:${PORT}/job/add`);

    try {
      const response = await fetch(`http://localhost:${PORT}/job/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Validation Error") {
          setErrors(errorData.details); // Set validation errors
          console.log("Received Validation error: ")
          console.log(errorData)

        } else {
          console.error("Server error:", errorData);
        }
        return;
      }
      else
      {
        resetErrors(); // Set validation errors
        console.log("Job post created and okay response received!")
      }
  
    }
    catch(error)
    {
      console.log("Error detected : ")
      console.log(error);
    }

  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">Create Job Posting</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Posting Title:</label>
              <input
                type="text"
                className={`form-control ${getErrorForField("title") === undefined ? "" : "is-invalid"
                  }`}
                value={postingTitle}
                onChange={(e) => setPostingTitle(e.target.value)}
              />
              <div className="invalid-feedback">{getErrorForField("title")}</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Position Name:</label>
              <input
                type="text"
                className={`form-control ${getErrorForField("positionTitle") === undefined ? "" : "is-invalid"
                  }`}
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
              />
              <div className="invalid-feedback">{getErrorForField("positionTitle")}</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Job Description:</label>
              <textarea
                className={`form-control ${getErrorForField("description") === undefined ? "" : "is-invalid"
                  }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="invalid-feedback">{getErrorForField("description")}</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Starting Date For Job:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Due Date for Applying:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`form-control ${true ? "" : "is-invalid"
                  }`}
              />
            </div>

            <div  className="mt-3 p-3 border rounded bg-light">
            <div className="mb-3">
              <label className="form-label">Compensation Type:</label>
              <select
                className={`form-select ${true ? "" : "is-invalid"
                  }`}
                value={compensationType}
                onChange={(e) =>
                {
                  setCompensationType(
                    e.target.value as "salary" | "hourly" | "do-not-disclose"
                  )
     
                }
                }
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
                  className={`form-control ${ false ? "" : "is-invalid"
                    }`}
                  value={compensationAmount == 0 ? "" : compensationAmount}
                  onChange={(e) =>
                    setCompensationAmount(Number(e.target.value))
                  }
                />
                <div className="invalid-feedback">{}</div>
              </div>
            )}
            </div>

            

            <div className="mb-3">
              <label className="form-label">Location:</label>
              <input
                type="text"
                className={`form-control ${getErrorForField("location") === undefined ? "" : "is-invalid"
                }`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="invalid-feedback">{getErrorForField("location") }</div>

            </div>

            <div className="mb-3">
              <label className="form-label">
                Requirements (comma-separated):
              </label>
              <textarea
                className="form-control"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tags (comma-separated):</label>
              <textarea
                className="form-control"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="mb-3">


  <label className="form-label">What type of Employment is it?</label>
  <div>
    <div className="form-check">
      <input
        type="radio"
        className="form-check-input"
        id="fullTime"
        name="jobType"
        value="full-time"
        checked={jobType === "full-time"}
        onChange={(e) => setJobType(e.target.value)}
      />
      <label className="form-check-label" htmlFor="fullTime">
        Full-time
      </label>
    </div>
    <div className="form-check">
      <input
        type="radio"
        className="form-check-input"
        id="partTime"
        name="jobType"
        value="part-time"
        checked={jobType === "part-time"}
        onChange={(e) => setJobType(e.target.value)}
      />
      <label className="form-check-label" htmlFor="partTime">
        Part-time
      </label>
    </div>
    <div className="form-check">
      <input
        type="radio"
        className="form-check-input"
        id="temporary"
        name="jobType"
        value="temporary"
        checked={jobType === "temporary"}
        onChange={(e) => setJobType(e.target.value)}
      />
      <label className="form-check-label" htmlFor="temporary">
        Temporary
      </label>
    </div>
    <div className="form-check">
      <input
        type="radio"
        className="form-check-input"
        id="internship"
        name="jobType"
        value="internship"
        checked={jobType === "internship"}
        onChange={(e) => setJobType(e.target.value)}
      />
      <label className="form-check-label" htmlFor="internship">
        Internship
      </label>
    </div>
  </div>
</div>

            <button type="submit" className="btn btn-primary w-100">
              Create Job Posting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;