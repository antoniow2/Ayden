// SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        return;
      }
  
      const formattedSearchTerm = searchTerm.trim().replace(/\s+/g, '_');
  
      const response = await axios.get(`${process.env.PUBLIC_URL}/Products/${formattedSearchTerm.toLowerCase()}_prices.json`);
      const data = response.data.data;
  
      onSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      onSearchResults([]);
    }
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;




