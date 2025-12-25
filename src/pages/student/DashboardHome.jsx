import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardHome.css";
import { fetchStudentDashboard, fetchBookings, fetchReviews } from "./utils/api";

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [recentReview, setRecentReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      // Fetch profile
      const userData = await fetchStudentDashboard();
      setProfile(userData.user || null);

      // Fetch bookings
      const bookings = await fetchBookings();
      if (bookings && bookings.length > 0) {
        // Find the next upcoming booking
        const upcoming = bookings
          .filter(b => new Date(b.startDate) >= new Date())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
        setUpcomingBooking(upcoming || null);
      }

      // Fetch reviews
      const reviews = await fetchReviews();
      if (reviews && reviews.length > 0) {
        // Most recent review
        const recent = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setRecentReview(recent);
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-home">
      <h2>Welcome back, {profile?.name || "Student"} 👋</h2>

      <div className="dashboard-grid">
        {/* Upcoming Booking */}
        <div className="card">
          <h3>Upcoming Booking</h3>
          {upcomingBooking ? (
            <>
              <p>PG Name: {upcomingBooking.pg?.name}</p>
              <p>Check-in: {new Date(upcomingBooking.startDate).toLocaleDateString()}</p>
              <p>Status: {upcomingBooking.status}</p>
            </>
          ) : (
            <p>No upcoming bookings</p>
          )}
        </div>

        {/* Recent Review */}
        <div className="card">
          <h3>Recent Review</h3>
          {recentReview ? (
            <>
              <p>"{recentReview.comment}"</p>
              <p>⭐ {recentReview.rating} / 5</p>
              <p>PG: {recentReview.pg?.name}</p>
            </>
          ) : (
            <p>No recent reviews</p>
          )}
        </div>

        {/* Profile Summary */}
        <div className="card">
          <h3>Profile Summary</h3>
          <p>Name: {profile?.name}</p>
          <p>Email: {profile?.email}</p>
          <button className="btn" onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
