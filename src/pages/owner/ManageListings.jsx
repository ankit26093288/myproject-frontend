import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageListings.module.css";

const ManageListings = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const ownerId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pgs/owner/${ownerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPgs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching PGs:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ownerId, token]);

  const handleEdit = (id) => navigate(`/owner/edit-pg/${id}`);
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this PG?")) return;

  try {
    await fetch(`http://localhost:5000/api/pg-add-page/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPgs((prev) => prev.filter((p) => p._id !== id));
    alert("PG deleted successfully");
  } catch (err) {
    console.error("Error deleting PG:", err);
    alert("Error deleting PG");
  }
};



  if (loading) return <p>Loading listings...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Manage Listings</h2>
      {pgs.length === 0 ? (
        <p>No PG listings found. Add one first.</p>
      ) : (
        <div className={styles.grid}>
          {pgs.map((pg) => (
            <div key={pg._id} className={styles.card}>
              <img
                src={pg.imageUrls?.[0] || "https://via.placeholder.com/300x200"}
                alt={pg.name}
                className={styles.pgImage}
              />
              <div className={styles.cardContent}>
                <h3>{pg.name}</h3>
                <p className={styles.location}>📍 {pg.location}</p>
                <p className={styles.rent}>💰 ₹{pg.rent}/month</p>
                <p className={styles.rooms}>🏠 Rooms: {pg.availableRooms}</p>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(pg._id)} className={styles.editBtn}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(pg._id)} className={styles.deleteBtn}>
                  🗑️ Delete
                </button>
                <button
                  onClick={() => navigate(`/upload-images/${pg._id}`)}
                  className={styles.imageBtn}
                >
                  🖼️ Images
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListings;
