import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
      fetchReviews(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-reviews">
      <h1 className="reviews-title">Manage Reviews</h1>

      <table className="reviews-table">
        <thead>
          <tr>
            <th>PG Name</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.pg?.name}</td>
              <td>{review.user?.name}</td>
              <td>
                <span className={`rating rating-${review.rating}`}>
                  {"⭐".repeat(review.rating)}
                </span>
              </td>
              <td>{review.comment}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn-delete" onClick={() => handleDelete(review._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
