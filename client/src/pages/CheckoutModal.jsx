import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../store/slices/orderSlice.js";
import { fetchCart, removeAppliedCoupon } from "../store/slices/cartSlice.js";
import Modal from "../components/Modal.jsx";
import { toast } from "react-toastify";

const CheckoutModal = ({ isOpen, onClose, finalTotal, couponCode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [shippingInfo, setShippingInfo] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "USA",
    phone: user?.phone || "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingInfo.phone || !shippingInfo.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!shippingInfo.street || !shippingInfo.street.trim()) {
      toast.error("Street address is required");
      return;
    }
    if (!shippingInfo.city || !shippingInfo.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!shippingInfo.state || !shippingInfo.state.trim()) {
      toast.error("State is required");
      return;
    }
    if (!shippingInfo.postalCode || !shippingInfo.postalCode.trim()) {
      toast.error("Postal code is required");
      return;
    }
    if (!shippingInfo.country || !shippingInfo.country.trim()) {
      toast.error("Country is required");
      return;
    }

    try {
      setPlacingOrder(true);
      const result = await dispatch(
        placeOrder({
          shippingInfo,
          couponCode: couponCode || undefined,
        })
      ).unwrap();

      toast.success("Order placed successfully!");
      dispatch(removeAppliedCoupon());
      dispatch(fetchCart());
      onClose();
      navigate(`/orders/${result._id}`);
    } catch (err) {
      toast.error(err || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout & Shipping Details">
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            value={shippingInfo.street}
            onChange={handleChange}
            placeholder="123 Fashion Blvd"
          />
        </div>

        <div className="checkout-form__grid">
          <div className="checkout-form__field">
            <label className="checkout-form__label">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="New York"
            />
          </div>
          <div className="checkout-form__field">
            <label className="checkout-form__label">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleChange}
              placeholder="NY"
            />
          </div>
        </div>

        <div className="checkout-form__grid">
          <div className="checkout-form__field">
            <label className="checkout-form__label">
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              placeholder="10001"
            />
          </div>
          <div className="checkout-form__field">
            <label className="checkout-form__label">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleChange}
              placeholder="USA"
            />
          </div>
        </div>

        <div className="checkout-form__summary">
          <div className="checkout-form__total-row">
            <span>Order Total:</span>
            <span>${finalTotal}</span>
          </div>
          <span className="checkout-form__payment-note">
            Payment method: Cash on Delivery / Standard Settlement
          </span>
        </div>

        <div className="checkout-form__actions">
          <button
            type="button"
            onClick={onClose}
            className="checkout-form__cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={placingOrder}
            className="checkout-form__submit-btn"
          >
            {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CheckoutModal;
