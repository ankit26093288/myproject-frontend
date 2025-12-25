import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://myproject-backend-xj7r.onrender.com/api/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://myproject-backend-xj7r.onrender.com/api/admin/bookings/${id}/status`, { status });
      fetchBookings(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-bookings">
      <h1>Manage Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>PG</th>
            <th>Location</th>
            <th>Rent (₹)</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.student?.name}</td>
              <td>{b.pg?.name}</td>
              <td>{b.pg?.location}</td>
              <td>{b.pg?.rent}</td>
              <td>{new Date(b.startDate).toLocaleDateString()}</td>
              <td>{b.endDate ? new Date(b.endDate).toLocaleDateString() : "-"}</td>
              <td className={`status ${b.status}`}>{b.status}</td>
              <td>
                {b.status === "pending" && (
                  <>
                    <button className="btn-confirm" onClick={() => updateStatus(b._id, "confirmed")}>Confirm</button>
                    <button className="btn-cancel" onClick={() => updateStatus(b._id, "cancelled")}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;

