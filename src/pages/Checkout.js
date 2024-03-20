import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Image } from 'react-bootstrap';
import UserContext from '../UserContext';
import imagesData from '../data/images';
import Footer from '../components/Footer';

const Checkout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/checkouts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch checkouts. Server response: ${await response.text()}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          const filteredCheckouts = data.data.filter((checkout) => checkout.userId === user.id);
          setCheckouts(filteredCheckouts);
        } else {
          console.error('Invalid data structure:', data);
          setCheckouts([]);
        }
      } catch (error) {
        console.error('Error fetching checkouts:', error.message);
      }
    };
    
   fetchCheckouts();
  }, [user]);

  const showDetails = (checkout) => {
    setSelectedCheckout(checkout);
  };

  const hideDetails = () => {
    setSelectedCheckout(null);
  };

  const exportToCSV = async () => {
      if (checkouts.length === 0) {
        console.warn('No data to export.');
        return;
      }

      const csvData = [
        ['Checkout ID', 'Product Name', 'Quantity', 'Price', 'Total Amount', 'CreatedAt'],
        ...checkouts.map((checkout) => [
          checkout._id,
          checkout.products.map((product) => product.productDetails.name).join(', '),
          checkout.products.map((product) => product.quantity).join(', '),
          checkout.products.map((product) =>product.productDetails.price).join(', '),
          
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
    <>
      <Container className="mt-5">
        <h1 className="mb-4 text-center" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <img 
          src="https://i.postimg.cc/jjFFrrYG/checkouts.png" 
          alt="Checkouts" 
          style={{ 
            width: '8%', 
            maxHeight: '100px', 
            objectFit: 'cover',
            borderRadius: '10px', }} /> 
          Checkout Records
        </h1>
        {checkouts.length > 0 ? (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr className="text-center">
                  <th>Checkout ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Amount</th>
                  <th>CreatedAt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {checkouts.map((checkout) => (
                  <tr key={checkout._id}>
                    <td className="text-center">{checkout._id}</td>
                    <td className="text-center">
                      {checkout.products.map((product) => product.productDetails.name).join(', ')}
                    </td>
                    <td className="text-center">
                      {checkout.products.map((product) => product.quantity).join(', ')}
                    </td>
                    <td className="text-center">
                      {checkout.products.map((product) => (
                        <p key={product.productDetails._id}>
                          PhP {Number(product.productDetails.price).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      ))}
                    </td>
                    <td className="text-center">
                      PhP {Number(checkout.totalAmount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">{new Date(checkout.createdAt).toLocaleString()}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        onClick={() => showDetails(checkout)}
                        style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
                      >
                        Show Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={selectedCheckout !== null} onHide={hideDetails}>
              <Modal.Header closeButton>
                <Modal.Title className="text-primary">My Checkout Details </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedCheckout && (
                  <>
                    <h3>Product Details:</h3>
                    <ul>
                      {selectedCheckout.products.map((product) => (
                        <li key={product.productDetails._id}>
                          <strong>Name: {product.productDetails.name}</strong>
                       <Image
                         src={imagesData.find((img) => img.name === product.productDetails.name)?.imageUrl}
                         rounded
                         fluid
                         style={{ width: '100px', height: '100px', float: 'right' }}
                       />

                          <p>Quantity: {product.quantity}</p>
                          <p>
                            Price: PhP{' '}
                            <span style={{ color: 'blue' }}>
                              {Number(product.productDetails.price).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </p>
                        </li>
                      ))}
                    </ul>

                    <p>Checkout ID: {selectedCheckout._id}</p>
                    <p>Checkout Date: {new Date(selectedCheckout.createdAt).toLocaleString()}</p>
                    <strong>
                      Total Amount: Php{' '}
                      <span style={{ color: 'red' }}>
                        {Number(selectedCheckout.totalAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </strong>
                  </>
                )}
              </Modal.Body>
            </Modal>
          </>
        ) : (
          <p style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            No checkout records found.
          </p>
        )}
          <div className="d-flex flex-column align-items-center">
              <Button
                  variant="success"
                  onClick={exportToCSV}
                  className="mb-3 ml-auto " 
                  style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
                >
                  Export to CSV
              </Button>
          </div>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
