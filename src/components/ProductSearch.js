import React, { useState } from 'react';
import ProductCard from './ProductCard';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        // If search query is empty, reset search results and go back to all products
        setSearchResults([]);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName: searchQuery })
      });

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for product:', error);
    }
  };

  return (
    <div>
      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="form-group text-white">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              className="form-control"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 mt-4">
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            style={{ width: '95%' , boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            Search
          </button>
        </div>
      </div>
      <h5 className="text-white">Results:</h5>
      <ul>
        {searchResults.map((product) => (
          <ProductCard productProp={product} key={product._id} />
        ))}
      </ul>
    </div>
  );
};

export default ProductSearch;
