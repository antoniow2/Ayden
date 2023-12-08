// This code, with the "SearchResultsList.js" are for the search bar.
// It reads through an API and display the Items with no restrictions yet

import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// Importing icons and styles (commented out for now)
// import { FaSearch } from "react-icons/fa";
// import "./SearchBar.css"; // Possible styling

export const SearchBar = ({ setResults }) => {
  // State to manage the input value
  const [input, setInput] = useState("");

  const API_BASE_URL = "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/";

  // ============== Function to fetch data from an API based on the input value ==============
  const fetchData = async (value) => {
    const response = await Axios.get(
      "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/recipe/allergy",
      {
        params: {},
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("userToken")}`,
        },
      }
    );

    //console.log(response);
    //results.map((response) => { response.title } )
    setResults(response);
  };

  // Function to handle changes in the input value
  const handleChange = (value) => {
    // Updating the input state
    setInput(value);
    // Fetching data based on the updated input value
    fetchData(value);
  };

  // Render the search bar component
  return (
    <div>
      <input
        placeholder="Type to search..."
        value={input}
        // Handling changes in the input value and triggering fetchData
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
