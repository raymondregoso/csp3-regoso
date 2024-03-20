//Dependendies
import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Container>
        <Row>
          <Col className="text-center text-white" bg="primary">
            <p>&copy; 2024 MonLexi Gadgets. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
