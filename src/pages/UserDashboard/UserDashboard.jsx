import React, { useEffect, useState } from "react";
import "./UserDashboard.css"; // scoped CSS

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bookings, setBookings] = useState([]); // ✅ store bookings

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // ✅ Fetch user profile
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");
        setUser(data.user);

        // ✅ Fetch user bookings
        const resBookings = await fetch("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingsData = await resBookings.json();
        if (resBookings.ok) {
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error(error);
       // localStorage.removeItem("token");
       // window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBookings();
  }, []);

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload/profile-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUser(data.user); // ✅ update user state
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="ud-loading">Loading profile...</div>;
  if (!user) return <div className="ud-loading">No user data available</div>;

  return (
    <div className="ud-dashboard">
      {/* Sidebar */}
      <aside className="ud-sidebar">
        <div className="ud-profile">
          <img
            src={user.profileImage || "https://randomuser.me/api/portraits/men/45.jpg"}
            alt="Profile"
          />
          <h3>{user.name}</h3>
          <label className="ud-upload-btn">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Profile</li>
            <li>My Bookings</li>
            <li>Saved PGs</li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ud-main">
        <h2>Welcome, {user.name} 🎉</h2>

        <div className="ud-cards">
          <div className="ud-card">
            <h4>My Bookings</h4>
            <p>{bookings.length} Active Bookings</p>
          </div>
          <div className="ud-card">
            <h4>Saved PGs</h4>
            <p>0 Saved (coming soon)</p>
          </div>
          <div className="ud-card">
            <h4>Messages</h4>
            <p>0 New</p>
          </div>
        </div>

        {/* ✅ Show Booking List */}
        <section className="ud-bookings">
          <h3>My Bookings</h3>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking._id} className="ud-booking-card">
                  <h4>{booking.pg?.name || "PG Deleted"}</h4>
                  <p>📍 {booking.pg?.location}</p>
                  <p>💰 Rent: ₹{booking.pg?.rent}</p>
                  <p>
                    📅 {new Date(booking.startDate).toLocaleDateString()} →{" "}
                    {booking.endDate
                      ? new Date(booking.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </p>
                  <p>Status: <strong>{booking.status}</strong></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet. Start booking a PG!</p>
          )}
        </section>

        <section className="ud-profile-details">
          <h3>Profile Details</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p>
            <strong>Role:</strong>{" "}
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student"}
          </p>
        </section>
      </main>
    </div>
  );
}
