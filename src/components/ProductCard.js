//Dependencies
import React, { useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import imagesData from '../data/images';

export default function ProductCard({ productProp }) {
  const { _id, name, description, price } = productProp;
  const [expanded, setExpanded] = useState(false);

  // Find the matching image based on product name
  const matchingImage = imagesData.find((image) =>
    name.toLowerCase().includes(image.name.toLowerCase())
  );

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <Col xs={12} md={6} className="mb-4"> 
      <Card style={{ width: '300px', height: '400px' }}>
        <Card.Img
          variant="top"
          src={matchingImage?.imageUrl}
          alt={name}
          style={{ objectFit: 'contain', height: '200px' }}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="text-center">{name}</Card.Title>
            <Card.Subtitle>Description:</Card.Subtitle>
            <Card.Text style={{ fontSize: '14px' }}>
              {expanded ? description : `${description.substring(0, 70)}... `}
              {description.length > 70 && (
                <button
                  className="btn btn-link p-0"
                  onClick={toggleDescription}
                >
                  {expanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </Card.Text>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text style={{ marginTop: '-2px' }}>Php {price}</Card.Text>
            </div>
            <div>
              <Link
                className="btn btn-primary"
                to={`/products/${_id}`}
                style={{ width: '150px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
              >
                Details
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

ProductCard.propTypes = {
  productProp: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
};
