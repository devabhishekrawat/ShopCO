import React, { Suspense } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import Loader from "../../components/Loader";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div style={{ padding: "0 0.5rem 1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", marginBottom: "0.5rem" }}>
          <h2 style={{ fontFamily: "Integral CF", fontSize: "1.2rem", fontWeight: 900 }}>
            ADMIN PANEL
          </h2>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>Management Portal</span>
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

        <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
          <Link
            to="/"
            className="admin-layout__nav-link"
            style={{ color: "#000", border: "1px solid #ccc" }}
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
