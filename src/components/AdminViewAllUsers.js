//Dependencies
import React, { useState, useEffect } from 'react';

const AdminViewAllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch data to get All User Orders
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/getAllOrders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        setAllUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) {
    return <p>Loading all users...</p>;
  }

  return (
    <div>
      <h2>All Users and Their Orders</h2>
      {allUsers.length > 0 ? (
        <ul>
          {allUsers.map((user) => (
            <li key={user.userId}>
              <p>User ID: {user.userId}</p>
              <p>Total Purchases: {user.totalAmount}</p>
              {user.products && user.products.length > 0 ? (
                <div>
                  <p>Orders:</p>
                  <ul>
                    {user.products.map((product) => (
                      <li key={product._id}>
                        <p>Order ID: {product._id}</p>
                        <p>Purchased On: {product.purchasedOn}</p>
                        <ul>
                          <li>
                            <p>Product ID: {product.productId}</p>
                            <p>Name: {product.productDetails.name}</p>
                            <p>Description: {product.productDetails.description}</p>
                            <p>Price: {product.productDetails.price}</p>
                            <p>Quantity: {product.quantity}</p>
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No orders for this user.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default AdminViewAllUsers;
