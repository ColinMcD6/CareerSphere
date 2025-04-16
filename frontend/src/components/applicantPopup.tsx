import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ApplicationPopupComponentProps {
    show: boolean;
    username: string;
    email: string;
    experience: string[];
    education: string[];
    skills: string[];
    resumeId: string;
    showResumeHandler: (resumeId: string) => void;
    editStatusApplicationHandler: (status:string) => void;
    onClose: () => void;
    
}


const ApplicationPopupComponent: React.FC<ApplicationPopupComponentProps> = ({show, username, email, experience, education, skills, resumeId, onClose, showResumeHandler, editStatusApplicationHandler}) => {
  return (
    <Modal show={show} onHide={onClose}>
        
        <Modal.Header closeButton className="d-flex justify-content-center">
          <div className="w-100 text-center">
            <Modal.Title>Applicant Details</Modal.Title>
          </div>
        </Modal.Header>
    
            <Modal.Body>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
            <p>Experience: {experience.join(", ")}</p>
            <p>Education: {education.join(", ")}</p>
            <p>Skills: {skills.join(", ")}</p>
            <Button onClick={() => showResumeHandler(resumeId)} variant="primary">View Resume</Button>
            </Modal.Body>
    
            <Modal.Footer className='d-flex justify-content-center align-items-center'>
              <Button onClick={() => editStatusApplicationHandler("Accepted")} variant="success">Accept</Button>
              <Button onClick={() => editStatusApplicationHandler("Rejected")} variant="danger" className="ms-3">Reject</Button>
            </Modal.Footer>
        
    </Modal>
  );
};

export default ApplicationPopupComponent;