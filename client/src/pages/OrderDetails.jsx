import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import Loader from "../components/Loader";
import { getFirstImage } from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <Loader text="Loading order details..." />;

  if (error || !order) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2>Order Not Found</h2>
        <p style={{ color: "#ff3333", marginTop: "0.5rem" }}>{error}</p>
        <Link to="/orders" style={{ textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}>
          Back to My Orders
        </Link>
      </div>
    );
  }

  const shipping = order.shippingInfo || {};

  return (
    <div className="container" style={{ padding: "2rem 1rem 4rem" }}>
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <Link to="/orders">Orders</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <span className="breadcrumb__current">Order #{order._id}</span>
      </nav>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "Integral CF", fontSize: "1.75rem", fontWeight: 900 }}>
          ORDER DETAILS
        </h1>
        <span
          className="status-badge"
          style={{
            backgroundColor: order.status === "Delivered" ? "#d4edda" : "#fff3cd",
            color: order.status === "Delivered" ? "#155724" : "#856404",
          }}
        >
          {order.status}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>
        <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", padding: "1.5rem", backgroundColor: "#fff" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            Items Ordered ({order.products?.length || 0})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {order.products.map((item, i) => {
              const prod = item.product;
              const imgUrl = getFirstImage(prod?.images);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={prod?.name || "Product"}
                    style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", backgroundColor: "#f0f0f0" }}
                    onError={(e) => {
                      e.target.src = "/assets/images/product-images/tshirt-1.png";
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "1rem" }}>
                      {prod ? (
                        <Link to={`/products/${prod._id}`}>{prod.name}</Link>
                      ) : (
                        "Product Item"
                      )}
                    </strong>
                    <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {item.size && (
                        <span style={{ background: "#f0f0f0", padding: "1px 6px", borderRadius: "4px", fontWeight: 600, color: "#111" }}>
                          Size: {item.size}
                        </span>
                      )}
                      <span>Price at purchase: ${item.price} &times; {item.quantity}</span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "1.1rem" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", padding: "1.5rem", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Delivery Information
            </h2>
            <div style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#444" }}>
              <p><strong>Phone:</strong> {shipping.phone || "Not specified"}</p>
              <p><strong>Address:</strong> {shipping.street || ""}</p>
              <p>
                {shipping.city ? `${shipping.city}, ` : ""}
                {shipping.state ? `${shipping.state} ` : ""}
                {shipping.postalCode || ""}
              </p>
              <p>{shipping.country || ""}</p>
            </div>
          </div>

          <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", padding: "1.5rem", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Payment Summary
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.95rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#ff3333" }}>
                <span>Coupon Discount</span>
                <span>-${order.discount || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                <span>Delivery Fee</span>
                <span>$15</span>
              </div>
              <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1px solid #eee" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.2rem" }}>
                <span>Final Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
