import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentPayments.css";

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`https://myproject-backend-xj7r.onrender.com/api/student/payments/${studentId}`);
        if (res.data.success) setPayments(res.data.payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [studentId]);

  if (loading) return <p className="loading">Loading payments...</p>;

  return (
    <div className="student-payments-container">
      <h2>My Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="student-payments-table">
          <thead>
            <tr>
              <th>PG Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Invoice</th> {/* NEW */}
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.pg?.name}</td>
                <td>₹{payment.amount}</td>
                <td className={`status ${payment.status}`}>{payment.status}</td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td>
          <a 
            href={`https://myproject-backend-xj7r.onrender.com/api/student/invoice/${payment._id}?studentId=${studentId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="invoice-btn"
          >
            View Invoice
          </a>
        </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentPayments;

