import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminDashboard } from "../../store/slices/adminSlice.js";
import Loader from "../../components/Loader.jsx";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  if (loading && !stats.totalProducts) {
    return <Loader text="Loading dashboard metrics..." />;
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Overview Dashboard</h1>
          <p className="admin-header__subtitle">
            Real-time store metrics and inventory indicators.
          </p>
        </div>

        <Link to="/admin/products/add" className="admin-header__action-btn">
          + Add New Product
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__title">Total Products</span>
          <span className="stat-card__value">{stats.totalProducts || 0}</span>
          <Link to="/admin/products" className="stat-card__link">
            Manage Products &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">Total Categories</span>
          <span className="stat-card__value">{stats.totalCategories || 0}</span>
          <Link to="/admin/categories" className="stat-card__link">
            Manage Categories &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">Total Orders</span>
          <span className="stat-card__value">{stats.totalOrders || 0}</span>
          <Link to="/admin/orders" className="stat-card__link">
            View Orders &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">Registered Users</span>
          <span className="stat-card__value">{stats.totalUsers || 0}</span>
          <Link to="/admin/users" className="stat-card__link">
            Manage Users &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">In Stock (&gt; 5 units)</span>
          <span className="stat-card__value stat-card__value--success">
            {stats.inStockProducts || 0}
          </span>
          <Link to="/admin/products?stock=in_stock" className="stat-card__link stat-card__link--success">
            View In-Stock Products &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">Low Stock (≤ 5 units)</span>
          <span className="stat-card__value stat-card__value--warning">
            {stats.lowStockProducts || 0}
          </span>
          <Link to="/admin/products?stock=low_stock" className="stat-card__link stat-card__link--warning">
            View Low-Stock Products &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-card__title">Out of Stock</span>
          <span className="stat-card__value stat-card__value--danger">
            {stats.outOfStockProducts || 0}
          </span>
          <Link to="/admin/products?stock=out_of_stock" className="stat-card__link stat-card__link--danger">
            View Out-of-Stock Products &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
