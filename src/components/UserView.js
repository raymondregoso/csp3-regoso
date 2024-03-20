//Dependencies
import { useState, useEffect } from 'react';
import { CardGroup, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';

export default function UserView({ productsData }) {
  const [activeProducts, setActiveProducts] = useState([]);

  useEffect(() => {
    // Filter and map active products
    const activeProductsArr = productsData
      .filter((product) => product.isActive)
      .map((product) => (
        <Col key={product._id} xs={12} md={6} lg={3}>
          <ProductCard productProp={product} />
        </Col>
      ));

    setActiveProducts(activeProductsArr);
  }, [productsData]);

  return (
    <>
      <Row className="mb-3 d=fl">
        <Col md={6}>
          <ProductSearch />
        </Col>
      </Row>
      <CardGroup className="justify-content-center mt-4">
        <Row>{activeProducts}</Row>
      </CardGroup>
    </>
  );
}
