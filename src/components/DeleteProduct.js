import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function DeleteProduct({ product, fetchData }) {
  // State for deleteProduct Modal to open/close
  const [showDelete, setShowDelete] = useState(false);

  // Function for opening the modal
  const openDelete = () => {
    setShowDelete(true);
  };

  const closeDelete = () => {
    setShowDelete(false);
  };

  // Function to handle the deletion of the product
  const handleDelete = () => {
   
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Fetch data, If the user confirms, proceed with the deletion
        fetch(`${process.env.REACT_APP_API_URL}/products/${product}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Failed to delete the product.');
            }
            return res.json();
          })
          .then((data) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your product has been deleted.',
              icon: 'success',
            });
            fetchData();
          })
          .catch((error) => {
            console.error('Error deleting product:', error.message);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the product. Please try again.',
              icon: 'error',
            });
          })
          .finally(() => {
            // Close the delete modal
            closeDelete();
          });
      }
    });
  };

  return (
    <>
      <Button variant="danger" size="sm" onClick={openDelete}>
        Delete
      </Button>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={closeDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
