import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice.js";
import filterIcon from "../assets/icons/filter-icon.svg";

const DEFAULT_SIZES = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const CATEGORY_SIZES = {
  "t-shirt": ["Small", "Medium", "Large", "X-Large"],
  "t-shirts": ["Small", "Medium", "Large", "X-Large"],
  tshirt: ["Small", "Medium", "Large", "X-Large"],
  tshirts: ["Small", "Medium", "Large", "X-Large"],
  shirt: ["Small", "Medium", "Large", "X-Large"],
  shirts: ["Small", "Medium", "Large", "X-Large"],
  shoe: ["7", "8", "9", "10", "11", "12"],
  shoes: ["7", "8", "9", "10", "11", "12"],
  footwear: ["7", "8", "9", "10", "11", "12"],
  accessories: ["One Size"],
  accessory: ["One Size"],
  jeans: ["28", "30", "32", "34", "36", "38"],
  shorts: ["Small", "Medium", "Large", "X-Large"],
  hoodie: ["Small", "Medium", "Large", "X-Large"],
};

const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

const MIN_LIMIT = 0;
const MAX_LIMIT = 10000;
const STEP = 10;
const CURRENCY_SYMBOL = "$";

const DEFAULT_CATEGORIES = [
  { _id: "t-shirts", name: "T-shirts" },
  { _id: "shirts", name: "Shirts" },
  { _id: "shoes", name: "Shoes" },
  { _id: "accessories", name: "Accessories" },
  { _id: "jeans", name: "Jeans" },
  { _id: "shorts", name: "Shorts" },
  { _id: "hoodie", name: "Hoodie" },
];

const FilterSidebar = ({
  filters = {},
  onFilterChange,
  onResetFilters,
  onClose,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isStyleOpen, setIsStyleOpen] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
  const [minPrice, setMinPrice] = useState(
    filters.minPrice !== undefined && filters.minPrice !== ""
      ? Number(filters.minPrice)
      : 0
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice !== undefined && filters.maxPrice !== ""
      ? Number(filters.maxPrice)
      : 10000
  );
  const [selectedSize, setSelectedSize] = useState(filters.size || "");
  const [selectedStyle, setSelectedStyle] = useState(filters.dressStyle || "");

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    setSelectedCategory(filters.category || "");
    if (filters.minPrice !== undefined && filters.minPrice !== "") {
      setMinPrice(Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
      setMaxPrice(Number(filters.maxPrice));
    }
    if (filters.size !== undefined) {
      setSelectedSize(filters.size);
    }
    if (filters.dressStyle !== undefined) {
      setSelectedStyle(filters.dressStyle);
    }
  }, [filters]);

  const displayCategories =
    categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const currentMin = typeof minPrice === "number" ? minPrice : MIN_LIMIT;
  const currentMax = typeof maxPrice === "number" ? maxPrice : MAX_LIMIT;

  const minPercent = Math.min(
    100,
    Math.max(0, ((currentMin - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100)
  );
  const maxPercent = Math.min(
    100,
    Math.max(0, ((currentMax - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100)
  );

  const handleMinSliderChange = (e) => {
    const val = Math.min(Number(e.target.value), currentMax - STEP);
    setMinPrice(val);
  };

  const handleMaxSliderChange = (e) => {
    const val = Math.max(Number(e.target.value), currentMin + STEP);
    setMaxPrice(val);
  };

  const getCategorySizes = (catIdentifier = selectedCategory) => {
    if (!catIdentifier) {
      return DEFAULT_SIZES;
    }

    const currentCat = displayCategories.find(
      (c) =>
        c._id === catIdentifier ||
        c.name.toLowerCase() === catIdentifier.toLowerCase()
    );

    const name = (currentCat ? currentCat.name : catIdentifier).toLowerCase().trim();

    if (CATEGORY_SIZES[name]) {
      return CATEGORY_SIZES[name];
    }

    const stripped = name.replace(/[\s-_]/g, "");
    for (const [key, sizes] of Object.entries(CATEGORY_SIZES)) {
      if (key.replace(/[\s-_]/g, "") === stripped) {
        return sizes;
      }
    }

    if (currentCat && currentCat.sizes && currentCat.sizes.length > 0) {
      return currentCat.sizes;
    }

    return DEFAULT_SIZES;
  };

  const availableSizes = getCategorySizes(selectedCategory);

  const handleCategorySelect = (cat) => {
    const identifier = cat._id || cat.name;
    const isSelected =
      selectedCategory === identifier ||
      selectedCategory.toLowerCase() === cat.name.toLowerCase();
    const nextCat = isSelected ? "" : identifier;
    setSelectedCategory(nextCat);

    if (selectedSize) {
      const nextSizes = getCategorySizes(nextCat);
      const isStillValid = nextSizes.some(
        (s) => s.toLowerCase() === selectedSize.toLowerCase()
      );
      if (!isStillValid) {
        setSelectedSize("");
      }
    }
  };

  const handleSizeSelect = (size) => {
    const isSelected = selectedSize.toLowerCase() === size.toLowerCase();
    setSelectedSize(isSelected ? "" : size);
  };

  const handleStyleSelect = (style) => {
    const isSelected = selectedStyle.toLowerCase() === style.toLowerCase();
    setSelectedStyle(isSelected ? "" : style);
  };

  const handleApply = () => {
    onFilterChange({
      category: selectedCategory,
      minPrice: currentMin,
      maxPrice: currentMax,
      size: selectedSize,
      dressStyle: selectedStyle,
    });
    if (onClose) onClose();
  };

  const handleClear = () => {
    setSelectedCategory("");
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setSelectedSize("");
    setSelectedStyle("");
    onResetFilters();
    if (onClose) onClose();
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    selectedSize ||
    selectedStyle ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.size ||
    filters.dressStyle ||
    filters.category
  );

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filters</h3>
        <div className="filter-sidebar__header-actions">

          <img
            src={filterIcon}
            alt="Filters"
            className="filter-sidebar__filter-icon"
          />

          {isMobile && (
            <button
              type="button"
              className="filter-sidebar__close-btn"
              onClick={onClose}
              aria-label="Close filters"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <hr className="filter-sidebar__divider" />

      <ul className="filter-sidebar__categories">
        {displayCategories.map((cat) => {
          const isSelected =
            selectedCategory === cat._id ||
            selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <li
              key={cat._id || cat.name}
              className="filter-sidebar__category-item"
            >
              <button
                type="button"
                className={`filter-sidebar__category-btn ${isSelected ? "filter-sidebar__category-btn--active" : ""
                  }`}
                onClick={() => handleCategorySelect(cat)}
              >
                <span>{cat.name}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter-sidebar__chevron"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <hr className="filter-sidebar__divider" />

      <div className="filter-sidebar__section">
        <button
          type="button"
          className="filter-sidebar__section-header"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <span className="filter-sidebar__section-title">Price</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`filter-sidebar__accordion-arrow ${isPriceOpen ? "filter-sidebar__accordion-arrow--open" : ""
              }`}
          >
            <path
              d="M4 10L8 6L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isPriceOpen && (
          <div className="filter-sidebar__price-body">
            <div
              className="filter-sidebar__price-slider"
              style={{
                "--min-percent": `${minPercent}%`,
                "--max-percent": `${100 - maxPercent}%`,
              }}
            >
              <div className="filter-sidebar__slider-track" />
              <div className="filter-sidebar__slider-progress" />
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={currentMin}
                onChange={handleMinSliderChange}
                className={`filter-sidebar__range filter-sidebar__range--min ${minPercent > 50 ? "filter-sidebar__range--z-high" : ""
                  }`}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={currentMax}
                onChange={handleMaxSliderChange}
                className="filter-sidebar__range filter-sidebar__range--max"
                aria-label="Maximum price"
              />
            </div>

            <div className="filter-sidebar__price-values">
              <span className="filter-sidebar__price-value">
                {CURRENCY_SYMBOL}
                {currentMin.toLocaleString()}
              </span>
              <span className="filter-sidebar__price-value">
                {CURRENCY_SYMBOL}
                {currentMax.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <hr className="filter-sidebar__divider" />

      <div className="filter-sidebar__section">
        <button
          type="button"
          className="filter-sidebar__section-header"
          onClick={() => setIsSizeOpen(!isSizeOpen)}
        >
          <span className="filter-sidebar__section-title">Size</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`filter-sidebar__accordion-arrow ${isSizeOpen ? "filter-sidebar__accordion-arrow--open" : ""
              }`}
          >
            <path
              d="M4 10L8 6L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isSizeOpen && (
          <div className="filter-sidebar__sizes-grid">
            {availableSizes.map((size) => {
              const isSelected = selectedSize.toLowerCase() === size.toLowerCase();
              return (
                <button
                  key={size}
                  type="button"
                  className={`filter-sidebar__size-chip ${isSelected ? "filter-sidebar__size-chip--active" : ""
                    }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <hr className="filter-sidebar__divider" />

      <div className="filter-sidebar__section">
        <button
          type="button"
          className="filter-sidebar__section-header"
          onClick={() => setIsStyleOpen(!isStyleOpen)}
        >
          <span className="filter-sidebar__section-title">Dress Style</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`filter-sidebar__accordion-arrow ${isStyleOpen ? "filter-sidebar__accordion-arrow--open" : ""
              }`}
          >
            <path
              d="M4 10L8 6L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isStyleOpen && (
          <ul className="filter-sidebar__styles-list">
            {DRESS_STYLES.map((style) => {
              const isSelected =
                selectedStyle.toLowerCase() === style.toLowerCase();
              return (
                <li key={style} className="filter-sidebar__style-item">
                  <button
                    type="button"
                    className={`filter-sidebar__style-btn ${isSelected ? "filter-sidebar__style-btn--active" : ""
                      }`}
                    onClick={() => handleStyleSelect(style)}
                  >
                    <span>{style}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="filter-sidebar__chevron"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="filter-sidebar__actions">
        <button
          type="button"
          className="filter-sidebar__apply-btn"
          onClick={handleApply}
        >
          Apply Filter
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="filter-sidebar__clear-btn"
            onClick={handleClear}
          >
            Reset Filters
          </button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
