import { useState, useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserProvider } from './UserContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import ProductView from './pages/ProductView';
import MyCart from './pages/MyCart';
import Checkout from './pages/Checkout'; 
import UserManagement from './pages/UserManagement'; 
import NotFound from './pages/Error';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (typeof data._id !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/mycart" element={<MyCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/usermanagement" element={<UserManagement />} />  
            <Route path="/profile" element={<Profile />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
