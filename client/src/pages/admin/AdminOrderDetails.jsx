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
          <p className="admin-header__subtitle">
            Customer: {order.user?.name} ({order.user?.email})
          </p>
        </div>

        <div className="admin-order-status-bar">
          <span>Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="admin-table__select"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="admin-order-grid">
        <div className="admin-table-card">
          <h3 className="admin-card-title">Purchased Items</h3>
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
                      <div className="admin-table__item-cell">
                        <img src={img} alt="" className="admin-table__item-img" />
                        <div>
                          <div>{p?.name || "Deleted Product"}</div>
                          {item.size && (
                            <span className="admin-table__item-size">
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

        <div className="admin-order-sidebar">
          <div className="admin-table-card">
            <h3 className="admin-card-title">Shipping Details</h3>
            <p className="admin-order-info-text">
              {order.shippingInfo?.street}<br />
              {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}<br />
              {order.shippingInfo?.country}<br />
              Phone: {order.shippingInfo?.phone}
            </p>
          </div>

          <div className="admin-table-card">
            <h3 className="admin-card-title">Payment Summary</h3>
            <div className="admin-order-summary-list">
              <div className="admin-order-summary-row">
                <span>Subtotal:</span>
                <span>${order.subtotal}</span>
              </div>
              <div className="admin-order-summary-row admin-order-summary-row--discount">
                <span>Discount:</span>
                <span>-${order.discount || 0}</span>
              </div>
              <hr className="admin-order-divider" />
              <div className="admin-order-summary-row admin-order-summary-row--total">
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
