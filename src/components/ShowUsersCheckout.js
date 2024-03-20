// Dependencies
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const ShowUsersCheckout = () => {
  const [userCheckouts, setUserCheckouts] = useState([]);

  useEffect(() => {
    // Fetch user checkouts when the component mounts
    fetchUserCheckouts();
  }, []);

  const fetchUserCheckouts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/getAllCheckouts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserCheckouts(data);
    } catch (error) {
      console.error('Error fetching user checkouts:', error);
    }
  };

  const formatCurrency = (amount) => {
    // Format amount as PHP currency
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };


 const exportToCSV = async () => {
     if (userCheckouts.length === 0) {
       console.warn('No data to export.');
       return;
     }

     const csvData = [
       ['Checkout ID', 'User ID', 'Total Amount', 'Products', 'Created At'],
       ...userCheckouts.map((checkout) => [
         checkout._id,
         checkout.userId, 
         checkout.totalAmount,
         checkout.products.map((product) => product.productDetails.name).join(', '),
         new Date(checkout.createdAt).toLocaleString(),
       ]),
     ];

     const csvContent = csvData.map((row) => row.join(',')).join('\n');

     try {
       if (window.showSaveFilePicker) {
         const fileHandle = await window.showSaveFilePicker({
           suggestedName: 'checkout_records.csv',
         });
         const writableStream = await fileHandle.createWritable();
         await writableStream.write(csvContent);
         await writableStream.close();
         console.log('CSV file saved successfully.');
       } else {
         // Fallback: Use a data URI and create a download link
         const blob = new Blob([csvContent], { type: 'text/csv' });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = 'checkout_records.csv';
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);
         console.log('CSV file saved successfully (fallback).');
       }
     } catch (error) {
       console.error('Error saving CSV file:', error);
     }
   };




  return (
    <div className="container mt-4"> 
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2 className="text-white">Users Checkouts</h2>
        <Button
          variant="success"
          onClick={exportToCSV}
          style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
        >
          Export to CSV
        </Button>
      </div>

      {userCheckouts.length > 0 ? (
        <div className="table-container">
          <Table striped bordered hover responsive>
            <thead>
              <tr className="table-head">
                <th className="align-middle">Checkout ID</th>
                <th className="align-middle">User ID</th>
                <th className="align-middle">Total Amount</th>
                <th className="align-middle">Products</th>
                <th className="align-middle">Created At</th>
              </tr>
            </thead>
            <tbody>
              {userCheckouts.map((checkout) => (
                <tr key={checkout._id}>
                  <td className="align-middle">{checkout._id}</td>
                  <td className="align-middle">{checkout.userId}</td>
                  <td className="align-middle">{formatCurrency(checkout.totalAmount)}</td>
                  <td className="align-middle">
                    <ul>
                      {checkout.products.map((product) => (
                        <li key={product._id}>
                          {product.productDetails.name} - Quantity: {product.quantity} - Subtotal: {formatCurrency(product.subTotal)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="align-middle">{checkout.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-white">No user checkouts available.</p>
      )}
      
    </div>
  );
};

export default ShowUsersCheckout;
