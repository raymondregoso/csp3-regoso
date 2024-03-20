import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function Register() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      mobileNo !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  async function checkEmailExists(emailToCheck) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/checkEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Email Exists:', data.exists);
      return data.exists;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  async function registerUserHandler(e) {
    e.preventDefault();

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      Swal.fire({
        title: 'Registration Failed',
        icon: 'error',
        text: 'Email is already registered. Please use a different email.',
      });
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            mobileNo,
            password,
          }),
        });

        const data = await response.json();

        if (data) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setMobileNo('');
          setPassword('');
          setConfirmPassword('');

          Swal.fire({
            title: 'Registration Successful!',
            icon: 'success',
            text: 'Thank you for registering!',
          }).then(() => {
            navigate('/login');
          });
        } else {
          Swal.fire({
            title: 'Registration Failed',
            icon: 'error',
            text: 'Please try again later.',
          });
        }
      } catch (error) {
        console.error('Error during registration:', error);
        Swal.fire({
          title: 'Registration Failed',
          icon: 'error',
          text: 'Please try again later.',
        });
      }
    }
  }

  return (
    <>
      {user.id !== null ? (
        <Navigate to="/products" />
      ) : (
        <Form
          onSubmit={(e) => registerUserHandler(e)}
          className="border rounded p-4 mt-5"
          style={{
            maxWidth: '400px',
            margin: 'auto',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h1 className="my-5 text-center text-primary">Register</h1>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>First Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Last Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Mobile No:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter 11 Digit No."
              required
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <div className="mt-3">
            {isActive ? (
              <Button
                variant="primary"
                type="submit"
                id="submitBtn"
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  backgroundColor: '#1877f2',
                  borderColor: '#1877f2',
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="danger"
                type="submit"
                id="submitBtn"
                disabled
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  backgroundColor: '#d9534f',
                  borderColor: '#d9534f',
                }}
              >
                Submit
              </Button>
            )}
          </div>
        </Form>
      )}
      <Footer />
    </>
  );
}
