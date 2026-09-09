import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import { getAssetUrl } from "../services/api.js";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const discountedPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const ratingValue = product.rating || 4.5;
  const isOutOfStock = product.quantity === 0 || product.status === "OUT_OF_STOCK";

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card__image-wrapper">
        <img
          src={getAssetUrl(product.images?.[0])}
          alt={product.name}
          className="product-card__image"
          onError={(e) => {
            e.target.src = "/assets/images/product-images/tshirt-1.png";
          }}
        />
        {isOutOfStock && (
          <span className="product-card__out-of-stock-badge">
            OUT OF STOCK
          </span>
        )}
      </div>

      <h3 className="product-card__title">{product.name}</h3>

      <div className="product-card__rating">
        <StarRating rating={ratingValue} />
      </div>

      <div className="product-card__price">
        <span>${hasDiscount ? discountedPrice : product.price}</span>
        {hasDiscount && (
          <>
            <span className="original">${product.price}</span>
            <span className="badge">-{product.discount}%</span>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
