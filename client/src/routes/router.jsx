import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Loader from "../components/Loader";

import Home from "../pages/Home";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import ErrorPage from "../pages/ErrorPage";

const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminProductAdd = lazy(() => import("../pages/admin/AdminProductAdd"));
const AdminProductEdit = lazy(() => import("../pages/admin/AdminProductEdit"));
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminOrderDetails = lazy(() => import("../pages/admin/AdminOrderDetails"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Suspense fallback={<Loader text="Loading Admin..." />}>
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader text="Loading Dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: "products",
            element: (
              <Suspense fallback={<Loader text="Loading Products..." />}>
                <AdminProducts />
              </Suspense>
            ),
          },
          {
            path: "products/add",
            element: (
              <Suspense fallback={<Loader text="Loading..." />}>
                <AdminProductAdd />
              </Suspense>
            ),
          },
          {
            path: "products/edit/:id",
            element: (
              <Suspense fallback={<Loader text="Loading..." />}>
                <AdminProductEdit />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<Loader text="Loading Categories..." />}>
                <AdminCategories />
              </Suspense>
            ),
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<Loader text="Loading Orders..." />}>
                <AdminOrders />
              </Suspense>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <Suspense fallback={<Loader text="Loading Order Details..." />}>
                <AdminOrderDetails />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<Loader text="Loading Users..." />}>
                <AdminUsers />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;

