// Dependencies
import React, { useState, useEffect } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import ShowUsersOrder from './ShowUsersOrder';
import ShowUsersCheckout from './ShowUsersCheckout';
import imagesData from '../data/images';
import AllActiveProduct from './AllActiveProduct';

const AdminView = ({ productsData, fetchData }) => {
  const [products, setProducts] = useState([]);
  const [showUsersOrder, setShowUsersOrder] = useState(false);
  const [showUsersCheckout, setShowUsersCheckout] = useState(false);

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      const productsArr = productsData.map((product) => {
        const matchingImage = imagesData.find((image) =>
          product.name.toLowerCase().includes(image.name.toLowerCase())
        );

        return (
          <tr key={product._id}>
            <td className="align-middle">{product._id}</td>
            <td className="align-middle">{product.name}</td>
            <td className="align-middle">{product.description}</td>
            <td className="align-middle">{formatCurrency(product.price)}</td>
            <td className={`align-middle text-center ${product.quantity <= 5 ? 'redQuantity' : ''}`}>
              {product.quantity}
            </td>
            <td className={`align-middle text-center ${product.isActive ? 'text-success' : 'text-danger'}`}>
              {product.isActive ? 'Available' : 'Unavailable'}
            </td>
            <td className="align-middle">
              <a href={matchingImage?.link} target='_blank' rel='noopener noreferrer'>
                <img
                  src={matchingImage?.imageUrl}
                  alt={product.name}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </a>
            </td>
            <td className="align-middle">
              <EditProduct product={product._id} fetchData={fetchData} />
            </td>
            <td className="align-middle">
              <ArchiveProduct product={product._id} isActive={product.isActive} fetchData={fetchData} />
            </td>
            <td className="align-middle">
              <DeleteProduct product={product._id} fetchData={fetchData} />
            </td>
          </tr>
        );
      });

      setProducts(productsArr);
    }
  }, [productsData, fetchData]);

  const handleShowUsersOrder = () => {
    setShowUsersOrder((prev) => !prev);
    setShowUsersCheckout(false);
  };

  const handleShowUsersCheckout = () => {
    setShowUsersOrder(false);
    setShowUsersCheckout((prev) => !prev);
  };

  const formatCurrency = (amount) => {
    // Format amount as PHP currency
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="text-center my-4 text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Admin Dashboard
      </h1> 

      <Row className="justify-content-center mb-4">
        <Col xs="12" md="auto"> 
          <div className="d-flex flex-column align-items-center mb-3">
           <AllActiveProduct />
          </div>
          <AddProduct fetchData={fetchData} />
         
          <button
            className="btn btn-success"
            onClick={handleShowUsersOrder}
            style={{ marginLeft: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            {showUsersOrder ? 'Hide Users Carts' : 'Show Users Carts'}
          </button>

          <button
            className="btn btn-warning"
            onClick={handleShowUsersCheckout}
            style={{ marginLeft: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            {showUsersCheckout ? 'Hide Users Checkouts' : 'Show Users Checkouts'}
          </button>
                  
       
        </Col>
      </Row>

      {showUsersOrder && <ShowUsersOrder onClose={() => setShowUsersOrder(false)} />}
      {showUsersCheckout && <ShowUsersCheckout />}

      <div className="table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr className="table-head">
              <th className="align-middle">ID</th>
              <th className="align-middle">Name</th>
              <th className="align-middle">Description</th>
              <th className="align-middle">Price</th>
              <th className="align-middle">Inventory</th>
              <th className="align-middle">Availability</th>
              <th className="align-middle">Image</th>
              <th colSpan="3" className="align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>{products}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminView;
