import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice";

const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  onClose,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
  const [availability, setAvailability] = useState(filters.availability || "");

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    setMinPrice(filters.minPrice || "");
    setMaxPrice(filters.maxPrice || "");
    setSelectedCategory(filters.category || "");
    setAvailability(filters.availability || "");
  }, [filters]);

  const handleApply = () => {
    onFilterChange({
      category: selectedCategory,
      minPrice,
      maxPrice,
      availability,
    });
    if (onClose) onClose();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setAvailability("");
    onResetFilters();
    if (onClose) onClose();
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filters</h3>
        {isMobile && (
          <button
            className="filter-sidebar__close-btn"
            onClick={onClose}
          >
            &times;
          </button>
        )}
      </div>

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Categories</h4>
        <div className="filter-sidebar__list">
          <div
            className={`filter-sidebar__item ${
              selectedCategory === "" ? "filter-sidebar__item--active" : ""
            }`}
            onClick={() => setSelectedCategory("")}
          >
            <span>All Categories</span>
          </div>
          {categories.map((cat) => (
            <div
              key={cat._id}
              className={`filter-sidebar__item ${
                selectedCategory === cat._id ? "filter-sidebar__item--active" : ""
              }`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              <span>{cat.name}</span>
              <span>&gt;</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Price Range</h4>
        <div className="filter-sidebar__price-inputs">
          <input
            type="number"
            placeholder="Min ($)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max ($)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Availability</h4>
        <div className="filter-sidebar__availability">
          <label>
            <input
              type="radio"
              name="availability"
              value=""
              checked={availability === ""}
              onChange={() => setAvailability("")}
            />
            All Products
          </label>
          <label>
            <input
              type="radio"
              name="availability"
              value="true"
              checked={availability === "true"}
              onChange={() => setAvailability("true")}
            />
            In Stock Only
          </label>
          <label>
            <input
              type="radio"
              name="availability"
              value="false"
              checked={availability === "false"}
              onChange={() => setAvailability("false")}
            />
            Out of Stock
          </label>
        </div>
      </div>

      <button className="filter-sidebar__apply-btn" onClick={handleApply}>
        Apply Filter
      </button>
      <button className="filter-sidebar__clear-btn" onClick={handleClear}>
        Clear Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
