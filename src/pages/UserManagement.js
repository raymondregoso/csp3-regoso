//Dependencies
import React, { useState, useEffect, useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'

const UserManagement = () => {
  
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Check if the user is not an admin and navigate to /products
    if (user && !user.isAdmin) {
      navigate('/products');
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/getAllUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please check the console for details.');
      });
  }, []);

  const handleSetAdmin = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/setAsAdmin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('User set as admin:', data);
        // Optionally, update the state or perform any additional actions
        fetchUsers();
      })
      .catch(error => {
        console.error('Error setting user as admin:', error);
        setError('Error setting user as admin. Please check the console for details.');
      });
  };

  const handleSetUser = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/setToUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('User set as user:', data);
        // Optionally, update the state or perform any additional actions
        fetchUsers();
      })
      .catch(error => {
        console.error('Error setting user as user:', error);
        setError('Error setting user as user. Please check the console for details.');
      });
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/users/deleteUser/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('User deleted:', data);
            // Optionally, update the state or perform any additional actions
            fetchUsers();
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please check the console for details.');
          });
      }
    });
  };

  const handleUpdateProfile = (userId) => {
    // Fetch user data for the specified userId
    fetch(`${process.env.REACT_APP_API_URL}/users/getUser/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(userData => {
        // Use the fetched data to pre-fill the modal input fields
        Swal.fire({
          title: 'Update User Profile',
          html: `
            <input type="text" id="firstName" class="swal2-input" placeholder="First Name" value="${userData.firstName || ''}">
            <input type="text" id="lastName" class="swal2-input" placeholder="Last Name" value="${userData.lastName || ''}">
            <input type="text" id="mobileNo" class="swal2-input" placeholder="Mobile No" value="${userData.mobileNo || ''}">
            <input type="email" id="email" class="swal2-input" placeholder="Email" value="${userData.email || ''}">
            <input type="password" id="newPassword" class="swal2-input" placeholder="New Password">
          `,
          showCancelButton: true,
          confirmButtonText: 'Update',
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            const firstName = Swal.getPopup().querySelector('#firstName').value;
            const lastName = Swal.getPopup().querySelector('#lastName').value;
            const mobileNo = Swal.getPopup().querySelector('#mobileNo').value;
            const email = Swal.getPopup().querySelector('#email').value;
            const newPassword = Swal.getPopup().querySelector('#newPassword').value;

            const updateData = {
              userId,
              ...(firstName && { firstName }),
              ...(lastName && { lastName }),
              ...(mobileNo && { mobileNo }),
              ...(email && { email }),
              ...(newPassword && { newPassword }),
            };

            return updateData;
          },
        }).then(result => {
          if (!result.dismiss) {
            // Perform the update with the provided data
            fetch(`${process.env.REACT_APP_API_URL}/users/editUser/${userId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(result.value),
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Admin profile updated:', data);
                // Optionally, update the state or perform any additional actions
                fetchUsers();
              })
              .catch(error => {
                console.error('Error updating admin profile:', error);
                setError('Error updating admin profile. Please check the console for details.');
              });
          }
        });
      })
      .catch(error => {
        console.error('Error fetching user data for editing:', error);
        setError('Error fetching user data for editing. Please check the console for details.');
      });
  };



  const fetchUsers = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/getAllUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please check the console for details.');
      });
  };

  const exportToCSV = async () => {
    if (users.length === 0) {
      console.warn('No data to export.');
      return;
    }

    const csvData = [
      ['User ID', 'First Name', 'Last Name', 'Email', 'Mobile No.'],
      ...users.map((user) => [
        user._id,
        user.firstName,
        user.lastName,
        user.email,
        user.mobileNo,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');

    try {
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'user_records.csv',
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
        a.download = 'user_records.csv';
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
  
    <div className="mt-4 text-center">
      <h1 className="text-white pb-4" style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>User Management</h1>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover responsive className="mx-auto">
        <thead>
          <tr className="table-head">
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="align-middle">{user._id}</td>
              <td className="align-middle">{user.firstName}</td>
              <td className="align-middle">{user.lastName}</td>
              <td className="align-middle">{user.email}</td>
              <td className="align-middle">{user.mobileNo}</td>
              <td className="d-flex flex-column align-items-center">
                {user.isAdmin ? (
                  <>
                    <Button variant="success" onClick={() => handleSetUser(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Set to User
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Delete
                    </Button>
                    <Button variant="info" onClick={() => handleUpdateProfile(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Update Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" onClick={() => handleSetAdmin(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Set as Admin
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Delete
                    </Button>
                    <Button variant="info" onClick={() => handleUpdateProfile(user._id)} className="m-2" style={{ width: '150px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                      Update Profile
                    </Button>
                    </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="success"
        onClick={exportToCSV}
        style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
      >
        Export to CSV
      </Button>
    </div>
    :

    <Footer />
    </>
  );
};

export default UserManagement;