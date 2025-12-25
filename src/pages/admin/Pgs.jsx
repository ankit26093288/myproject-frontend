import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminpgs.css";

const Pgs = () => {
  const [pgs, setPgs] = useState([]);

  const fetchPgs = async () => {
    try {
      const res = await axios.get("https://myproject-backend-xj7r.onrender.com/api/admin/pgs");
      setPgs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPgs();
  }, []);

  // Update PG status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://myproject-backend-xj7r.onrender.com/api/admin/pgs/${id}/status`, { status });
      fetchPgs(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Delete PG
  const deletePg = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;
    try {
      await axios.delete(`https://myproject-backend-xj7r.onrender.com/api/admin/pgs/${id}`);
      fetchPgs(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-pgs">
      <h1 className="pgs-title">Manage PG Listings</h1>

      <table className="pgs-table">
        <thead>
          <tr>
            <th>PG Name</th>
            <th>Location</th>
            <th>Rent (₹)</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pgs.map((pg) => (
            <tr key={pg._id}>
              <td>{pg.name}</td>
              <td>{pg.location}</td>
              <td>{pg.rent}</td>
              <td>{pg.owner?.name}</td>
              <td className={`status ${pg.status}`}>{pg.status}</td>
              <td>
                <button className="btn-approve" onClick={() => updateStatus(pg._id, "approved")}>Approve</button>
                <button className="btn-reject" onClick={() => updateStatus(pg._id, "rejected")}>Reject</button>
                <button className="btn-delete" onClick={() => deletePg(pg._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pgs;

