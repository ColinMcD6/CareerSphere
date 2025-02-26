import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUser, { USER } from "../hooks/user";
import { updateUser } from "../lib/api";
import { IoAddCircle, IoTrashBin } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";

const Account = () => {
  
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // State for role-based fields
  const [exp, setexp] = useState<string[]>(user?.experience || []);
  const [educ, seteduc] = useState<string[]>(user?.education || []);
  const [userSkills, setuserSkills] = useState<string[]>(user?.skills || []);
  const [compDetails, setcompDetails] = useState<string>(user?.companyDetails || "");
  const [hireDetails, sethireDetails] = useState<string[]>(user?.hiringDetails || []); 

  // Sync state when user updates - added to update user fields even on page refresh
  useEffect(() => {
    if (user) {
      setexp(user.experience || []);
      seteduc(user.education || []);
      setuserSkills(user.skills || []);
      setcompDetails(user.companyDetails || "");
      sethireDetails(user.hiringDetails || []);
    }
  }, [user]);

  const handleBack = () => navigate("/");

  const handleSubmit = async () => {
    try {
      console.log("Updating user with data:", {
        experience: exp,
        education: educ,
        skills: userSkills,
        hiringDetails: hireDetails,
        companyDetails: compDetails
      });
      await updateUser({
        experience: exp,
        education: educ,
        skills: userSkills,
        hiringDetails: hireDetails,
        companyDetails: compDetails
      });
      // clear the cache so that user details are fetched again from database when user press submits and updates db value
      queryClient.invalidateQueries({ queryKey: [USER] });

      navigate("/");
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(`Failed to update user. Please try again. ${error.message}`);
    }
  };

  const handleArrayChange = (index: number, value: string, setter: Function) => {
    setter((prev: string[]) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddItem = (setter: Function) => setter((prev: string[]) => [...prev, ""]);
  const handleRemoveItem = (index: number, setter: Function) =>
    setter((prev: string[]) => prev.filter((_, i) => i !== index));

  return (
    <div className="className= mt-5">
    <Container className="mt-4 p-4 border rounded shadow bg-light">
      <Card className="p-3 mb-4 shadow-sm">
        <h3>User Account Info</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email Address:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.userRole}</p>
      </Card>
      {user?.userRole === "Candidate" && (
        <>
          <Card className="p-3 mb-4 shadow-sm">
            <h4>User Experience</h4>
            {exp.map((exp, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={exp}
                  onChange={(e) => handleArrayChange(index, e.target.value, setexp)}
                  className="me-2"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index, setexp)}>
                  <IoTrashBin size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" onClick={() => handleAddItem(setexp)}>
              <IoAddCircle size={16} /> Add Experience
            </Button>
          </Card>
          
          <Card className="p-3 mb-4 shadow-sm">
            <h4>User Education</h4>
            {educ.map((edu, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={edu}
                  onChange={(e) => handleArrayChange(index, e.target.value, seteduc)}
                  className="me-2"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index, seteduc)}>
                  <IoTrashBin size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" onClick={() => handleAddItem(seteduc)}>
              <IoAddCircle size={16} /> Add Education
            </Button>
          </Card>

          <Card className="p-3 mb-4 shadow-sm">
            <h4>User Skills</h4>
            {userSkills.map((skill, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange(index, e.target.value, setuserSkills)}
                  className="me-2"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index, setuserSkills)}>
                  <IoTrashBin size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" onClick={() => handleAddItem(setuserSkills)}>
              <IoAddCircle size={16} /> Add Skill
            </Button>
          </Card>
        </>
      )}
      {user?.userRole === "Employer" && (
        <>
          <Card className="p-3 mb-4 shadow-sm">
            <h4>Company Details</h4>
            <Form.Control
              type="text"
              value={compDetails}
              onChange={(e) => setcompDetails(e.target.value)}
            />
          </Card>
          
          <Card className="p-3 mb-4 shadow-sm">
            <h4>Job Hiring Details</h4>
            {hireDetails.map((detail, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={detail}
                  onChange={(e) => handleArrayChange(index, e.target.value, sethireDetails)}
                  className="me-2"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index, sethireDetails)}>
                  <IoTrashBin size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" onClick={() => handleAddItem(sethireDetails)}>
              <IoAddCircle size={16} /> Add Another Hiring
            </Button>
          </Card>
        </>
      )}
      <div className="mt-4 d-flex justify-content-end">
        <Button onClick={handleSubmit} className="me-2">Confirm</Button>
        <Button onClick={handleBack} variant="secondary">Cancel</Button>
      </div>
    </Container>
    </div>
  );
};

export default Account;