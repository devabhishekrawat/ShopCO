import React, { Suspense } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import Loader from "../../components/Loader.jsx";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__sidebar-header">
          <div className="admin-layout__brand-wrap">
            <div className="admin-layout__brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <h2 className="admin-layout__brand">ADMIN PANEL</h2>
              <span className="admin-layout__brand-sub">Management Portal</span>
            </div>
          </div>
        </div>

        <nav className="admin-layout__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
            </span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </span>
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/products/add"
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </span>
            <span>Add Product</span>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-layout__nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>Users</span>
          </NavLink>
        </nav>

        <div className="admin-layout__sidebar-footer">
          <Link
            to="/"
            className="admin-layout__nav-link admin-layout__nav-link--shop"
          >
            <span className="admin-layout__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span>Back to Shop</span>
          </Link>
        </div>
      </aside>

      <main className="admin-layout__content">
        <Suspense fallback={<Loader text="Loading..." />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default AdminLayout;
