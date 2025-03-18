import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

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


const ApplicationPopupComponent: React.FC<ApplicationPopupComponentProps> = ({show, username, email, experience, education, skills, resume_id, onClose, showResumeHandler}) => {
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
            </Modal.Body>
    
            <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button onClick={() => showResumeHandler(resume_id)} variant="primary">View Resume</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </Modal>
  );
};

export default ApplicationPopupComponent;