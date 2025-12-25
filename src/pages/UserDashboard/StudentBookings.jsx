import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentBookings({ studentId }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`/api/bookings/student/${studentId}`).then(res => {
      setBookings(res.data);
    });
  }, [studentId]);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map(b => (
        <div key={b._id}>
          <h3>{b.pg.name}</h3>
          <p>{b.pg.location}</p>
          <p>From: {new Date(b.startDate).toDateString()}</p>
          <p>To: {new Date(b.endDate).toDateString()}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

