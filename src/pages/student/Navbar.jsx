import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css"; // external CSS file

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">PG Finder</div>
        <nav className="nav-links">
          <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
          <NavLink to="/browse" activeclassname="active">Browse</NavLink>
          <NavLink to="/bookings" activeclassname="active">Bookings</NavLink>
          <NavLink to="/wishlist" activeclassname="active">Wishlist</NavLink>
          <NavLink to="/profile" activeclassname="active">Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}

