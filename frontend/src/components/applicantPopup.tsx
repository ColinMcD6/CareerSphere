import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ApplicationPopupComponentProps {
    show: boolean;
    username: string;
    email: string;
    experience: string[];
    education: string[];
    skills: string[];
    resume_id: string;
    showResumeHandler: (resume_id: string) => void;
    editStatusApplicationHandler: (status:string) => void;
    onClose: () => void;
    
}


const ApplicationPopupComponent: React.FC<ApplicationPopupComponentProps> = ({show, username, email, experience, education, skills, resume_id, onClose, showResumeHandler, editStatusApplicationHandler}) => {
  return (
    <Modal show={show} onHide={onClose}>
        <Modal.Dialog>
            <Modal.Header closeButton>
            <Modal.Title>Applicant Details</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
            <p>Experience: {experience.join(", ")}</p>
            <p>Education: {education.join(", ")}</p>
            <p>Skills: {skills.join(", ")}</p>
            <Button onClick={() => showResumeHandler(resume_id)} variant="primary">View Resume</Button>
            </Modal.Body>
    
            <Modal.Footer>
            <Button onClick={() => editStatusApplicationHandler("Accepted")} variant="success">Accept</Button>
            <Button onClick={() => editStatusApplicationHandler("Rejected")} variant="danger">Reject</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </Modal>
  );
};

export default ApplicationPopupComponent;