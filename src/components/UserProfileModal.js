import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Person, Envelope, BoxArrowRight } from 'react-bootstrap-icons';
import { useAuth } from '../auth/auth';

const UserProfileModal = ({ show, onHide, user }) => {
    const { logout } = useAuth();
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
         
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center pt-0">
         <div 
            style={{
              backgroundColor: 'tomato',
              color: 'white',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 auto 15px'
            }}
          >
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <h5 className="mb-0">{user?.first_name} {user?.last_name}</h5>
        <div className="d-flex align-items-center justify-content-center mb-3">
          <Envelope className="me-2 text-muted" />
          <span>{user?.email}</span>
        </div>
        
        <Button 
          variant="outline-danger" 
          className="w-100 mt-3"
          onClick={logout}
        >
          <BoxArrowRight className="me-2" />
          Logout
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfileModal;