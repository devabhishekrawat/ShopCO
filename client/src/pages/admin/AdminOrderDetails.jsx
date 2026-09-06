import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderByIdAdmin, updateOrderStatusAdmin } from "../../services/orderService.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";
import { getAssetUrl } from "../../services/api.js";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderByIdAdmin(id);
      setOrder(data.order);
    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatusAdmin(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      loadOrder();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader text="Loading order details..." />;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Order #{order._id}</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Customer: {order.user?.name} ({order.user?.email})
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{ padding: "0.4rem 0.8rem", borderRadius: "8px", fontWeight: 700 }}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div className="admin-table-card">
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Purchased Items</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, idx) => {
                const p = item.product;
                const img = p?.images?.length
                  ? getAssetUrl(p.images[0])
                  : "/assets/images/product-images/tshirt-1.png";

                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img src={img} alt="" style={{ width: "40px", height: "40px", borderRadius: "6px" }} />
                        <div>
                          <div>{p?.name || "Deleted Product"}</div>
                          {item.size && (
                            <span style={{ fontSize: "0.8rem", color: "#444", background: "#f0f0f0", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>{item.quantity}</td>
                    <td><strong>${(item.price * item.quantity).toFixed(2)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="admin-table-card">
            <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Shipping Details</h3>
            <p style={{ fontSize: "0.9rem", color: "#444", lineHeight: "1.6" }}>
              {order.shippingInfo?.street}<br />
              {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}<br />
              {order.shippingInfo?.country}<br />
              Phone: {order.shippingInfo?.phone}
            </p>
          </div>

          <div className="admin-table-card">
            <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Payment Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal:</span>
                <span>${order.subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#ff3333" }}>
                <span>Discount:</span>
                <span>-${order.discount || 0}</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
                <span>Total:</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
