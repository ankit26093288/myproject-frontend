import React, { useEffect, useState } from "react";
import "./Reports.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Reports = () => {
  const [bookingTrends, setBookingTrends] = useState([]);
  const [pgPerformance, setPgPerformance] = useState([]);
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    // 🔹 Dummy Data (replace later with API data)
    setBookingTrends([
      { month: "Jan", bookings: 40 },
      { month: "Feb", bookings: 55 },
      { month: "Mar", bookings: 60 },
      { month: "Apr", bookings: 45 },
      { month: "May", bookings: 70 },
    ]);

    setPgPerformance([
      { pg: "Sai Girls PG", bookings: 120 },
      { pg: "Shivam Boys Hostel", bookings: 95 },
      { pg: "Comfort Stay", bookings: 80 },
      { pg: "Green Nest PG", bookings: 50 },
    ]);

    setUserStats([
      { name: "Students", value: 300 },
      { name: "PG Owners", value: 40 },
    ]);
  }, []);

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  return (
    <div className="admin-reports">
      <h1 className="reports-title">Reports & Analytics</h1>

      {/* Booking Trends Line Chart */}
      <div className="chart-container">
        <h2>Monthly Booking Trends</h2>
        <LineChart width={600} height={300} data={bookingTrends}>
          <Line type="monotone" dataKey="bookings" stroke="#007bff" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>

      {/* PG Performance Bar Chart */}
      <div className="chart-container">
        <h2>PG Performance</h2>
        <BarChart width={600} height={300} data={pgPerformance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pg" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#28a745" />
        </BarChart>
      </div>

      {/* User Stats Pie Chart */}
      <div className="chart-container">
        <h2>User Distribution</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={userStats}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {userStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Reports;
