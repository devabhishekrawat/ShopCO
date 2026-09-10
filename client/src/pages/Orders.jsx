import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice.js";
import Loader from "../components/Loader.jsx";
import { getAssetUrl } from "../services/api.js";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-badge--pending";
      case "processing":
        return "status-badge--processing";
      case "shipped":
        return "status-badge--shipped";
      case "delivered":
        return "status-badge--delivered";
      default:
        return "status-badge--pending";
    }
  };

  return (
    <div className="orders-page container">
      <div className="orders-page__header">
        <h1 className="orders-page__title">MY ORDERS</h1>
      </div>

      {loading ? (
        <Loader text="Loading your orders..." />
      ) : error ? (
        <div className="orders-page__error">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-page__empty">
          <h3>You haven't placed any orders yet</h3>
          <p className="orders-page__empty-desc">
            Explore our collections and place your first order.
          </p>
          <Link
            to="/products"
            className="hero__cta orders-page__shop-btn"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <span className="order-card__id">Order #{order._id}</span>
                  <div className="order-card__date">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card__items">
                {order.products.map((item, i) => {
                  const prod = item.product;
                  const rawImg = prod?.images?.[0];
                  const itemImage = rawImg
                    ? getAssetUrl(rawImg)
                    : "/assets/images/product-images/tshirt-1.png";

                  return (
                    <div key={i} className="order-card__item">
                      <img
                        src={itemImage}
                        alt={prod?.name || "Product"}
                        onError={(e) => {
                          e.target.src = "/assets/images/product-images/tshirt-1.png";
                        }}
                      />
                      <div>
                        <strong>{prod?.name || "Purchased Product"}</strong>
                        <div className="order-card__meta">
                          {item.size && (
                            <span className="order-card__size-badge">
                              Size: {item.size}
                            </span>
                          )}
                          <span>Qty: {item.quantity} &times; ${item.price}</span>
                        </div>
                      </div>
                      <span className="order-card__item-price">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="order-card__footer">
                <div>
                  <span>Total Amount: </span>
                  <strong className="order-card__total">${order.total}</strong>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="order-card__view-btn"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
