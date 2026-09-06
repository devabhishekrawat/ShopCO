import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  changeCartQuantity,
  deleteCartItem,
  resetCart,
  applyCouponCode,
  removeAppliedCoupon,
} from "../store/slices/cartSlice";
import CheckoutModal from "./CheckoutModal";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { getFirstImage } from "../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, appliedCoupon, loading, couponError } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [promoCode, setPromoCode] = useState("");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const items = cart?.products || [];

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.product) return sum;
      const product = item.product;
      const effectivePrice = product.discount && product.discount > 0
        ? Math.round(product.price - (product.price * product.discount) / 100)
        : product.price;
      return sum + effectivePrice * item.quantity;
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percentage") {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);

  const deliveryFee = items.length > 0 ? 15 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleUpdateQty = async (productId, currentQty, delta, maxStock, size, itemId) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (maxStock !== undefined && newQty > maxStock) {
      toast.warning(`Maximum available stock is ${maxStock}`);
      return;
    }

    try {
      await dispatch(
        changeCartQuantity({ productId, quantity: newQty, size, itemId })
      ).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId, size, itemId) => {
    try {
      await dispatch(deleteCartItem({ productId, size, itemId })).unwrap();
      toast.info("Item removed from cart");
    } catch (err) {
      toast.error(err || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(resetCart()).unwrap();
      toast.info("Cart cleared");
    } catch (err) {
      toast.error(err || "Failed to clear cart");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const coupon = await dispatch(
        applyCouponCode(promoCode.trim())
      ).unwrap();
      toast.success(`Coupon ${coupon.code} applied!`);
      setPromoCode("");
    } catch {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to proceed to checkout");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page container">
        <h1 className="cart-page__title">YOUR CART</h1>
        <div className="cart-page__empty">
          <h3>You are not signed in</h3>
          <p>Please sign in to view your cart and start shopping.</p>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return <Loader text="Loading your cart..." />;
  }

  return (
    <div className="cart-page container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <span className="breadcrumb__current">Cart</span>
      </nav>

      <h1 className="cart-page__title">YOUR CART</h1>

      {items.length === 0 ? (
        <div className="cart-page__empty">
          <h3>Your cart is empty</h3>
          <p>Explore our wide collection and pick your favorite items.</p>
          <Link to="/products">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-page__layout">
          <div className="cart-page__items">
            <button
              className="cart-page__clear-btn"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>

            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const hasDiscount = Boolean(product.discount && product.discount > 0);
              const effectivePrice = hasDiscount
                ? Math.round(product.price - (product.price * product.discount) / 100)
                : product.price;

              const itemImage = getFirstImage(product.images);

              const sizeStock =
                item.size && product.sizes && product.sizes.length > 0
                  ? product.sizes.find((s) => s.size === item.size)?.quantity ?? product.quantity
                  : product.quantity;

              return (
                <div key={item._id || `${product._id}-${item.size || "default"}`} className="cart-item">
                  <div className="cart-item__image-wrap">
                    <img
                      src={itemImage}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/assets/images/product-images/tshirt-1.png";
                      }}
                    />
                  </div>

                  <div className="cart-item__info">
                    <div className="cart-item__header">
                      <Link
                        to={`/products/${product._id}`}
                        className="cart-item__name"
                      >
                        {product.name}
                      </Link>
                      <span
                        className="cart-item__delete-btn"
                        onClick={() => handleRemoveItem(product._id, item.size, item._id)}
                      >
                        <img
                          src="/assets/icons/delete.svg"
                          alt="remove"
                        />
                      </span>
                    </div>

                    {item.size ? (
                      <span className="cart-item__detail">
                        Size: <strong>{item.size}</strong>
                      </span>
                    ) : null}
                    <span className="cart-item__detail">
                      Color: <strong>Standard</strong>
                    </span>

                    <div className="cart-item__footer">
                      <span className="cart-item__price">${effectivePrice}</span>

                      <div className="cart-item__stepper">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQty(
                              product._id,
                              item.quantity,
                              -1,
                              sizeStock,
                              item.size,
                              item._id
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQty(
                              product._id,
                              item.quantity,
                              1,
                              sizeStock,
                              item.size,
                              item._id
                            )
                          }
                          disabled={item.quantity >= sizeStock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-summary">
            <h2 className="order-summary__title">Order Summary</h2>

            <div className="order-summary__row">
              <span>Subtotal</span>
              <strong style={{ color: "#000" }}>${subtotal}</strong>
            </div>

            <div className="order-summary__row order-summary__row--discount">
              <span>
                Discount {appliedCoupon ? `(-${appliedCoupon.discountValue}${appliedCoupon.discountType === "percentage" ? "%" : "$"})` : "(-0%)"}
              </span>
              <span>-${discountAmount}</span>
            </div>

            <div className="order-summary__row">
              <span>Delivery Fee</span>
              <strong style={{ color: "#000" }}>${deliveryFee}</strong>
            </div>

            <hr className="order-summary__divider" />

            <div className="order-summary__row order-summary__row--total">
              <span>Total</span>
              <span>${finalTotal}</span>
            </div>

            <div className="promo-box">
              <div className="promo-box__input-wrap">
                <img
                  src="/assets/icons/discount.svg"
                  alt="discount"
                />
                <input
                  type="text"
                  placeholder="Add promo code (e.g. WELCOME10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="promo-box__btn"
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  color: "#01b763",
                  fontWeight: 600,
                }}
              >
                <span>Coupon "{appliedCoupon.code}" active</span>
                <button
                  type="button"
                  onClick={() => dispatch(removeAppliedCoupon())}
                  style={{ color: "#ff3333", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <span style={{ color: "#ff3333", fontSize: "0.85rem" }}>
                {couponError}
              </span>
            )}

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckoutClick}
            >
              <span>Go to Checkout</span>
              <img
                src="/assets/icons/right-white.svg"
                alt="go"
              />
            </button>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        finalTotal={finalTotal}
        couponCode={appliedCoupon?.code}
      />
    </div>
  );
};

export default Cart;
