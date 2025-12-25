import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowsePGs.css";
import { fetchBrowsePGs } from "./utils/api";

export default function BrowsePGs() {
  const [pgs, setPGs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch PGs from backend
  useEffect(() => {
    const loadPGs = async () => {
      setLoading(true);
      const data = await fetchBrowsePGs();

      // Ensure we always have an array
      const pgArray = Array.isArray(data) ? data : data?.pgs || [];
      setPGs(pgArray);

      setLoading(false);
    };
    loadPGs();
  }, []);

  // Filter PGs based on search input
  const filteredPGs = Array.isArray(pgs) ? pgs.filter(pg =>
    pg.name?.toLowerCase().includes(search.toLowerCase()) ||
    pg.location?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="browse-pg">
      <h2>Browse PGs 🏠</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {loading ? (
        <p>Loading PGs...</p>
      ) : filteredPGs.length === 0 ? (
        <p>No PGs found.</p>
      ) : (
        <div className="pg-grid">
          {filteredPGs.map(pg => (
            <div key={pg._id || pg.id} className="pg-card">
              <img src={pg.imageUrls?.[0] || "https://via.placeholder.com/250x150"} alt={pg.name} />
              <h3>{pg.name}</h3>
              <p><b>Location:</b> {pg.location}</p>
              <p><b>Rent:</b> ₹{pg.rent}</p>
              <p><b>Amenities:</b> {pg.amenities?.join(", ") || "N/A"}</p>
              <button className="btn" onClick={() => navigate(`/pg/${pg._id}`)}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

