//Dependencies
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import imagesData from '../data/images'; 
import Footer from '../components/Footer';

const ProductView = () => {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0, 
  });

  const [quantity, setQuantity] = useState(1);
  const [isProductInStock, setIsProductInStock] = useState(true);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product data. Server response: ${await response.text()}`);
      }
      const data = await response.json();
      setProduct(data);

      // Check if the product is in stock
      setIsProductInStock(data.quantity > 0);
    } catch (error) {
      console.error('Error fetching product data:', error.message);
      // Handle error - you may want to redirect to an error page or display an error message
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const handlePurchase = async (isBuy) => {
    if (!isProductInStock) {
      Swal.fire({
        title: 'Product Out of Stock',
        icon: 'error',
        text: 'This product is currently out of stock. Please try again later.',
      });
      return;
    }

    const endpoint = isBuy ? 'orders/addToOrder' : 'orders/addToCart';
    const successMessage = isBuy ? 'Product added to Cart' : 'Added to Cart';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: productId,
          userId: user.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to ${isBuy ? 'purchase' : 'add to cart'}. Server response: ${errorMessage}`);
      }

      const data = await response.json();

      Swal.fire({
        title: successMessage,
        icon: 'success',
        text: `You have ${isBuy ? 'successfully added to cart' : 'added to cart'} this product.`,
      });

      if (isBuy) {
        navigate('/mycart');
      }
    } catch (error) {
      console.error(`Error during ${isBuy ? 'purchase' : 'add to cart'}:`, error.message);

      Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
        text: 'Please try again.',
      });
    }
  };

  const handleOutOfStock = async () => {
    if (!isProductInStock) {
      Swal.fire({
        title: 'Product Out of Stock',
        icon: 'error',
        text: 'This product is currently out of stock. Please try again later.',
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/addToWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: productId,
          userId: user.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add to cart. Server response: ${errorMessage}`);
      }

      Swal.fire({
        title: 'Added to Cart',
        icon: 'success',
        text: 'You have successfully added this product to your cart.',
      });
    } catch (error) {
      console.error('Error adding to cart:', error.message);

      Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
        text: 'Please try again.',
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Find the matching image based on product name
  const matchingImage = imagesData.find((image) =>
    product.name.toLowerCase().includes(image.name.toLowerCase())
  );

  return (
    <>
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg">
            <Card.Img
              variant="top"
              src={matchingImage?.imageUrl}
              alt={product.name}
              style={{ objectFit: 'contain', height: '300px' }}
            />
            <Card.Body className="text-center">
              <Card.Title><span style={{ color: 'blue' }}>{product.name} </span></Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{product.description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {product.price}</Card.Text>
              <Card.Subtitle>Stock:</Card.Subtitle>
              <span style={{ color: 'blue' }}>Stock remaining:</span> {product.quantity}
              <Form.Group className="mb-3">
                <Form.Label>Quantity:</Form.Label>
                <div className="d-flex justify-content-center align-items-center">
                  <Button variant="outline-primary" onClick={decrementQuantity} disabled={!isProductInStock}>
                    -
                  </Button>
                  <div className="mx-2">{quantity}</div>
                  <Button variant="outline-primary" onClick={incrementQuantity} disabled={!isProductInStock}>
                    +
                  </Button>
                </div>
              </Form.Group>
              {user.id !== null ? (
                <>
                  {isProductInStock ? (
                    <>
                      <Button
                        className="mx-2 shadow"
                        variant="primary"
                        block
                        onClick={() => handlePurchase(false)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        className="mx-2 shadow"
                        variant="success"
                        block
                        onClick={() => handlePurchase(true)}
                      >
                        Buy Now
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="mx-2 shadow"
                      variant="primary"
                      block
                      onClick={handleOutOfStock}
                    >
                      Add to Cart
                    </Button>
                  )}
                </>
              ) : (
                <Link className="btn btn-danger btn-block" to="/login">
                  Log in to Buy
                </Link>
              )}
              <Button
                className="mx-2 shadow"
                variant="info"
                block
                onClick={() => navigate('/products')}
              >
                Change Product
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
};

export default ProductView;
