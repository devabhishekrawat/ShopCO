import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice.js";
import { getProductById, updateProduct } from "../../services/productService.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    quantity: "0",
    category: "",
  });

  const [sizeInventory, setSizeInventory] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const selectedCategoryObj = categories.find((c) => c._id === formData.category);
  const categorySizes = selectedCategoryObj?.sizes || [];

  useEffect(() => {
    dispatch(fetchCategories());

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        const p = data.product;
        const initialSizes = {};
        if (p.sizes && p.sizes.length > 0) {
          p.sizes.forEach((s) => {
            initialSizes[s.size] = String(s.quantity);
          });
        }
        setSizeInventory(initialSizes);

        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          discount: p.discount || "0",
          quantity: p.quantity || "0",
          category: p.category?._id || p.category || "",
        });
      } catch (err) {
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, dispatch]);

  const handleCategoryChange = (newCatId) => {
    setFormData((prev) => ({ ...prev, category: newCatId }));
    const newCat = categories.find((c) => c._id === newCatId);
    if (newCat) {
      const updated = {};
      (newCat.sizes || []).forEach((sz) => {
        updated[sz] = sizeInventory[sz] !== undefined ? sizeInventory[sz] : "0";
      });
      setSizeInventory(updated);
    }
  };

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

    try {
      setUpdating(true);

      const sizesArray = categorySizes.length > 0
        ? categorySizes.map((sz) => ({
            size: sz,
            quantity: Math.max(0, parseInt(sizeInventory[sz] || "0", 10)),
          }))
        : [];

      let payload;
      if (selectedFiles.length > 0) {
        payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("description", formData.description.trim());
        payload.append("price", formData.price);
        payload.append("discount", formData.discount);
        payload.append("category", formData.category);
        payload.append("sizes", JSON.stringify(sizesArray));
        if (categorySizes.length === 0) {
          payload.append("quantity", formData.quantity);
        }

        for (const file of selectedFiles) {
          payload.append("images", file);
        }
      } else {
        payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          discount: Number(formData.discount),
          category: formData.category,
          sizes: sizesArray,
        };
        if (categorySizes.length === 0) {
          payload.quantity = Number(formData.quantity);
        }
      }

      await updateProduct(id, payload);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader text="Loading product details..." />;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Edit Product</h1>
          <p className="admin-header__subtitle">
            Update product details and category-specific sizes.
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
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form__group">
          <label>Description *</label>
          <textarea
            name="description"
            rows="4"
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
              onChange={(e) => handleCategoryChange(e.target.value)}
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
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form__group">
            <label>Discount (%)</label>
            <input
              type="number"
              name="discount"
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
                    value={sizeInventory[sz] !== undefined ? sizeInventory[sz] : "0"}
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
          <label>Replace Images (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="admin-form__help-text">
            Leave blank to retain current product images.
          </span>
        </div>

        <button
          type="submit"
          className="admin-form__submit-btn"
          disabled={updating}
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEdit;
