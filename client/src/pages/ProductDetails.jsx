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
import { API_URL } from "../services/api.js";
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
      <div className="container product-detail-page__not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="product-detail-page__back-link">
          Back to all products
        </Link>
      </div>
    );
  }

  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const discountedPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/assets/images/product-images/tshirt-1.png"];
  const images = productImages.map((img) =>
    img.startsWith("http") ? img : `${API_URL || "http://localhost:5000"}${img}`
  );

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
    if (!newRating || Number(newRating) < 1 || Number(newRating) > 5) {
      toast.error("Please select a valid rating between 1 and 5 stars");
      return;
    }
    if (!newComment || !newComment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    if (newComment.trim().length < 3) {
      toast.error("Review comment must be at least 3 characters");
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
                <img
                  src={img}
                  alt={`${product.name} ${idx}`}
                  onError={(e) => {
                    e.target.src = "/assets/images/product-images/tshirt-1.png";
                  }}
                />
              </div>
            ))}
          </div>

          <div className="product-detail-page__featured-image">
            <img
              src={currentImage}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/assets/images/product-images/tshirt-1.png";
              }}
            />
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
              {[
                { hex: "#4F4E37", mod: "olive" },
                { hex: "#314F4A", mod: "teal" },
                { hex: "#31344F", mod: "navy" },
              ].map(({ hex, mod }) => (
                <div
                  key={hex}
                  className={`color-swatch color-swatch--${mod} ${
                    selectedColor === hex ? "color-swatch--selected" : ""
                  }`}
                  onClick={() => setSelectedColor(hex)}
                >
                  {selectedColor === hex && "✓"}
                </div>
              ))}
            </div>
          </div>

          {hasSizes && (
            <>
              <hr className="product-detail-page__divider" />
              <div>
                <div className="product-detail-page__size-header">
                  <h4 className="product-detail-page__option-title product-detail-page__size-title">Choose Size</h4>
                  {selectedSize && (
                    <span className="product-detail-page__size-selected">
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
                <div className="product-detail-page__stock-warning product-detail-page__stock-warning--in-stock">
                  In Stock ({currentStock} available for size {selectedSize})
                </div>
              )
            ) : (
              <div className="product-detail-page__stock-warning product-detail-page__stock-warning--in-stock">
                In Stock ({product.quantity} total available across sizes)
              </div>
            )
          ) : (
            <div className="product-detail-page__stock-warning product-detail-page__stock-warning--in-stock">
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
        <div className="product-detail-page__tab-details">
          <p>{product.description}</p>
          <p className="product-detail-page__tab-param">
            Category ID: {product.category?.name || product.category || "General"}
          </p>
          <p>Available Inventory: {product.quantity} units</p>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="product-detail-page__tab-faqs">
          <h4>What is the return policy?</h4>
          <p className="product-detail-page__faq-answer">
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
            <p className="product-detail-page__no-reviews">
              No reviews yet for this product. Be the first to leave one!
            </p>
          ) : (
            <div className="product-detail-page__reviews-grid">
              {reviews.map((rev) => {
                const isMyReview = user && (rev.user?._id === user._id || rev.user === user._id);

                return (
                  <div key={rev._id} className="testimonial-card">
                    <div className="testimonial-card__header">
                      <StarRating rating={rev.rating} showScore={false} />
                      {isMyReview && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="testimonial-card__delete-btn"
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
                    <span className="testimonial-card__date">
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
        <section className="product-detail-page__related-section">
          <h2 className="products-section__title">YOU MIGHT ALSO LIKE</h2>
          <SuggestedProductGrid products={relatedProducts} />
        </section>
      )}

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleCreateReview} className="review-form">
          <div className="review-form__field">
            <label className="review-form__label">
              Rating (1 to 5 Stars)
            </label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              className="review-form__select"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <div className="review-form__field">
            <label className="review-form__label">
              Your Comment
            </label>
            <textarea
              rows="4"
              placeholder="What did you like or dislike about this product?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="review-form__textarea"
            />
          </div>

          <div className="review-form__actions">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="review-form__cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="review-form__submit-btn"
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
