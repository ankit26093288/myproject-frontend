import React, { useEffect, useState } from "react";
import styles from "./BookingRequests.module.css";

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const ownerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/owner/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        // ✅ Fix: use data.bookings (not whole data)
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch (err) {
        console.error("Error fetching booking requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [ownerId, token]);

  // Handle booking action (confirm / cancel)
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: action } : b))
        );
        alert(data.message);
      } else {
        alert(data.message || "Failed to update booking");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) return <p>Loading booking requests...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📩 Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <div className={styles.list}>
          {bookings.map((b) => (
            <div key={b._id} className={styles.card}>
              <div className={styles.details}>
                <h3>{b.student?.name || "Unknown Student"}</h3>
                <p className={styles.pg}>🏠 {b.pg?.name}</p>
                <p>
                  📅 {new Date(b.startDate).toLocaleDateString()} →{" "}
                  {b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  Status:{" "}
                  <span className={`${styles.status} ${styles[b.status]}`}>
                    {b.status}
                  </span>
                </p>
              </div>
              <div className={styles.actions}>
                {b.status === "pending" && (
                  <>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => handleAction(b._id, "confirmed")}
                    >
                      ✅ Confirm
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleAction(b._id, "cancelled")}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
