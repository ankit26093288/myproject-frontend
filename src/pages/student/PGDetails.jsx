import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PGDetails.css";
import { fetchPGDetails, createBooking, fetchReviews, createReview } from "./utils/api";

export default function PGDetails() {
  const { id } = useParams(); // PG ID from URL
  const [pg, setPG] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPG = async () => {
      setLoading(true);
      const pgData = await fetchPGDetails(id);
      setPG(pgData);
      // Set reviews separately if API returns separately
      if (pgData.reviews) setReviews(pgData.reviews);
      setLoading(false);
    };
    loadPG();
  }, [id]);

  if (loading) return <p>Loading PG details...</p>;
  if (!pg) return <p>PG not found.</p>;

  return (
    <div className="pg-details">
      <h2>{pg.name}</h2>
      <p className="location">{pg.location} • {pg.address}</p>

      {/* Images */}
      <div className="images">
        {pg.imageUrls?.map((img, i) => (
          <img key={i} src={img} alt={`PG ${i}`} />
        )) || <p>No images available</p>}
      </div>

      {/* Info Section */}
      <div className="info">
        <p><b>Rent:</b> ₹{pg.rent}</p>
        <p><b>Contact:</b> {pg.contact}</p>
        <p><b>Amenities:</b> {pg.amenities?.join(", ") || "N/A"}</p>
      </div>

      <button className="btn" onClick={() => alert("Booking functionality coming soon!")}>
        Book Now
      </button>

      {/* Reviews */}
      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map(r => (
            <div key={r._id} className="review">
              <p><b>{r.user?.name || "Anonymous"}</b> ⭐ {r.rating}</p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

