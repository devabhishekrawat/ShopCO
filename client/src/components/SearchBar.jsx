import React, { useState, useEffect } from "react";

const SearchBar = ({ initialValue = "", onSearch, placeholder = "Search for products..." }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="header__search">
      <span className="header__search-icon">
        <img
          src="/assets/icons/search-icon.svg"
          alt="search icon"
          className="header__search-icon-image"
        />
      </span>
      <input
        type="text"
        className="header__search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
