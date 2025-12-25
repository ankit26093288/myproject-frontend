import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalStudents: 0,
    totalPgs: 0,
    totalBookings: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://myproject-backend-xj7r.onrender.com/api/admin/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div className="card">
          <h2>{stats.totalOwners}</h2>
          <p>Total Owners</p>
        </div>
        <div className="card">
          <h2>{stats.totalStudents}</h2>
          <p>Total Students</p>
        </div>
        <div className="card">
          <h2>{stats.totalPgs}</h2>
          <p>Total PGs</p>
        </div>
        <div className="card">
          <h2>{stats.totalBookings}</h2>
          <p>Total Bookings</p>
        </div>
        <div className="card">
          <h2>{stats.totalReviews}</h2>
          <p>Total Reviews</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

