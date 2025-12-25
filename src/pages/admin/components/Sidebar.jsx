// src/components/admin/Sidebar.jsx
import React from "react";
import { NavLink , useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear any stored login info
    localStorage.removeItem("adminToken"); 
    localStorage.removeItem("adminData");
    // Redirect to login
    navigate("/admin/logout");
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/admin/users" className={({isActive}) => isActive ? "active" : ""}>Users</NavLink>
        <NavLink to="/admin/pgs" className={({isActive}) => isActive ? "active" : ""}>PGs</NavLink>
        <NavLink to="/admin/bookings" className={({isActive}) => isActive ? "active" : ""}>Bookings</NavLink>
        <NavLink to="/admin/reviews" className={({isActive}) => isActive ? "active" : ""}>Reviews</NavLink>
        <NavLink to="/admin/payment" className={({isActive}) => isActive ? "active" : ""}>Payments</NavLink>
        <NavLink to="/admin/reports" className={({isActive}) => isActive ? "active" : ""}>Reports</NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => isActive ? "active" : ""}>Settings</NavLink>
        {/* ✅ Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;

