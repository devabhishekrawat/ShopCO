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
          <p className="admin-header__subtitle">
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
          <div className="admin-table-card__empty">
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
                    <td className="admin-table__desc">{c.description || "-"}</td>
                    <td>
                      {c.sizes && c.sizes.length > 0 ? (
                        <div className="admin-table__sizes">
                          {c.sizes.map((sz) => (
                            <span
                              key={sz}
                              className="admin-table__size-tag"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="admin-table__no-sizes">No sizes</span>
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
        <form onSubmit={handleSubmit} className="category-form">
          <div className="category-form__field">
            <label className="category-form__label">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Hoodies & Sweatshirts"
            />
          </div>

          <div className="category-form__field">
            <label className="category-form__label">
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

          <div className="category-form__field">
            <label className="category-form__label">
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

          <div className="category-form__field">
            <label className="category-form__label">
              Category Size System
            </label>
            <span className="category-form__help-text">
              Define valid sizes for this category. Leave empty for categories without sizes (e.g. Accessories).
            </span>

            <div className="category-form__presets">
              <span className="category-form__preset-label">Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(["XS", "S", "M", "L", "XL", "XXL"])}
                className="category-form__preset-btn"
              >
                Clothing (XS-XXL)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(["28", "30", "32", "34", "36", "38", "40"])}
                className="category-form__preset-btn"
              >
                Jeans (28-40)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(["6", "7", "8", "9", "10", "11", "12"])}
                className="category-form__preset-btn"
              >
                Shoes (6-12)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset([])}
                className="category-form__preset-btn category-form__preset-btn--none"
              >
                None
              </button>
            </div>

            <div className="category-form__add-size-row">
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
                className="category-form__add-size-btn"
              >
                + Add
              </button>
            </div>

            <div className="category-form__sizes-box">
              {formData.sizes.length === 0 ? (
                <span className="category-form__empty-sizes">No sizes configured yet.</span>
              ) : (
                formData.sizes.map((sz) => (
                  <span
                    key={sz}
                    className="category-form__size-tag"
                  >
                    {sz}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(sz)}
                      className="category-form__size-remove-btn"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="category-form__actions">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="category-form__cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="category-form__submit-btn"
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
