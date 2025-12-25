import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const OwnerProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Protect owner routes
  if (!token || role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access if logged in as owner
  return <Outlet />;
};

export default OwnerProtectedRoute;

