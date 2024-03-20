//Dependencies
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const UpdateProfile = ({ user, fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.firstName) {
      setFirstName(user.firstName);
    }
    if (user && user.lastName) {
      setLastName(user.lastName);
    }
    if (user && user.mobileNo) {
      setMobileNo(user.mobileNo);
    }
  }, [user]);

  const handleClose = () => setShowModal(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          mobileNo: mobileNo,
        }),
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
        if (fetchData) {
          fetchData();
        }
        handleClose(); 

  
        Swal.fire('Success!', 'Profile updated successfully', 'success');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'An error occurred.'}`);
        console.error('Update Profile Error:', errorData);


        Swal.fire('Error!', `Update failed: ${errorData.message || 'An error occurred.'}`, 'error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Update Profile Error:', error);


      Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
    }
  };

  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" 
        onClick={handleShow} 
        style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
        >
        Edit Profile
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleUpdateProfile}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                required
              />
            </Form.Group>
            {message && <div className="alert alert-danger">{message}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateProfile;
