import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../../store/slices/categorySlice";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import { getAssetUrl } from "../../services/api";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    sizes: [],
  });
  const [newSizeInput, setNewSizeInput] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "", sizes: [] });
    setNewSizeInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      sizes: cat.sizes || [],
    });
    setNewSizeInput("");
    setModalOpen(true);
  };

  const handleAddSize = (sizeStr) => {
    const trimmed = (sizeStr || newSizeInput).trim();
    if (!trimmed) return;
    if (formData.sizes.includes(trimmed)) {
      toast.warning(`Size "${trimmed}" is already added`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, trimmed],
    }));
    setNewSizeInput("");
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));
  };

  const handleApplyPreset = (presetSizes) => {
    setFormData((prev) => ({
      ...prev,
      sizes: presetSizes,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await dispatch(removeCategory(id)).unwrap();
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err || "Failed to delete category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await dispatch(
          editCategory({ id: editingCategory._id, data: formData })
        ).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(addCategory(formData)).unwrap();
        toast.success("Category created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err || "Operation failed");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Category Management</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Create and organize store product categories with size systems.
          </p>
        </div>

        <button className="admin-header__action-btn" onClick={handleOpenAdd}>
          + Add Category
        </button>
      </div>

      <div className="admin-table-card">
        {loading && !categories.length ? (
          <Loader text="Loading categories..." />
        ) : categories.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            No categories found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Allowed Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const img = c.image
                  ? getAssetUrl(c.image)
                  : "/assets/images/background-images/casual-1.png";

                return (
                  <tr key={c._id}>
                    <td>
                      <img
                        src={img}
                        alt={c.name}
                        onError={(e) => {
                          e.target.src = "/assets/images/background-images/casual-1.png";
                        }}
                      />
                    </td>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td style={{ color: "#666" }}>{c.description || "-"}</td>
                    <td>
                      {c.sizes && c.sizes.length > 0 ? (
                        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                          {c.sizes.map((sz) => (
                            <span
                              key={sz}
                              style={{
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px",
                                backgroundColor: "#f0f0f0",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "#999", fontSize: "0.85rem" }}>No sizes</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleOpenEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(c._id)}
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
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Hoodies & Sweatshirts"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief overview of garments in this category..."
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Image URL / Path
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="/assets/category-tshirts.jpg"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Category Size System
            </label>
            <span style={{ display: "block", fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>
              Define valid sizes for this category. Leave empty for categories without sizes (e.g. Accessories).
            </span>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", alignSelf: "center", color: "#555" }}>Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(["XS", "S", "M", "L", "XL", "XXL"])}
                style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.75rem", cursor: "pointer", background: "#f8f8f8" }}
              >
                Clothing (XS-XXL)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(["28", "30", "32", "34", "36", "38", "40"])}
                style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.75rem", cursor: "pointer", background: "#f8f8f8" }}
              >
                Jeans (28-40)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(["6", "7", "8", "9", "10", "11", "12"])}
                style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.75rem", cursor: "pointer", background: "#f8f8f8" }}
              >
                Shoes (6-12)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset([])}
                style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.75rem", cursor: "pointer", background: "#f8f8f8", color: "#ff3333" }}
              >
                None
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <input
                type="text"
                placeholder="Add custom size (e.g. S, 32, One Size)"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddSize()}
                style={{ padding: "0.4rem 1rem", backgroundColor: "#000", color: "#fff", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", minHeight: "36px", padding: "0.5rem", border: "1px dashed #ccc", borderRadius: "8px" }}>
              {formData.sizes.length === 0 ? (
                <span style={{ fontSize: "0.8rem", color: "#999" }}>No sizes configured yet.</span>
              ) : (
                formData.sizes.map((sz) => (
                  <span
                    key={sz}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      backgroundColor: "#000",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {sz}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(sz)}
                      style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{ padding: "0.6rem 1.2rem", borderRadius: "64px", border: "1px solid #ccc", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="newsletter-card__btn"
              style={{ backgroundColor: "#000", color: "#fff", width: "auto", padding: "0.6rem 1.5rem" }}
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
