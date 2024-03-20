//Dependencies
import React, { useState, useEffect } from 'react';

const AllActiveProducts = () => {
  const [activeProducts, setActiveProducts] = useState([]);
  const [showActiveProducts, setShowActiveProducts] = useState(false);

  const fetchActiveProducts = async () => {
    try {
      //Fetch data to activate a product
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/active`);
      const data = await response.json();
      setActiveProducts(data);
    } catch (error) {
      console.error('Error fetching active products:', error);
    }
  };

  const toggleActiveProducts = () => {
    setShowActiveProducts(!showActiveProducts);
  };

  useEffect(() => {
    if (showActiveProducts) {
      fetchActiveProducts();
    }
  }, [showActiveProducts]);

  return (
    <div>
  
      <button className="btn btn-primary mt-4" onClick={toggleActiveProducts} 
        style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
        {showActiveProducts ? 'Hide' : 'Show'} All Active Products
      </button>
      {showActiveProducts && (
        <ul className="text-white">
          {activeProducts.map((product) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllActiveProducts;
