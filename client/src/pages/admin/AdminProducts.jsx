import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, removeProduct } from "../../store/slices/productSlice.js";
import { updateProductQuantity } from "../../services/productService.js";
import Loader from "../../components/Loader.jsx";
import Pagination from "../../components/Pagination.jsx";
import { toast } from "react-toastify";
import { getFirstImage } from "../../services/api.js";

const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, totalProducts, totalPages, loading } =
    useSelector((state) => state.products);

  const currentStock = searchParams.get("stock") || searchParams.get("availability") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const loadData = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 10,
    };
    if (currentSearch) {
      params.search = currentSearch;
    }
    if (currentStock) {
      params.availability = currentStock;
      params.stock = currentStock;
    }
    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, currentSearch, currentStock]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStockFilterChange = (filterValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (filterValue) {
      newParams.set("stock", filterValue);
      newParams.delete("availability");
    } else {
      newParams.delete("stock");
      newParams.delete("availability");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await dispatch(removeProduct(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete product");
    }
  };

  const handleUpdateStock = async (id) => {
    if (newStockValue === "" || isNaN(newStockValue)) {
      toast.error("Please enter a valid stock number");
      return;
    }
    try {
      await updateProductQuantity(id, Number(newStockValue));
      toast.success("Stock updated");
      setEditingStockId(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Product Management</h1>
          <p className="admin-header__subtitle">
            Total matching products: {totalProducts}
          </p>
        </div>

        <Link to="/admin/products/add" className="admin-header__action-btn">
          + Add Product
        </Link>
      </div>

      <div className="admin-filter-bar">
        <form onSubmit={handleSearchSubmit} className="admin-search-form">
          <input
            type="text"
            placeholder="Search by title & press Enter..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button
            type="submit"
            className="admin-search-form__btn"
          >
            Search
          </button>
        </form>

        <div className="admin-stock-filter">
          <span className="admin-stock-filter__label">Stock:</span>
          <button
            type="button"
            onClick={() => handleStockFilterChange("")}
            className={`admin-stock-filter__btn admin-stock-filter__btn--all ${!currentStock ? "is-active" : ""}`}
          >
            All Products
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("in_stock")}
            className={`admin-stock-filter__btn admin-stock-filter__btn--in-stock ${currentStock === "in_stock" ? "is-active" : ""}`}
          >
            ✅ In Stock (&gt; 5)
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("low_stock")}
            className={`admin-stock-filter__btn admin-stock-filter__btn--low-stock ${currentStock === "low_stock" ? "is-active" : ""}`}
          >
            ⚠️ Low Stock (≤ 5)
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("out_of_stock")}
            className={`admin-stock-filter__btn admin-stock-filter__btn--out-of-stock ${currentStock === "out_of_stock" ? "is-active" : ""}`}
          >
            ⛔ Out of Stock (0)
          </button>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <Loader text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="admin-table-card__empty">
            No products match the selected stock filter or search criteria.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = getFirstImage(p.images);

                return (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={img}
                        alt={p.name}
                        onError={(e) => {
                          e.target.src = "/assets/images/product-images/tshirt-1.png";
                        }}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/products/${p._id}`}
                        className="admin-table__product-link"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.category?.name || "General"}</td>
                    <td>${p.price}</td>
                    <td>{p.discount ? `${p.discount}%` : "-"}</td>
                    <td>
                      {editingStockId === p._id ? (
                        <div className="admin-table__stock-edit">
                          <input
                            type="number"
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(e.target.value)}
                            className="admin-table__stock-input"
                          />
                          <button
                            onClick={() => handleUpdateStock(p._id)}
                            className="admin-table__stock-save-btn"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span
                            onClick={() => {
                              setEditingStockId(p._id);
                              setNewStockValue(p.quantity);
                            }}
                            className="admin-table__stock-val"
                            title="Click to edit stock"
                          >
                            {p.quantity} units
                          </span>
                          {p.sizes && p.sizes.length > 0 && (
                            <div className="admin-table__sizes-breakdown">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.size}
                                  className={`admin-table__size-chip admin-table__size-chip--${s.quantity === 0 ? "out" : s.quantity <= 3 ? "low" : "ok"}`}
                                  title={`${s.size}: ${s.quantity}`}
                                >
                                  {s.size}:{s.quantity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${p.quantity === 0 ? "danger" : p.quantity <= 5 ? "warning" : "success"}`}
                      >
                        {p.quantity === 0 ? "Out of stock" : p.quantity <= 5 ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
