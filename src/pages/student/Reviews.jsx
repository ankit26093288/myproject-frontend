import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { fetchStudentBookings, fetchReviews, createReview } from "./utils/api";

export default function Reviews() {
  const [pgList, setPGList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ pgId: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch PGs from student's bookings
      const bookingsResponse = await fetchStudentBookings();
      // Ensure we always have an array
      const bookingsArray = Array.isArray(bookingsResponse)
        ? bookingsResponse
        : bookingsResponse?.bookings || [];

      const pgs = bookingsArray.map(b => ({
        id: b.pg._id,
        name: b.pg.name
      }));
      setPGList(pgs);

      if (pgs.length > 0) setForm(prev => ({ ...prev, pgId: pgs[0].id }));

      // Fetch student's reviews
      const revsResponse = await fetchReviews();
      const revsArray = Array.isArray(revsResponse) ? revsResponse : [];
      setReviews(revsArray);

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pgId || !form.comment) {
      alert("Please select PG and write a comment.");
      return;
    }

    setSubmitting(true);
    const newRev = await createReview(form.pgId, form.rating, form.comment);

    if (newRev && (newRev._id || newRev.id)) {
      setReviews([newRev, ...reviews]);
      setForm({ ...form, comment: "", rating: 5 });
      alert("Review submitted successfully!");
    } else {
      alert("Failed to submit review. Try again.");
    }
    setSubmitting(false);
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="reviews-page">
      <h2>My Reviews 📝</h2>

      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          PG:
          <select
            value={form.pgId}
            onChange={e => setForm({ ...form, pgId: e.target.value })}
          >
            {pgList.map(pg => (
              <option key={pg.id} value={pg.id}>{pg.name}</option>
            ))}
          </select>
        </label>

        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
          />
        </label>

        <label>
          Comment:
          <textarea
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            placeholder="Write your review..."
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="review-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div key={r._id || r.id} className="review-card">
              <p><b>{r.pg?.name || "PG"}</b> ⭐ {r.rating}</p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

