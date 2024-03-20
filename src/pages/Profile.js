//Dependencies
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';
import profileImages from '../data/profileImage';
import Footer from '../components/Footer'

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});

  useEffect(() => {
    // Fetch user details only if the user is authenticated
    if (user.id) {
      fetchUserDetails();
    }
  }, [user.id]);

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

  const getProfileImage = (email) => {
    const matchingImage = profileImages.find((image) => email.toLowerCase().includes(image.email.toLowerCase()));
    const imageUrl = matchingImage ? matchingImage.imageUrl : 'https://i.postimg.cc/KYvH70F8/default-profileimage.png';
    return imageUrl;
  };

  return (
    <>
      {user.id === null ? (
        <Navigate to="/profile" />
      ) : (
        <>
          <Row>
            <Col className="p-5 text-white">
              <h2 className="my-5" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>My Profile</h2>
              {details.email && (
                <img
                  src={getProfileImage(details.email)}
                  alt="Profile"
                  style={{ maxWidth: '250px', maxHeight: '250px', borderRadius: '50%', marginTop: '10px' }}
                />
              )}
              <h3 className="mt-3"  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{`${details.firstName} ${details.lastName}`}</h3>
              <hr />
              <h4  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Contacts</h4>
              <ul>
                <li  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Email: {details.email}</li>
                <li  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Mobile No: {details.mobileNo}</li>
              </ul>
              
            </Col>
          </Row>
          <Row className="pt-4 mt-4">
            <Col>
              <UpdateProfile user={details} fetchData={fetchUserDetails} />
              <div className="mt-3">
                <ResetPassword />
              </div>
            </Col>
          </Row>
        </>
      )}
      <Footer />
    </>
  );
}
