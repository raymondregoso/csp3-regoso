// Dependencies
import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Banner({ data }) {
  const { title, content, destination, label } = data;

  // Access the user context
  const userContext = useContext(UserContext);

  // Check if the user is an admin
  const isAdmin = userContext.user.isAdmin;

  return (
    <Row>
      <Col className="p-5 text-center text-white">
        <h1 className="banner-title">{title}</h1>
        <p className="banner-content">{content}</p>
        {isAdmin ? (
          <button className="btn btn-secondary btn-lg mx-auto" disabled>
            Admin Mode
          </button>
        ) : (
          <Link
            className="btn btn-primary btn-lg"
            to={destination}
            style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            {label}
          </Link>
        )}
      </Col>
    </Row>
  );
}
