import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface FormModalPopupComponentProps {
    show: boolean;
    handleClose: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    body: string;
    submitText: string;
    children?: React.ReactNode;


}


const FormModalPopupComponent: React.FC<FormModalPopupComponentProps> = ({ show, handleClose, handleSubmit, title, body, submitText, children}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="d-flex justify-content-center">
                <div className="w-100 text-center">
                  <Modal.Title>{title}</Modal.Title>
                </div>
              </Modal.Header>
      <Modal.Body>
        {body}
        <form onSubmit={handleSubmit}>
            {children}
            <Modal.Footer className='d-flex justify-content-center align-items-center'>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit">
                    {submitText}
                </Button>
            </Modal.Footer>
        </form>
      </Modal.Body>
        
      
    </Modal>
  );
};

export default FormModalPopupComponent;