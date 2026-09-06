import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading, initialized } = useSelector(
    (state) => state.auth
  );

  if (!initialized && loading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
