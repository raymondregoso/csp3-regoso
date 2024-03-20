import { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Footer from '../components/Footer'

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
    e.preventDefault();
    //Fetch data users/logins by using POST method
    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);

          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            text: 'Welcome to MonLexi Gadgets',
          });
        } else {
          Swal.fire({
            title: 'Authentication failed',
            icon: 'error',
            text: 'Check your login details and try again',
          });
        }
      });

    setEmail('');
    setPassword('');
  }

  //Fetch data to retrieve user details
  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  };

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  return (
  <>
  {user.id !== null ? (
    //If there is no logged in user, when you manually type "/env/login" will automaticall redirect to /product page.
    <Navigate to="/products" />
  ) : (
    <Row className="my-5 justify-content-center">
      <Col md={4}>
        <div className="login-form-container" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
          <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="text-center mb-4" style={{ color: '#1877f2' }}>Log In</h1>
            <Form.Group controlId="userEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '15px', height: '40px' }}
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '15px', height: '40px' }}
                required
              />
            </Form.Group>

            {isActive ? (
              <Button variant="primary" type="submit" id="submitBtn" style={{ width: '100%', height: '40px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                Log In
              </Button>
            ) : (
              <Button variant="primary" type="submit" id="submitBtn" style={{ width: '100%', height: '40px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} disabled>
                Log In
              </Button>
            )}

            <div className="mb-3 mt-3">
              <Button variant="success" as={Link} to="/register" style={{ fontSize: '16px', width: '100%', height: '40px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                Create a new account
              </Button>
            </div>
           </Form>
        </div>
      </Col>
    </Row>
  )}
  <Footer />
  </>
  );
}
