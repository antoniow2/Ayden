import React from "react";
import { useState } from "react";

import { SearchBar } from "./SearchComponents/SearchBar";
import { SearchResultsList } from "./SearchComponents/SearchResultsList";

function Search() {
  const [results, setResults] = useState([]);

  return (
    <div>
      <div>
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
    </div>
  );
}

export default Search;
