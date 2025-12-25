// src/components/admin/AdminProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 If no token or not admin → redirect to login
  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // ✅ Otherwise, show the admin dashboard routes
  return <Outlet />;
};

export default AdminProtectedRoute;
