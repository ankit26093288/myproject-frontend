import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/PGDetails.module.css";

const PGDetails1 = () => {
  const { id } = useParams(); // 👈 PG id from URL
  const [pg, setPg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Booking form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const studentId = localStorage.getItem("userId"); // 👈 later connect with auth

  // ✅ Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch PG details
        const resPG = await fetch(`http://localhost:5000/api/pgs/${id}`);
        const pgData = await resPG.json();
        if (!resPG.ok) throw new Error(pgData.message || "Failed to fetch PG");
        setPg(pgData);

        // ✅ Fetch PG reviews
        const resReviews = await fetch(`http://localhost:5000/api/reviews/${id}`);
        const reviewsData = await resReviews.json();
        if (resReviews.ok) {
          setReviews(reviewsData);
        }
      } catch (err) {
        console.error("Error fetching PG details or reviews:", err);
        alert("Error loading PG details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle Booking
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgId: id,
          studentId, // will come from logged-in user later
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      alert("✅ Booking successful! Status: " + data.status);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.message);
    }
  };

  // ✅ Handle Review Submit
  const handleAddReview = async () => {
  if (!rating || rating < 1 || rating > 5 || !comment.trim()) {
    alert("All fields are required and rating must be 1–5");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pg: id,       // match backend model
        user: studentId,
        rating,
        comment: comment.trim(),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add review");

    alert("✅ Review added!");
    setRating(0);
    setComment("");
    setReviews([data, ...reviews]); // latest review first
  } catch (err) {
    console.error("Review error:", err);
    alert(err.message);
  }
};


  if (loading) return <p>Loading...</p>;
  if (!pg) return <p>PG not found.</p>;

  return (
    <div className={styles.container}>
      {/* 🔹 PG Details */}
      <h2 className={styles.title}>{pg.name}</h2>
      <p className={styles.location}>📍 {pg.location}</p>
      <p className={styles.address}>{pg.address}</p>
      <p className={styles.rent}>💰 Rent: ₹{pg.rent}</p>
      <p className={styles.contact}>📞 Contact: {pg.contact}</p>

      {/* 🔹 Images */}
      <h3>Images</h3>
      <div className={styles.images}>
        {pg.imageUrls && pg.imageUrls.length > 0 ? (
          pg.imageUrls.map((url, idx) => (
            <img key={idx} src={url} alt={`PG-${idx}`} className={styles.pgImage} />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>

      {/* 🔹 Amenities */}
      <div className={styles.pgAmenities}>
  <h3>Amenities:</h3>
  {pg.amenities?.length > 0 ? (
    <ul className={styles.amenitiesList}>
      {pg.amenities.map((amenity, idx) => (
        <li key={idx}>{amenity}</li>
      ))}
    </ul>
  ) : (
    <p className={styles.noAmenities}>No amenities listed.</p>
  )}
</div>


      {/* 🔹 Booking Form */}
      <h3>Book this PG</h3>
      <div className={styles.bookingForm}>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={handleBooking} className={styles.bookBtn}>
          Book Now
        </button>
      </div>

      {/* 🔹 Add Review Form */}
      <h3>Add Your Review</h3>
      <div className={styles.reviewForm}>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value="0">Select</option>
          <option value="1">⭐ 1</option>
          <option value="2">⭐ 2</option>
          <option value="3">⭐ 3</option>
          <option value="4">⭐ 4</option>
          <option value="5">⭐ 5</option>
        </select>

        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your experience..."
        />

        <button onClick={handleAddReview} className={styles.submitReviewBtn}>
          Submit Review
        </button>
      </div>

      {/* 🔹 Reviews List */}
      <h3>Reviews</h3>
      <div className={styles.reviews}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className={styles.reviewCard}>
              <strong>{review.user?.name || "Anonymous"}</strong> ⭐ {review.rating}
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default PGDetails1;
