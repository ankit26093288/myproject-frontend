import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/ReviewSubmitPG.css';

const ReviewSubmitPG = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pgDetails } = location.state || {}; // Get the PG details passed from the previous page

  const handleSubmit = () => {
    // Add the logic to submit the data to your backend here
    alert('PG listing submitted successfully!');
    navigate('/'); // Redirect to the home page or the desired route after submission
  };

  const handleGoBack = () => {
    navigate('/add-pg'); // Go back to the AddPG form to edit
  };

  if (!pgDetails) {
    return <div>No data available.</div>; // In case the state is empty
  }

  return (
    <div className="review-submit-container">
      <h2>Review Your PG Details</h2>
      <div className="pg-details">
        <p><strong>PG Name:</strong> {pgDetails.name}</p>
        <p><strong>Location:</strong> {pgDetails.location}</p>
        <p><strong>Price:</strong> ₹{pgDetails.price}</p>
        <p><strong>Available Rooms:</strong> {pgDetails.availableRooms}</p>
        <p><strong>Description:</strong> {pgDetails.description}</p>
        <p><strong>Contact Number:</strong> {pgDetails.contact}</p>
      </div>

      <div className="buttons">
        <button onClick={handleGoBack} className="edit-btn">Go Back and Edit</button>
        <button onClick={handleSubmit} className="submit-btn">Submit Listing</button>
      </div>
    </div>
  );
};

export default ReviewSubmitPG;

