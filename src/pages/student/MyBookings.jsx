import React, { useEffect, useState } from "react";
import "./MyBookings.css";
import { fetchBookings } from "./utils/api"; // Import API function

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      const data = await fetchBookings();

      // Normalize to always be an array
      const bookingsArray = Array.isArray(data) ? data : data?.bookings || [];
      setBookings(bookingsArray);

      setLoading(false);

      
    };
    
    loadBookings();
  }, []);

const handlePay = async (booking) => {
  const { key } = await fetch("https://myproject-backend-xj7r.onrender.com/get-razorpay-key")
    .then((res) => res.json());

  try {
    const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: booking.pg.rent,
        pgId: booking.pg._id,
        studentId: booking.student._id || booking.student || null,
        bookingId: booking._id   // <--- add this
      }),
    });

    const data = await res.json();
    if (!data.success) return alert("Order creation failed!");

    const options = {
      key,
      amount: data.order.amount,
      currency: "INR",
      name: "PG Finder",
      description: `Payment for ${booking.pg.name}`,
      order_id: data.order.id,

      handler: async function (response) {
        const verify = await fetch("https://myproject-backend-xj7r.onrender.com/api/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: data.order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,

            pgId: booking.pg._id,
            studentId: booking.student._id || booking.student,
            startDate: booking.startDate,
            endDate: booking.endDate,
            bookingId: booking._id   // <--- add this
          }),
        });

        const v = await verify.json();
        if (v.success) {
          alert("Payment Successful!");
          window.location.reload();
        } else {
          alert("Payment verification failed");
        }
      },

      theme: { color: "#4CAF50" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error(err);
    alert("Payment failed!");
  }
};



  return (
    <div className="my-bookings">
      <h2>My Bookings 📅</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>PG Name</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id || b.id}>
                <td>{b.pg?.name || "N/A"}</td>
                <td>{b.pg?.location || "N/A"}</td>
                <td>{b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"}</td>
                <td>{b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}</td>
                <td>
  <span className={`status ${b.status?.toLowerCase() || ""}`}>
    {b.status === "pending" && "Pending"}
    {b.status === "confirmed" && "Confirmed"}
    {b.status === "cancelled" && "Cancelled"}
  </span>
</td>

<td>
  {b.status === "confirmed" ? (
    b.paymentStatus === "paid" ? (
      <span className="paid-label">Paid</span>
    ) : (
      <button className="pay-btn" onClick={() => handlePay(b)}>
        Pay Now
      </button>
    )
  ) : (
    <span className="pending-payment">Waiting Confirmation</span>
  )}
</td>


                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

