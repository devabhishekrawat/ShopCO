import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ initialValue = "", onSearch, placeholder = "Search for products..." }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 450);
  };

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
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
