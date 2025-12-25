// src/components/admin/AdminPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPayments.css"; // External CSS

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("https://myproject-backend-xj7r.onrender.com/api/admin/payments"); // Backend route
        if (res.data.success) setPayments(res.data.payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p className="loading">Loading payments...</p>;

  return (
    <div className="payments-container">
      <h2 className="payments-title">All Payments</h2>
      <table className="payments-table">
        <thead>
          <tr>
            <th>PG Name</th>
            <th>Student Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created At</th>
             <th>Invoice</th> {/* NEW */}
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.pg?.name || "N/A"}</td>
                <td>{payment.student?.name || "N/A"}</td>
                <td>₹{payment.amount}</td>
                <td className={`status ${payment.status}`}>{payment.status}</td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td>
  <a 
    href={`https://myproject-backend-xj7r.onrender.com/api/admin/invoice/${payment._id}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="invoice-btn"
  >
    View Invoice
  </a>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-payments">No payments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayments;

