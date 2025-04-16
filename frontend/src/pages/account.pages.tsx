import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUser, { USER } from "../hooks/user.hooks";
import { updateUser } from "../lib/api.lib";
import { IoAddCircle, IoTrashBin } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // State for role-based fields
  const [exp, setexp] = useState<string[]>(user?.experience || []);
  const [educ, seteduc] = useState<string[]>(user?.education || []);
  const [userSkills, setuserSkills] = useState<string[]>(user?.skills || []);
  const [compDetails, setcompDetails] = useState<string>(user?.companyDetails || "");
  const [hireDetails, sethireDetails] = useState<string[]>(user?.hiringDetails || []);

  // New fields for phoneNumber & userLink
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || "");
  const [userLink, setUserLink] = useState<string>(user?.userlink || "");

  /*
  useEffect to set initial values for the fields
  This will run when the component mounts and whenever the user object changes.
  */
  useEffect(() => {
    if (user) {
      setexp(user.experience || []);
      seteduc(user.education || []);
      setuserSkills(user.skills || []);
      setcompDetails(user.companyDetails || "");
      sethireDetails(user.hiringDetails || []);
      setPhoneNumber(user.phoneNumber || "");
      setUserLink(user.userlink || "");
    }
  }, [user]);

  const handleBack = () => navigate("/");

  /*
  Mutation to update user details
  This mutation will be triggered when the user clicks the "Confirm" button.
   */
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Updating user with data:", {
        experience: exp,
        education: educ,
        skills: userSkills,
        hiringDetails: hireDetails,
        companyDetails: compDetails,
        phoneNumber,
        userLink,
      });

      return updateUser({
        experience: exp,
        education: educ,
        skills: userSkills,
        hiringDetails: hireDetails,
        companyDetails: compDetails,
        preference: -1,
        phoneNumber: phoneNumber,
        userlink: userLink,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER] });
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to update user. Please try again.");
    },
  });

  /* Handle form submission
  This function will be called when the user clicks the "Confirm" button.
  It will trigger the mutation to update the user details.
  */
  const handleSubmit = async () => {
    setError(null);
    mutation.mutate();
  };


  /* Handle array changes
  This function will be called when the user adds or removes items from the experience, education, or skills arrays.
  It updates the respective state with the new value.
  */
  const handleArrayChange = (index: number, value: string, setter: Function) => {
    setter((prev: string[]) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Handle adding and removing items from the arrays
  const handleAddItem = (setter: Function) => setter((prev: string[]) => [...prev, ""]);

  // Handle removing items from the arrays
  const handleRemoveItem = (index: number, setter: Function) => setter((prev: string[]) => prev.filter((_, i) => i !== index));

  return (
    <div className="mt-5">
      <Container className="mt-4 p-4 border rounded shadow bg-light">
      {error && <Alert variant="danger">{error}</Alert>}
        <Card className="p-3 mb-4 shadow-sm">
          <h3>User Account Info</h3>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email Address:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.userRole}</p>
        </Card>

        {/* Phone Number */}
        <Card className="p-3 mb-4 shadow-sm">
          <h4>Phone Number</h4>
          <Form.Control
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
        </Card>

        {/* User Profile / Website Link */}
        <Card className="p-3 mb-4 shadow-sm">
          <h4>Profile or Website Link</h4>
          <Form.Control
            type="text"
            value={userLink}
            onChange={(e) => setUserLink(e.target.value)}
            placeholder="Enter your profile or website URL"
          />
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
          <Button onClick={handleSubmit} className="me-2" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Confirm"}
          </Button>
          <Button onClick={handleBack} variant="secondary">Cancel</Button>
        </div>
      </Container>
    </div>
  );
};

export default Account;
