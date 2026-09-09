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
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Overview Dashboard</h1>
          <p className="admin-header__subtitle">
            Real-time store metrics and inventory indicators.
          </p>
        </div>

        <Link to="/admin/products/add" className="admin-header__action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add New Product</span>
        </Link>
      </div>

      <section className="admin-section">
        <h2 className="admin-section__title">Store Overview</h2>
        <div className="stats-grid stats-grid--four">
          <div className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__title">Total Products</span>
              <div className="stat-card__icon stat-card__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value">{stats.totalProducts || 0}</span>
            <Link to="/admin/products" className="stat-card__link">
              <span>Manage Products</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__title">Total Categories</span>
              <div className="stat-card__icon stat-card__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value">{stats.totalCategories || 0}</span>
            <Link to="/admin/categories" className="stat-card__link">
              <span>Manage Categories</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__title">Total Orders</span>
              <div className="stat-card__icon stat-card__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value">{stats.totalOrders || 0}</span>
            <Link to="/admin/orders" className="stat-card__link">
              <span>View Orders</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__title">Registered Users</span>
              <div className="stat-card__icon stat-card__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value">{stats.totalUsers || 0}</span>
            <Link to="/admin/users" className="stat-card__link">
              <span>Manage Users</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section__header">
          <div>
            <h2 className="admin-section__title">Inventory Health</h2>
            <p className="admin-section__subtitle">Stock availability and replenishment status</p>
          </div>
        </div>
        <div className="stats-grid stats-grid--three">
          <div className="stat-card stat-card--success">
            <div className="stat-card__top">
              <div className="stat-card__status-wrap">
                <span className="stat-card__badge stat-card__badge--success">Optimal</span>
                <span className="stat-card__title">In Stock (&gt; 5 units)</span>
              </div>
              <div className="stat-card__icon stat-card__icon--success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value stat-card__value--success">
              {stats.inStockProducts || 0}
            </span>
            <Link to="/admin/products?stock=in_stock" className="stat-card__link stat-card__link--success">
              <span>View In-Stock Products</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>

          <div className="stat-card stat-card--warning">
            <div className="stat-card__top">
              <div className="stat-card__status-wrap">
                <span className="stat-card__badge stat-card__badge--warning">Low Alert</span>
                <span className="stat-card__title">Low Stock (≤ 5 units)</span>
              </div>
              <div className="stat-card__icon stat-card__icon--warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value stat-card__value--warning">
              {stats.lowStockProducts || 0}
            </span>
            <Link to="/admin/products?stock=low_stock" className="stat-card__link stat-card__link--warning">
              <span>View Low-Stock Products</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>

          <div className="stat-card stat-card--danger">
            <div className="stat-card__top">
              <div className="stat-card__status-wrap">
                <span className="stat-card__badge stat-card__badge--danger">Critical</span>
                <span className="stat-card__title">Out of Stock</span>
              </div>
              <div className="stat-card__icon stat-card__icon--danger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <span className="stat-card__value stat-card__value--danger">
              {stats.outOfStockProducts || 0}
            </span>
            <Link to="/admin/products?stock=out_of_stock" className="stat-card__link stat-card__link--danger">
              <span>View Out-of-Stock Products</span>
              <span className="stat-card__arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
