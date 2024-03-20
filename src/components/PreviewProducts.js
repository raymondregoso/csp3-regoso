// Dependencies
import React, { useContext } from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function PreviewProducts({ data, breakPoint, imageUrl, style }) {
  // Destructure the data object
  const { _id, name, description, price, quantity } = data;

  // Access the user context
  const userContext = useContext(UserContext);

  // Check if the user is an admin
  const isAdmin = userContext.user.isAdmin;

  return (
    <Col xs={12} md={6} lg={6} xl={2}>
      <Card className="cardHighlight mx-2" style={style}>
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={name}
          style={{ objectFit: 'cover', height: '100%' }}
          className="product-image"
        />
        <Card.Body>
          <Card.Title className="text-center">
            <Link to={`/products/${_id}`}>{name}</Link>
          </Card.Title>
          <Card.Text>{description}</Card.Text>
          <Card.Text>Stock: {quantity}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <h5 className="text-center">₱{price}</h5>
          {/* Conditionally render the Details button based on user role */}
          {isAdmin ? (
            <button className="btn btn-secondary d-block mx-auto" disabled>
             Admin Mode
            </button>
          ) : (
            <Link className="btn btn-primary d-block" to={`/products/${_id}`}>
              Details
            </Link>
          )}
        </Card.Footer>
      </Card>
    </Col>
  );
}
