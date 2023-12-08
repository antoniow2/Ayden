// This code, with the "SearchBar.js" are for the search bar.
// It display the search results of the "SearchBar.js" code.

import React from "react";

import { Link } from "react-router-dom";

export const SearchResultsList = ({ results }) => {
  // Assuming results is an object with a data property
  console.log(results);
  const dataArray = results.data || []; // Ensure that dataArray is an array, handle the case where results.data is undefined
  const isArrayofObjects = typeof dataArray[0] === "object";
  console.log(dataArray);

  return (
    <div className="results-list">
      {dataArray.length > 0 ? (
        dataArray.map((result, index) => (
          <div key={isArrayofObjects ? result.id : index}>
            {isArrayofObjects ? result.title : result}
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResultsList;
