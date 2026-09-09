import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService.js";
import Loader from "../components/Loader.jsx";

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
      <div className="container order-details-page__not-found">
        <h2 className="order-details-page__not-found-title">Order Not Found</h2>
        <p className="order-details-page__not-found-error">{error}</p>
        <Link to="/orders" className="order-details-page__not-found-link">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const shipping = order.shippingInfo || {};

  return (
    <div className="container order-details-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <Link to="/orders">Orders</Link>
        <span className="breadcrumb__separator">&gt;</span>
        <span className="breadcrumb__current">Order #{order._id}</span>
      </nav>

      <div className="order-details-page__header">
        <h1 className="order-details-page__title">
          ORDER DETAILS
        </h1>
        <span
          className={`status-badge status-badge--${order.status === "Delivered" ? "success" : "warning"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="order-details-page__grid">
        <div className="order-details-card">
          <h2 className="order-details-card__title">
            Items Ordered ({order.products?.length || 0})
          </h2>

          <div className="order-details-items">
            {order.products.map((item, i) => {
              const prod = item.product;
              const imgUrl = getFirstImage(prod?.images);

              return (
                <div key={i} className="order-details-item">
                  <img
                    src={imgUrl}
                    alt={prod?.name || "Product"}
                    className="order-details-item__img"
                    onError={(e) => {
                      e.target.src = "/assets/images/product-images/tshirt-1.png";
                    }}
                  />
                  <div className="order-details-item__info">
                    <strong className="order-details-item__name">
                      {prod ? (
                        <Link to={`/products/${prod._id}`}>{prod.name}</Link>
                      ) : (
                        "Product Item"
                      )}
                    </strong>
                    <div className="order-details-item__meta">
                      {item.size && (
                        <span className="order-details-item__size">
                          Size: {item.size}
                        </span>
                      )}
                      <span>Price at purchase: ${item.price} &times; {item.quantity}</span>
                    </div>
                  </div>
                  <strong className="order-details-item__total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-details-page__sidebar">
          <div className="order-details-card">
            <h2 className="order-details-card__title">
              Delivery Information
            </h2>
            <div className="order-details-card__address">
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

          <div className="order-details-card">
            <h2 className="order-details-card__title">
              Payment Summary
            </h2>
            <div className="order-details-summary">
              <div className="order-details-summary__row">
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              <div className="order-details-summary__row order-details-summary__row--discount">
                <span>Coupon Discount</span>
                <span>-${order.discount || 0}</span>
              </div>
              <div className="order-details-summary__row">
                <span>Delivery Fee</span>
                <span>$15</span>
              </div>
              <hr className="order-details-summary__divider" />
              <div className="order-details-summary__row order-details-summary__row--total">
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
