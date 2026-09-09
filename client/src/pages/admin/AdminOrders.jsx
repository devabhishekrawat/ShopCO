import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllOrders, changeOrderStatus } from "../../store/slices/orderSlice.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(changeOrderStatus({ id, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Order Management</h1>
          <p className="admin-header__subtitle">
            Review customer orders and fulfillment statuses.
          </p>
        </div>
      </div>

      <div className="admin-table-card">
        {loading && !orders.length ? (
          <Loader text="Loading orders..." />
        ) : orders.length === 0 ? (
          <div className="admin-table-card__empty">
            No orders found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="admin-table__order-link"
                    >
                      #{o._id.slice(-6)}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <strong>{o.user?.name || "Customer"}</strong>
                      <div className="admin-table__customer-email">
                        {o.user?.email || ""}
                      </div>
                    </div>
                  </td>
                  <td className="admin-table__date">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>{o.products?.length || 0} items</td>
                  <td>
                    <strong>${o.total}</strong>
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="admin-table__select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="edit-btn"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
