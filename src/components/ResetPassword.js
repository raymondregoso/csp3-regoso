import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      //Fetch data users by using PUT method to reset the password.
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: password,
        }),
      });

      if (response.ok) {
        setMessage('Password reset successfully');
        setPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
        handleClose();
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Password reset successfully',
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: errorData.message || 'An error occurred.',
        });
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'An error occurred. Please try again.',
      });
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
     <>
      <Button 
        variant="warning" 
        onClick={handleShow}
        style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }} 
      >
        Reset Password
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleResetPassword}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'} 
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'} 
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && <div className="alert alert-danger">{message}</div>}
            <Form.Check
              type="checkbox"
              label="Show Password"
              onChange={() => setShowPassword(!showPassword)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Reset Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPassword;
