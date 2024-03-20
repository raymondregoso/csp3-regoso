//Dependencies
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AddProduct({ fetchData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const openAdd = () => {
    setShowAdd(true);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('');
  };

  const addProduct = async (e) => {
  e.preventDefault();

    // Fetch to create product
    try {
     const response = await fetch(`${process.env.REACT_APP_API_URL}/products/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    name,
    description,
    price,
    quantity,
  }),
});

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'Product Added!',
        });
        fetchData();
        closeAdd();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unsuccessful Product Creation',
          text: data.message,
        });
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  return (
    <>
      <Button variant="primary" style={{ marginLeft: '10px', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }} onClick={openAdd}>
        Add New Product
      </Button>

      <Modal show={showAdd} onHide={closeAdd}>
        <Form onSubmit={(e) => addProduct(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inventory</Form.Label>
              <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAdd}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
