import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice.js";
import ProductGrid from "../components/ProductGrid.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import Pagination from "../components/Pagination.jsx";
import Loader from "../components/Loader.jsx";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, totalProducts, totalPages, currentPage, loading, error } =
    useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const querySearch = searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || "";
  const queryMinPrice = searchParams.get("minPrice") || "";
  const queryMaxPrice = searchParams.get("maxPrice") || "";
  const queryAvailability = searchParams.get("availability") || "";
  const queryPage = parseInt(searchParams.get("page") || "1", 10);

  const currentCategoryObj = categories.find((c) => c._id === queryCategory);
  const categoryTitle = currentCategoryObj ? currentCategoryObj.name : "All Products";

  const loadData = useCallback(() => {
    const params = {
      page: queryPage,
      limit: 9,
      sort,
    };
    if (querySearch) params.search = querySearch;
    if (queryCategory) params.category = queryCategory;
    if (queryMinPrice) params.minPrice = queryMinPrice;
    if (queryMaxPrice) params.maxPrice = queryMaxPrice;
    if (queryAvailability) params.availability = queryAvailability;

    dispatch(fetchProducts(params));
  }, [
    dispatch,
    queryPage,
    sort,
    querySearch,
    queryCategory,
    queryMinPrice,
    queryMaxPrice,
    queryAvailability,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");

    if (newFilters.category) newParams.set("category", newFilters.category);
    else newParams.delete("category");

    if (newFilters.minPrice) newParams.set("minPrice", newFilters.minPrice);
    else newParams.delete("minPrice");

    if (newFilters.maxPrice) newParams.set("maxPrice", newFilters.maxPrice);
    else newParams.delete("maxPrice");

    if (newFilters.availability) newParams.set("availability", newFilters.availability);
    else newParams.delete("availability");

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    if (querySearch) newParams.set("search", querySearch);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", selectedSort);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="products-page container">
      <div className="products-page__header">
        <div className="products-page__title-wrap">
          <h1 className="products-page__title">{categoryTitle}</h1>
          <span className="products-page__count">
            Showing {products.length} of {totalProducts} Products
          </span>
        </div>

        <div className="products-page__controls">
          <div className="products-page__sort">
            <span>Sort by:</span>
            <select value={sort} onChange={handleSortChange}>
              <option value="newest">Most Popular / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <button
            className="products-page__filter-btn"
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Filter"
          >
            <img src="/assets/icons/search-icon.svg" alt="filter" />
          </button>
        </div>
      </div>

      <div className="products-page__layout">
        <div className="products-page__sidebar">
          <FilterSidebar
            filters={{
              category: queryCategory,
              minPrice: queryMinPrice,
              maxPrice: queryMaxPrice,
              availability: queryAvailability,
            }}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        <main className="products-page__main">
          {loading ? (
            <Loader text="Loading products..." />
          ) : error ? (
            <div style={{ color: "#ff3333", textAlign: "center", padding: "3rem" }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="products-page__empty">
              <h3>No products found</h3>
              <p>Try clearing filters or searching for something else.</p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>

      {mobileFilterOpen && (
        <div
          className="filter-drawer-overlay"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterSidebar
              filters={{
                category: queryCategory,
                minPrice: queryMinPrice,
                maxPrice: queryMaxPrice,
                availability: queryAvailability,
              }}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onClose={() => setMobileFilterOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
