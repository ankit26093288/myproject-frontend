import React from "react";
import { Navigate } from "react-router-dom";

// This will wrap student dashboard pages
export default function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    // If not logged in or not a student, redirect to login
    return <Navigate to="/login" />;
  }

  // If logged in as student, render the children
  return children;
}
