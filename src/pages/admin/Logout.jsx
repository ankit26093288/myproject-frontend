// src/components/admin/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css"; 

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage (just in case)
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Delay redirect for better UX
    const timer = setTimeout(() => {
      navigate("/login"); // redirect to your admin login route
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging out...</h2>
      <p>You will be redirected shortly.</p>
    </div>
  );
};

export default Logout;
