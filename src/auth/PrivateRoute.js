// PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/auth"; // Adjust the import path if needed

const PrivateRoute = () => {
  const { isAuthorized } = useAuth();
  const location = useLocation();

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
