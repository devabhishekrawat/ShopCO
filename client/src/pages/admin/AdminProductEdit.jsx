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
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Update product details and category-specific sizes.
          </p>
        </div>

        <Link to="/admin/products" style={{ textDecoration: "underline", color: "#000" }}>
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
            required
          />
        </div>

        <div className="admin-form__group">
          <label>Description *</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
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
              required
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
          <div className="admin-form__group" style={{ backgroundColor: "#fafafa", padding: "1.25rem", borderRadius: "12px", border: "1px solid #eaeaea" }}>
            <label style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              Size-Wise Inventory ({selectedCategoryObj?.name})
            </label>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
              Specify available stock quantity for each size allowed in this category.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
              {categorySizes.map((sz) => (
                <div key={sz} style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "0.75rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem", color: "#000" }}>
                    Size {sz}
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={sizeInventory[sz] !== undefined ? sizeInventory[sz] : "0"}
                    onChange={(e) => handleSizeQuantityChange(sz, e.target.value)}
                    style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-form__group" style={{ backgroundColor: "#fafafa", padding: "1.25rem", borderRadius: "12px", border: "1px solid #eaeaea" }}>
            <label style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              Product Inventory ({selectedCategoryObj?.name || "General"})
            </label>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
              This category has no size system. Enter overall item stock quantity.
            </p>
            <input
              type="number"
              min="0"
              name="quantity"
              placeholder="10"
              value={formData.quantity}
              onChange={handleChange}
              style={{ maxWidth: "200px" }}
              required
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
          <span style={{ fontSize: "0.8rem", color: "#666" }}>
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
