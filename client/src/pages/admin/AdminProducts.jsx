import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, removeProduct } from "../../store/slices/productSlice";
import { updateProductQuantity } from "../../services/productService";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";
import { getFirstImage } from "../../services/api";

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
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Total matching products: {totalProducts}
          </p>
        </div>

        <Link to="/admin/products/add" className="admin-header__action-btn">
          + Add Product
        </Link>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: "340px", flex: 1, display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search by title & press Enter..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#666" }}>Stock:</span>
          <button
            type="button"
            onClick={() => handleStockFilterChange("")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: !currentStock ? "#000" : "#fff",
              color: !currentStock ? "#fff" : "#000",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            All Products
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("in_stock")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #01b763",
              backgroundColor: currentStock === "in_stock" ? "#01b763" : "#fff",
              color: currentStock === "in_stock" ? "#fff" : "#01b763",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✅ In Stock (&gt; 5)
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("low_stock")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #e67e22",
              backgroundColor: currentStock === "low_stock" ? "#e67e22" : "#fff",
              color: currentStock === "low_stock" ? "#fff" : "#e67e22",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⚠️ Low Stock (≤ 5)
          </button>
          <button
            type="button"
            onClick={() => handleStockFilterChange("out_of_stock")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ff3333",
              backgroundColor: currentStock === "out_of_stock" ? "#ff3333" : "#fff",
              color: currentStock === "out_of_stock" ? "#fff" : "#ff3333",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⛔ Out of Stock (0)
          </button>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <Loader text="Loading products..." />
        ) : products.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
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
                        style={{ fontWeight: 600, color: "#000" }}
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.category?.name || "General"}</td>
                    <td>${p.price}</td>
                    <td>{p.discount ? `${p.discount}%` : "-"}</td>
                    <td>
                      {editingStockId === p._id ? (
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <input
                            type="number"
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(e.target.value)}
                            style={{ width: "60px", padding: "0.2rem" }}
                          />
                          <button
                            onClick={() => handleUpdateStock(p._id)}
                            style={{ padding: "0.2rem 0.5rem", background: "#000", color: "#fff", borderRadius: "4px" }}
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
                            style={{ cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
                            title="Click to edit stock"
                          >
                            {p.quantity} units
                          </span>
                          {p.sizes && p.sizes.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px", maxWidth: "160px" }}>
                              {p.sizes.map((s) => (
                                <span
                                  key={s.size}
                                  style={{
                                    fontSize: "0.72rem",
                                    padding: "1px 5px",
                                    borderRadius: "4px",
                                    background: s.quantity === 0 ? "#f8d7da" : s.quantity <= 3 ? "#fff3cd" : "#f0f0f0",
                                    color: s.quantity === 0 ? "#721c24" : s.quantity <= 3 ? "#856404" : "#333",
                                    fontWeight: 500,
                                  }}
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
                        className="status-badge"
                        style={{
                          backgroundColor: p.quantity === 0 ? "#f8d7da" : p.quantity <= 5 ? "#fff3cd" : "#d4edda",
                          color: p.quantity === 0 ? "#721c24" : p.quantity <= 5 ? "#856404" : "#155724",
                        }}
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
