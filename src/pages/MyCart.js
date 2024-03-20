//Dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

const MyCart = () => {
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchCart = useCallback(async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/getCart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart. Server response: ${await response.text()}`);
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error.message);
    }
  }, []); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data. Server response: ${await response.text()}`);
        }

        const userData = await response.json();
        setUserId(userData._id);
        setUserData(userData);
        fetchCart(userData._id);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [fetchCart]);

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/removeCartItem/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to remove item from cart. Server response: ${await response.text()}`
        );
      }

      const updatedCart = await response.json();
      setCart(updatedCart);

      Swal.fire({
        title: 'Item Removed',
        icon: 'success',
        text: 'The item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Failed to remove item from cart. Please try again later.',
      });
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(productId)) {
        // Item is being unchecked
        console.log(`Quantity for product ${productId}: 0`);
        return prevSelectedItems.filter((item) => item !== productId);
      } else {
        // Item is being checked
        const quantity = cart.products.find((item) => item.productId === productId)?.quantity || 0;
        console.log(`Quantity for product ${productId}: ${quantity}`);
        return [...prevSelectedItems, productId];
      }
    });
  };

  const calculateSubtotal = () => {
    if (cart && cart.products.length > 0) {
      const selectedProducts = cart.products.filter((item) => selectedItems.includes(item.productId));
      console.log('Selected Products:', selectedProducts);

      const subtotal = selectedProducts.reduce(
        (subtotal, item) => subtotal + item.quantity * item.productDetails.price,
        0
      );
      console.log('Subtotal:', subtotal);

      return subtotal;
    }
    return 0;
  };

  const fetchProductQuantity = async (productId) => {
    try {
      // Fetch the quantity for the given productId from the cart.products array
      const quantity = cart.products.find((item) => item.productId === productId)?.quantity;
      return quantity || 0;
    } catch (error) {
      console.error('Error fetching product quantity:', error.message);
      return 0;
    }
  };

  // Modified fetchProductDetails function
  const fetchProductDetails = (productId) => {
    try {
      const productDetails = cart.products.find((item) => item.productId === productId)?.productDetails;

      if (!productDetails) {
        throw new Error('Product details not found');
      }

      return productDetails;
    } catch (error) {
      console.error('Error fetching product details:', error.message);
      return null;
    }
  };

  const handleIncrement = async (productId) => {
    try {
      // Update the quantity in the state
      setCart((prevCart) => {
        const updatedProducts = prevCart.products.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );

        return {
          ...prevCart,
          products: updatedProducts,
        };
      });

      // Implement logic to increase the quantity on the server
      console.log(`Increment quantity for product ${productId}`);
    } catch (error) {
      console.error('Error incrementing quantity:', error.message);
    }
  };

  const handleDecrement = async (productId) => {
    try {
      // Ensure the quantity does not go below 1
      setCart((prevCart) => {
        const updatedProducts = prevCart.products.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
        );

        return {
          ...prevCart,
          products: updatedProducts,
        };
      });

      // Implement logic to decrease the quantity on the server
      console.log(`Decrement quantity for product ${productId}`);
    } catch (error) {
      console.error('Error decrementing quantity:', error.message);
    }
  };

  const placeOrder = async () => {
    try {
      // Fetch the quantity, price, and product details for each _id in selectedItems
      const productsArray = await Promise.all(
        selectedItems.map(async (productId) => {
          const quantity = await fetchProductQuantity(productId);
          const productDetails = fetchProductDetails(productId);

          // Check if the product is available in sufficient quantity
          if (quantity === 0) {
            throw new Error(`Product ${productId} is out of stock.`);
          }

          const subTotal = quantity * productDetails.price;
          return { _id: productId, quantity, productDetails, subTotal };
        })
      );

      // Calculate the totalAmount as the sum of all subtotals
      const totalAmount = productsArray.reduce((total, product) => total + product.subTotal, 0);

      // Log the calculated totalAmount for debugging purposes
      console.log('Calculated Total Amount:', totalAmount);

      // Make a POST request to the checkout endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: userId,
          products: productsArray,
          orderId: cart._id,
          totalAmount: totalAmount, 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to checkout. Server response: ${await response.text()}`);
      }

      setCart(null);
      setSelectedItems([]);

      Swal.fire({
        title: 'Checkout Successful',
        icon: 'success',
        text: 'Your order has been successfully placed!',
      }).then(() => {
        // Reload the page after the message is displayed
        window.location.reload();
      });
    } catch (error) {
      console.error('Error during checkout:', error.message);

      if (error.message.includes('out of stock')) {
        Swal.fire({
          title: 'Out of Stock',
          icon: 'error',
          text: 'Some selected products are out of stock. Please remove them from your cart and try again.',
        });
      } else {
        Swal.fire({
          title: 'Checkout Failed',
          icon: 'error',
          text: 'An error occurred during the checkout process. Please try again later.',
        });
      }
    }
  };

  const fetchCheckoutRecords = useCallback(async () => {
     try {
       const response = await fetch(`${process.env.REACT_APP_API_URL}/checkouts`, {
         headers: {
           Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
       });

       if (!response.ok) {
         throw new Error(`Failed to fetch checkout records. Server response: ${await response.text()}`);
       }

       const data = await response.json();
       console.log('Checkout Records:', data.checkouts);
     } catch (error) {
       console.error('Error fetching checkout records:', error.message);
     }
   }, []);

   // Call the fetchCheckoutRecords function when the component mounts
   useEffect(() => {
     fetchCheckoutRecords();
   }, [fetchCheckoutRecords]);

   const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  return (
    <>
    <div className="my-cart-container">
    <Container className="mt-5"> 
      <h1 className="mb-4" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}> 
        <img
          src="https://i.postimg.cc/kDQChgVN/cart.png"
          alt="Shopping Cart Icon"
          style={{
            width: '10%',
            maxHeight: '80px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        My Cart
      </h1>   
      {cart && cart.products.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>Select</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => (
                <tr key={item.productId}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => handleCheckboxChange(item.productId)}
                    />
                  </td>
                  <td className="text-center">{item.productDetails.name}</td>
                  <td className="text-center">{formatCurrency(item.productDetails.price)}</td>
                  <td className="text-center">
                    <Button variant="outline-danger" onClick={() => handleDecrement(item.productId)}>
                      -
                    </Button>{' '}
                    {item.quantity}{' '}
                    <Button variant="outline-success" onClick={() => handleIncrement(item.productId)}>
                      +
                    </Button>
                  </td>
                  <td className="text-center">{formatCurrency(item.quantity * item.productDetails.price)}</td>
                  <td className="text-center">
                    <Button variant="danger" onClick={() => handleRemoveItem(item.productId)} style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }} >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-right">
            <h3 className="text-white">Total: {formatCurrency(calculateSubtotal())}</h3>
            <Button
              className="checkoutbtn"
              variant="success"
              onClick={placeOrder}
              disabled={selectedItems.length === 0} // Disable the button when no items are selected
              style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }} 
            >
              Checkout
            </Button>
          </div>

        </>
      ) : (
        <p style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Your cart is empty.</p>
      )}
    </Container>
    </div>
    <Footer />
    </>
  );
};

export default MyCart;
