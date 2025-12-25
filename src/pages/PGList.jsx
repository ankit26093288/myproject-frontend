import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/PGList.module.css";

const PGList = ({ city, budget }) => { // ✅ receive props
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/pgs");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch PGs");
        } else {
          // ✅ Only approved PGs
          const approvedPGs = data.filter((pg) => pg.status === "approved");

          // ✅ Filter PGs by city and budget
          const filteredPGs = approvedPGs.filter((pg) => {
            const matchCity = city
              ? pg.location.toLowerCase().includes(city.toLowerCase())
              : true;
            const matchBudget = budget
              ? pg.rent <= parseInt(budget)
              : true;
            return matchCity && matchBudget;
          });

          setPgs(filteredPGs);
        }
      } catch (err) {
        console.error("Fetch PGs error:", err);
        setError("Something went wrong while fetching PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, [city, budget]); // 🔁 Refetch when search changes

  if (loading) return <p className={styles.loading}>Loading PGs...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div id="pg-list" className={styles.container}>
      <h2 className={styles.title}>🏠 Available PGs</h2>
      <div className={styles.pgGrid}>
        {pgs.length === 0 && <p>No PGs found matching your search.</p>}
        {pgs.map((pg) => (
          <div key={pg._id} className={styles.pgCard}>
            <img
              src={pg.imageUrls[0] || "https://via.placeholder.com/300"}
              alt={pg.name}
              className={styles.pgImage}
            />
            <h3 className={styles.pgName}>{pg.name}</h3>
            <p className={styles.pgLocation}>📍 {pg.location}</p>
            <p className={styles.pgRent}>💰 ₹{pg.rent} / month</p>
            <p className={styles.pgRooms}>
              🛏️ Available Rooms: {pg.availableRooms}
            </p>

            <div className={styles.amenitiesContainer}>
              {pg.amenities?.length > 0 ? (
                pg.amenities.slice(0, 4).map((amenity, i) => (
                  <span key={i} className={styles.amenityTag}>
                    {amenity}
                  </span>
                ))
              ) : (
                <span className={styles.noAmenities}>No amenities listed</span>
              )}
            </div>

            <button
              className={`${styles.detailsBtn} ${!token ? styles.disabledBtn : ""}`}
              disabled={!token}
              onClick={() => token && navigate(`/pg/${pg._id}`)}
              title={!token ? "Login required" : "View details"}
            >
              {token ? "View Details" : "Login to View"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PGList;

