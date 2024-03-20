import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default function Highlights() {
  return (
    <Row className="mt-3 mb-3">
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3" style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <Card.Body>
            <Card.Title>
              <h2>Unmatched Performance, Unrivaled Style</h2>
            </Card.Title>
            <Card.Text>
              Discover a world of possibilities with our handpicked collection of laptops. Whether you're a tech enthusiast, a professional on the go, or a student navigating the digital landscape, MonLexi Gadgets has the perfect laptop for you.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3" style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <Card.Body>
            <Card.Title>
              <h2>Top Brands, Endless Choices</h2>
            </Card.Title>
            <Card.Text>
              We've partnered with renowned brands to bring you a curated range of laptops that cater to every need. From sleek ultrabooks to powerful gaming machines, each laptop in our collection is a testament to quality, performance, and style.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3" style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <Card.Body>
            <Card.Title>
              <h2>Your Trusted Tech Companion</h2>
            </Card.Title>
            <Card.Text>
              At MonLexi Gadgets, we understand the importance of a reliable tech companion. That's why we meticulously select laptops that not only meet but exceed industry standards. Expect nothing less than top-notch performance, cutting-edge features, and the latest in design trends.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
