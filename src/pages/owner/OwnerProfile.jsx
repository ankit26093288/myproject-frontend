import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", textAlign: "center" }}>
      <img
        src={user.profileImage || "https://via.placeholder.com/120"}
        alt="Profile"
        style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
      />

      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "tomato",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default OwnerProfile;
