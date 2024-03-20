//Dependencies
import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';
import profileImages from '../data/profileImage';

export default function AppNavBar() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});

  useEffect(() => {
    // Fetch user details only if the user is authenticated
    if (user.id) {
      fetchUserDetails();
    }
  }, [user.id]);

  // Fetch users details
  const fetchUserDetails = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setDetails(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  };

  // Images is only data from third party webside which is postimg.cc. The image is imported from ../data/profileImage'.
  // The profile image will match the email property in ../data/profileImage and the email of the logged-in user.
  const getProfileImage = (email) => {
    const matchingImage = profileImages.find((image) => email.toLowerCase().includes(image.email.toLowerCase()));
    const imageUrl = matchingImage ? matchingImage.imageUrl : 'https://i.postimg.cc/KYvH70F8/default-profileimage.png';
    return imageUrl;
  };

  return (
    <Navbar className="navbar-bg" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand id="navbar" href="#home" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          MonLexi Gadgets
        </Navbar.Brand>
         
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navlink ml-auto">
           
            <Nav.Link
              as={NavLink}
              to="/"
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/products"
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Products
            </Nav.Link>

            {user.id !== null ? (
              user.isAdmin ? (

              // This is for admin view only.
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/usermanagement"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    User Management
                  </Nav.Link>

                  <Nav.Link
                    as={NavLink}
                    to="/logout"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    Logout
                  </Nav.Link>
                  
                </>
              ) : (
              // This is for regular user view only.
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/mycart"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    MyCart
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/profile"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/checkout"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    View All Orders
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/logout"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                  >
                    Logout
                  </Nav.Link>
                  {user.id !== null && details.email && (
           <img
             src={getProfileImage(details.email)}
             alt="Profile"
             style={{ maxWidth: '55px', maxHeight: '55px', borderRadius: '50%', marginTop: '10px' }}
           />
         )}
                </>
              )
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          .navbar-nav.ml-auto {
            margin-left: auto;
          }
          .checkoutbtn {
            font-size: 1.5rem; 
            margin-right: 15px; 
          }
        `}
      </style>
    </Navbar>
  );
}
