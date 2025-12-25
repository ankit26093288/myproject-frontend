import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./StudentNavbar.css";

export default function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="student-navbar">
      <div className="logo" onClick={() => navigate("/student-dashboard/home")}>
        PG Finder
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/student-dashboard/home" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/student-dashboard/browse" className={({isActive}) => isActive ? "active" : ""}>Browse PGs</NavLink>
        </li>
        <li>
          <NavLink to="/student-dashboard/bookings" className={({isActive}) => isActive ? "active" : ""}>My Bookings</NavLink>
        </li>
        <li><NavLink to="/student-dashboard/payments" className={({isActive}) => isActive ? "active" : ""}>My Payments</NavLink>
        </li> {/* NEW */}
        <li>
          <NavLink to="/student-dashboard/reviews" className={({isActive}) => isActive ? "active" : ""}>Reviews</NavLink>
        </li>
        <li>
          <NavLink to="/student-dashboard/profile" className={({isActive}) => isActive ? "active" : ""}>Profile</NavLink>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

