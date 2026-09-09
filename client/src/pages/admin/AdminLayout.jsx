import React, { Suspense } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import Loader from "../../components/Loader.jsx";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__sidebar-header">
          <h2 className="admin-layout__brand">
            ADMIN PANEL
          </h2>
          <span className="admin-layout__brand-sub">Management Portal</span>
        </div>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>👕</span> Products
        </NavLink>

        <NavLink
          to="/admin/products/add"
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>➕</span> Add Product
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>🏷️</span> Categories
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>📦</span> Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-layout__nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>👥</span> Users
        </NavLink>

        <div className="admin-layout__sidebar-footer">
          <Link
            to="/"
            className="admin-layout__nav-link admin-layout__nav-link--shop"
          >
            <span>🏪</span> Back to Shop
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
