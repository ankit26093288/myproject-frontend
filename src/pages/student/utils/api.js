// utils/api.js

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Fetch student dashboard info
export const fetchStudentDashboard = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/student/dashboard", {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return null;
  }
};

// Fetch PGs for browse page
export const fetchBrowsePGs = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/student/browse", {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("Browse PGs error:", err);
    return [];
  }
};

// Fetch details of a single PG by ID
export const fetchPGDetails = async (pgId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/student/pg/${pgId}`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("PG Details error:", err);
    return null;
  }
};

// Bookings APIs
export const fetchBookings = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/student/bookings", {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return [];
  }
};

export const createBooking = async (pgId, startDate, endDate) => {
  try {
    const res = await fetch("http://localhost:5000/api/student/bookings", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ pgId, startDate, endDate }),
    });
    return await res.json();
  } catch (err) {
    console.error("Create booking error:", err);
    return null;
  }
};

// Reviews APIs
export const fetchReviews = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/student/reviews", {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("Fetch reviews error:", err);
    return [];
  }
};

export const createReview = async (pgId, rating, comment) => {
  try {
    const res = await fetch("http://localhost:5000/api/student/reviews", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ pgId, rating, comment }),
    });
    return await res.json();
  } catch (err) {
    console.error("Create review error:", err);
    return null;
  }
};

// Fetch student bookings for dropdown in reviews
export const fetchStudentBookings = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/student/bookings", {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("Fetch student bookings error:", err);
    return [];
  }
};

// Profile APIs
export const updateProfile = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/api/student/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Update profile error:", err);
    return null;
  }
};
