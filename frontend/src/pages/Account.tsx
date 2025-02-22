import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/user'; // Assuming you're using a custom hook to get user data

const Account = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [experience, setExperience] = useState(user?.experience || []);
  const [education, setEducation] = useState(user?.education || []);
  const [skills, setSkills] = useState(user?.skills || []);

  const handleBack = async () => {
    navigate('/');
  };

  const handleSubmit = () => {
    //let updatedExperience = [...experience];
    //let updatedEducation = [...education];
    //let updatedSkills = [...skills];

    // You would need to implement a function here to handle updating the profile in your system

    navigate('/');
  };

  const addExperience = () => {
    setExperience([...experience, '']); // Add an empty string to start editing new experience
  };

  const addEducation = () => {
    setEducation([...education, '']); // Add an empty string to start editing new education
  };

  const addSkill = () => {
    setSkills([...skills, '']); // Add an empty string to start editing new skill
  };

  return (
    <div>
      {/* Displaying user information in a box */}
      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>User Info</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email Address:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.userRole}</p>
      </div>

      {/* Experience Input Section */}
      <h4>Experience</h4>
      {experience.map((exp, index) => (
        <div key={index} className="input-container">
          <input
            type="text"
            className="form-control"
            defaultValue={exp}
            onChange={(e) => {
              const updatedExperience = [...experience];
              updatedExperience[index] = e.target.value;
              setExperience(updatedExperience);
            }}
          />
        </div>
      ))}
      <Button variant="outline-primary" onClick={addExperience}>Add More Experience</Button>

      {/* Education Input Section */}
      <h4>Education</h4>
      {education.map((edu, index) => (
        <div key={index} className="input-container">
          <input
            type="text"
            className="form-control"
            defaultValue={edu}
            onChange={(e) => {
              const updatedEducation = [...education];
              updatedEducation[index] = e.target.value;
              setEducation(updatedEducation);
            }}
          />
        </div>
      ))}
      <Button variant="outline-primary" onClick={addEducation}>Add More Education</Button>

      {/* Skills Input Section */}
      <h4>Skills</h4>
      {skills.map((skill, index) => (
        <div key={index} className="input-container">
          <input
            type="text"
            className="form-control"
            defaultValue={skill}
            onChange={(e) => {
              const updatedSkills = [...skills];
              updatedSkills[index] = e.target.value;
              setSkills(updatedSkills);
            }}
          />
        </div>
      ))}
      <Button variant="outline-primary" onClick={addSkill}>Add More Skills</Button>

      {/* Form Submission */}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={handleSubmit}>Confirm</Button>
        <Button onClick={handleBack} variant="secondary" style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Account;
