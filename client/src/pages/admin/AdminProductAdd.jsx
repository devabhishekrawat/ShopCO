import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice.js";
import { createProduct } from "../../services/productService.js";
import { toast } from "react-toastify";

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    quantity: "10",
    category: "",
  });

  const [sizeInventory, setSizeInventory] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCategoryObj = categories.find((c) => c._id === formData.category);
  const categorySizes = selectedCategoryObj?.sizes || [];

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    } else if (!formData.category && categories.length > 0) {
      setFormData((prev) => ({ ...prev, category: categories[0]._id }));
    }
  }, [dispatch, categories, formData.category]);

  useEffect(() => {
    if (selectedCategoryObj) {
      const initial = {};
      (selectedCategoryObj.sizes || []).forEach((sz) => {
        initial[sz] = "10";
      });
      setSizeInventory(initial);
    }
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeQuantityChange = (sizeName, value) => {
    setSizeInventory((prev) => ({
      ...prev,
      [sizeName]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.description || !formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }
    if (formData.discount && (isNaN(formData.discount) || Number(formData.discount) < 0 || Number(formData.discount) > 100)) {
      toast.error("Discount must be between 0% and 100%");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("description", formData.description.trim());
    data.append("price", formData.price);
    data.append("discount", formData.discount || "0");
    data.append("category", formData.category);

    if (categorySizes.length > 0) {
      const sizesArray = categorySizes.map((sz) => ({
        size: sz,
        quantity: Math.max(0, parseInt(sizeInventory[sz] || "0", 10)),
      }));
      data.append("sizes", JSON.stringify(sizesArray));
    } else {
      data.append("sizes", JSON.stringify([]));
      data.append("quantity", formData.quantity || "0");
    }

    for (const file of selectedFiles) {
      data.append("images", file);
    }

    try {
      setLoading(true);
      await createProduct(data);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Add New Product</h1>
          <p className="admin-header__subtitle">
            Add a garment or accessory with category-specific sizes.
          </p>
        </div>

        <Link to="/admin/products" className="admin-header__back-link">
          &larr; Back to Products
        </Link>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Graphic Vintage Cotton T-Shirt"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form__group">
          <label>Description *</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Product details, material, and sizing information..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form__group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              placeholder="120"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form__group">
            <label>Discount (%)</label>
            <input
              type="number"
              name="discount"
              placeholder="20"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
        </div>

        {categorySizes.length > 0 ? (
          <div className="admin-form__group admin-form__inventory-box">
            <label className="admin-form__inventory-label">
              Size-Wise Inventory ({selectedCategoryObj?.name})
            </label>
            <p className="admin-form__inventory-desc">
              Specify available stock quantity for each size allowed in this category.
            </p>

            <div className="admin-form__sizes-grid">
              {categorySizes.map((sz) => (
                <div key={sz} className="admin-form__size-card">
                  <div className="admin-form__size-title">
                    Size {sz}
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={sizeInventory[sz] || "0"}
                    onChange={(e) => handleSizeQuantityChange(sz, e.target.value)}
                    className="admin-form__size-input"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-form__group admin-form__inventory-box">
            <label className="admin-form__inventory-label">
              Product Inventory ({selectedCategoryObj?.name || "General"})
            </label>
            <p className="admin-form__inventory-desc">
              This category has no size system. Enter overall item stock quantity.
            </p>
            <input
              type="number"
              min="0"
              name="quantity"
              placeholder="10"
              value={formData.quantity}
              onChange={handleChange}
              className="admin-form__qty-input"
            />
          </div>
        )}

        <div className="admin-form__group">
          <label>Product Images (up to 5 images) *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="admin-form__help-text">
            Uploaded via Multer directly to server assets.
          </span>
        </div>

        <button
          type="submit"
          className="admin-form__submit-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductAdd;
