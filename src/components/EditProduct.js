//Dependencies
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

// Add the props product to get the specific id of the product
export default function EditProduct({ product, fetchData }){

	// State for productId for the fetch URL
	const [productId, setProductId] = useState('')

	// Forms state
	// Add state for the forms of product
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [quantity, setQuantity] = useState('');

	// state for editProduct Modals to open/close
	const [showEdit, setShowEdit] = useState(false)

	// Function for opening the modal
	const openEdit = (productId) => {
		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
		.then(res => res.json())
		.then(data => {
			// Populate all the input values with product info that we fetched
			setProductId(data._id);
			setName(data.name);
			setDescription(data.description);
			setPrice(data.price)
			setQuantity(data.quantity)
		})

		// Open the modal
		setShowEdit(true)
	}

	const closeEdit = () =>{
		setShowEdit(false);
		setName('');
		setDescription('');
		setPrice(0);
		setQuantity('');
	}

	// Function to update the product
	const editProduct = (e, productId) => {
		e.preventDefault();
		//Fetch data for each product.
		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`,{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				quantity: quantity
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)

			if(data === true){
				Swal.fire({
					title: 'Success!',
					icon: 'success',
					text: 'Products Successfully Updated'
				})
				closeEdit();
				fetchData();
			} else {
				Swal.fire({
					title: 'Error!',
					icon: 'error',
					text: ' Please try again'
				})
				closeEdit();
				fetchData();
			}
		})
	}

	return(
		<>
			<Button variant="primary" size="sm" onClick={() => openEdit(product)}> Edit </Button>

			{/*Edit Modal*/}
			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, productId)}>
                   <Modal.Header closeButton>
                       <Modal.Title>Edit Product</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>    
                       <Form.Group>
                           <Form.Label>Name</Form.Label>
                           <Form.Control 
                           		type="text"
                           		value={name}
                           		onChange={e => setName(e.target.value)} 
                           		required/>
                       </Form.Group>
                       <Form.Group>
                           <Form.Label>Description</Form.Label>
                           <Form.Control 
                           		type="text"
                           		value={description}
                           		onChange={e => setDescription(e.target.value)} 
                           		required/>
                       </Form.Group>
                       <Form.Group>
                           <Form.Label>Price</Form.Label>
                           <Form.Control 
                           		type="number"
                           		value={price}
                           		onChange={e => setPrice(e.target.value)} 
                           		required/>
                       </Form.Group>
                       <Form.Group>
                           <Form.Label>Quantity</Form.Label>
                           <Form.Control 
                           		type="number"
                           		value={quantity}
                           		onChange={e => setQuantity(e.target.value)} 
                           		required/>
                       </Form.Group>
                   </Modal.Body>
                   <Modal.Footer>
                       <Button variant="secondary" onClick={closeEdit}>Close</Button>
                       <Button variant="success" type="submit">Submit</Button>
                   </Modal.Footer>
               </Form>
           </Modal>
		</>
	)
}
