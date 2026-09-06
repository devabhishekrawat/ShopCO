import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductDetails } from "../store/slices/productSlice.js";
import { addItemToCart } from "../store/slices/cartSlice.js";
import { getProductReviews, createReview, deleteReview } from "../services/reviewService.js";
import { getProducts } from "../services/productService.js";
import StarRating from "../components/StarRating.jsx";
import Loader from "../components/Loader.jsx";
import Modal from "../components/Modal.jsx";
import { toast } from "react-toastify";
import { getAllImages } from "../services/api.js";
import SuggestedProductGrid from "../components/SuggestedProductGrid.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, detailsLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Olive");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(fetchProductDetails(id));
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedSize("");

    const loadReviews = async () => {
      try {
        const res = await getProductReviews(id);
        setReviews(res.reviews || []);
      } catch (err) {
        console.error(err);
      }
    };

    const loadRelated = async () => {
      try {
        const res = await getProducts({ limit: 5 });
        setRelatedProducts(res.products?.filter((p) => p._id !== id) || []);
        console.log(res.products)
      } catch (err) {
        console.error(err);
      }
    };

    loadReviews();
    loadRelated();
  }, [id, dispatch]);

  if (detailsLoading) {
    return <Loader text="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ color: "#000", textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}>
          Back to all products
        </Link>
      </div>
    );
  }

  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const discountedPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const images = getAllImages(product.images);

  const currentImage = images[activeImageIndex] || images[0];
  const hasSizes = Boolean(product.sizes && product.sizes.length > 0);
  const selectedSizeObj = hasSizes && selectedSize
    ? product.sizes.find((s) => s.size === selectedSize)
    : null;
  const currentStock = hasSizes
    ? (selectedSizeObj ? selectedSizeObj.quantity : 0)
    : product.quantity;
  const isProductOutOfStock = product.quantity === 0 || product.status === "OUT_OF_STOCK";
  const isSelectedSizeOutOfStock = Boolean(hasSizes && selectedSize && currentStock === 0);
  const maxAllowedQty = hasSizes
    ? (selectedSizeObj ? selectedSizeObj.quantity : 1)
    : product.quantity;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (hasSizes && isSelectedSizeOutOfStock) {
      toast.error(`Size ${selectedSize} is out of stock`);
      return;
    }

    if (isProductOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      await dispatch(
        addItemToCart({
          productId: product._id,
          quantity,
          size: selectedSize || "",
        })
      ).unwrap();
      toast.success(`${product.name}${selectedSize ? ` (${selectedSize})` : ""} added to cart!`);
    } catch (err) {
      toast.error(err || "Failed to add to cart");
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please enter your review comment");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await createReview({
        productId: product._id,
        rating: Number(newRating),
        comment: newComment.trim(),
      });
      setReviews([res.review, ...reviews]);
      toast.success("Review submitted successfully");
      setReviewModalOpen(false);
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="product-detail-page container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <Link to="/products">Shop</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <span className="breadcrumb__current">{product.name}</span>
      </nav>

      <div className="product-detail-page__main">
        <div className="product-detail-page__gallery">
          <div className="product-detail-page__thumbnails">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`product-detail-page__thumb ${activeImageIndex === idx ? "product-detail-page__thumb--active" : ""
                  }`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={img} alt={`${product.name} ${idx}`} />
              </div>
            ))}
          </div>

          <div className="product-detail-page__featured-image">
            <img src={currentImage} alt={product.name} />
          </div>
        </div>

        <div className="product-detail-page__info">
          <h1 className="product-detail-page__title">{product.name}</h1>

          <div className="product-detail-page__rating">
            <StarRating rating={product.rating || 4.5} />
          </div>

          <div className="product-detail-page__price">
            <span>${hasDiscount ? discountedPrice : product.price}</span>
            {hasDiscount && (
              <>
                <span className="original">${product.price}</span>
                <span className="badge">-{product.discount}%</span>
              </>
            )}
          </div>

          <p className="product-detail-page__description">
            {product.description}
          </p>

          <hr className="product-detail-page__divider" />

          <div>
            <h4 className="product-detail-page__option-title">Select Colors</h4>
            <div className="product-detail-page__colors">
              {["#4F4E37", "#314F4A", "#31344F"].map((colorHex, i) => (
                <div
                  key={colorHex}
                  className={`color-swatch ${selectedColor === colorHex ? "color-swatch--selected" : ""
                    }`}
                  style={{ backgroundColor: colorHex }}
                  onClick={() => setSelectedColor(colorHex)}
                >
                  {selectedColor === colorHex && "✓"}
                </div>
              ))}
            </div>
          </div>

          {hasSizes && (
            <>
              <hr className="product-detail-page__divider" />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h4 className="product-detail-page__option-title" style={{ margin: 0 }}>Choose Size</h4>
                  {selectedSize && (
                    <span style={{ fontSize: "0.85rem", color: "#666" }}>
                      Selected: <strong>{selectedSize}</strong>
                    </span>
                  )}
                </div>
                <div className="product-detail-page__sizes">
                  {product.sizes.map((s) => {
                    const isOutOfStockSize = s.quantity === 0;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={isOutOfStockSize}
                        className={`size-btn ${selectedSize === s.size ? "size-btn--selected" : ""
                          } ${isOutOfStockSize ? "size-btn--disabled" : ""}`}
                        onClick={() => {
                          setSelectedSize(s.size);
                          setQuantity(1);
                        }}
                        title={isOutOfStockSize ? `${s.size} (Out of stock)` : `${s.size} (${s.quantity} available)`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <hr className="product-detail-page__divider" />

          {isProductOutOfStock ? (
            <div className="product-detail-page__stock-warning">
              This product is currently OUT OF STOCK.
            </div>
          ) : hasSizes ? (
            selectedSize ? (
              isSelectedSizeOutOfStock ? (
                <div className="product-detail-page__stock-warning">
                  Size {selectedSize} is OUT OF STOCK.
                </div>
              ) : (
                <div className="product-detail-page__stock-warning" style={{ color: "#01b763" }}>
                  In Stock ({currentStock} available for size {selectedSize})
                </div>
              )
            ) : (
              <div className="product-detail-page__stock-warning" style={{ color: "#01b763" }}>
                In Stock ({product.quantity} total available across sizes)
              </div>
            )
          ) : (
            <div className="product-detail-page__stock-warning" style={{ color: "#01b763" }}>
              In Stock ({product.quantity} available)
            </div>
          )}

          <div className="product-detail-page__actions">
            <div className="product-detail-page__quantity">
              <button
                type="button"
                disabled={quantity <= 1 || isProductOutOfStock || isSelectedSizeOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                disabled={quantity >= maxAllowedQty || isProductOutOfStock || isSelectedSizeOutOfStock}
                onClick={() => setQuantity((q) => Math.min(maxAllowedQty, q + 1))}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="product-detail-page__add-cart-btn"
              disabled={isProductOutOfStock || isSelectedSizeOutOfStock}
              onClick={handleAddToCart}
            >
              {isProductOutOfStock || isSelectedSizeOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="product-detail-page__tabs">
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Product Details
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Rating & Reviews ({reviews.length})
        </button>
        <button
          className={activeTab === "faqs" ? "active" : ""}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>
      </div>

      {activeTab === "details" && (
        <div style={{ padding: "1rem 0 3rem", lineHeight: "1.8", color: "#666" }}>
          <p>{product.description}</p>
          <p style={{ marginTop: "1rem" }}>
            Category ID: {product.category?.name || product.category || "General"}
          </p>
          <p>Available Inventory: {product.quantity} units</p>
        </div>
      )}

      {activeTab === "faqs" && (
        <div style={{ padding: "1rem 0 3rem", color: "#666" }}>
          <h4>What is the return policy?</h4>
          <p style={{ marginBottom: "1.5rem" }}>
            We offer 30-day free returns for unused garments in their original packaging.
          </p>
          <h4>How do I track my order?</h4>
          <p>
            You can view your order tracking directly in the "My Orders" section under your account profile.
          </p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <div className="product-detail-page__reviews-header">
            <h3>All Reviews ({reviews.length})</h3>
            {isAuthenticated && (
              <button
                className="write-review-btn"
                onClick={() => setReviewModalOpen(true)}
              >
                Write a Review
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p style={{ color: "#666", padding: "2rem 0" }}>
              No reviews yet for this product. Be the first to leave one!
            </p>
          ) : (
            <div className="product-detail-page__reviews-grid">
              {reviews.map((rev) => {
                const isMyReview = user && (rev.user?._id === user._id || rev.user === user._id);

                return (
                  <div key={rev._id} className="testimonial-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <StarRating rating={rev.rating} showScore={false} />
                      {isMyReview && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          style={{ color: "#ff3333", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <h4 className="testimonial-card__name">
                      {rev.user?.name || "Verified Customer"}
                      <img src="/assets/icons/green-approve-icon.svg" alt="verified" />
                    </h4>
                    <p className="testimonial-card__text">"{rev.comment}"</p>
                    <span style={{ fontSize: "0.8rem", color: "#999" }}>
                      Posted on {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "4rem" }}>
          <h2 className="products-section__title">YOU MIGHT ALSO LIKE</h2>
          <SuggestedProductGrid products={relatedProducts} />
        </section>
      )}

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleCreateReview} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Rating (1 to 5 Stars)
            </label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px" }}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Your Comment
            </label>
            <textarea
              rows="4"
              placeholder="What did you like or dislike about this product?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              style={{ padding: "0.6rem 1.2rem", borderRadius: "64px", border: "1px solid #ccc", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="newsletter-card__btn"
              style={{ backgroundColor: "#000", color: "#fff", width: "auto", padding: "0.6rem 1.5rem" }}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetails;
