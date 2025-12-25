import React, { useEffect, useState } from "react";
import styles from "./OwnerDashboard.module.css";

const OwnerDashboard = () => {
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const ownerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch PGs by owner
        const pgRes = await fetch(
          `https://myproject-backend-xj7r.onrender.com/api/pgs/owner/${ownerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const pgData = await pgRes.json();
        setPgs(Array.isArray(pgData) ? pgData : []);

        // Fetch bookings by owner
        const bookingRes = await fetch(
          `https://myproject-backend-xj7r.onrender.com/api/bookings/by-owner/${ownerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const bookingData = await bookingRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      } catch (err) {
        setError("Failed to load dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [ownerId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>📊 Owner Dashboard</h1>
      </div>

      {/* ✅ Stats Section */}
      <section className={styles.cardsSection}>
        <div className={styles.card}>
          <h3>Total PGs</h3>
          <p>{pgs.length}</p>
        </div>
        <div className={styles.card}>
          <h3>Pending Bookings</h3>
          <p>{bookings.filter((b) => b.status === "pending").length}</p>
        </div>
        <div className={styles.card}>
          <h3>Confirmed Bookings</h3>
          <p>{bookings.filter((b) => b.status === "confirmed").length}</p>
        </div>
      </section>

      {/* ✅ Recent Bookings Table */}
      <section className={styles.tableSection}>
        <h2>Recent Bookings</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>PG Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 5).map((b) => (
              <tr key={b._id}>
                <td>{b.student?.name}</td>
                <td>{b.pg?.name}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OwnerDashboard;

