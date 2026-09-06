import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../store/slices/orderSlice";
import { fetchCart, removeAppliedCoupon } from "../store/slices/cartSlice";
import Modal from "../components/Modal";
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
    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.phone) {
      toast.error("Please fill in all required shipping fields");
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
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            value={shippingInfo.street}
            onChange={handleChange}
            placeholder="123 Fashion Blvd"
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              City *
            </label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="New York"
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              State
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              placeholder="10001"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Country
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

        <div style={{ padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
            <span>Order Total:</span>
            <span>${finalTotal}</span>
          </div>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>
            Payment method: Cash on Delivery / Standard Settlement
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "0.6rem 1.2rem", borderRadius: "64px", border: "1px solid #ccc", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={placingOrder}
            className="newsletter-card__btn"
            style={{ backgroundColor: "#000", color: "#fff", width: "auto", padding: "0.6rem 1.5rem" }}
          >
            {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CheckoutModal;
