import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Settings.css";

const Settings = () => {

   const navigate = useNavigate();
  const adminId = localStorage.getItem("userId"); // replace with actual admin _id
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });



  // Redirect if not admin
 /* useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied");
      navigate("/"); // redirect if not admin
    }
  }, [navigate]);  */


  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`https://myproject-backend-xj7r.onrender.com/api/admin/profile/${adminId}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://myproject-backend-xj7r.onrender.com/api/admin/profile/${adminId}`, profile);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    try {
      const res = await axios.put(`https://myproject-backend-xj7r.onrender.com/api/admin/profile/${adminId}/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert(res.data.message);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response.data.message || "Failed to update password");
    }
  };

  return (
    <div className="admin-settings">
      <h1 className="settings-title">Admin Settings</h1>

      <div className="settings-section">
        <h2>Update Profile</h2>
        <form onSubmit={handleProfileSubmit} className="form">
          <label>Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleProfileChange} required />
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} required />
          <label>Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} />
          <button type="submit" className="btn-save">Save Profile</button>
        </form>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="form">
          <label>Current Password</label>
          <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required />
          <label>New Password</label>
          <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
          <label>Confirm New Password</label>
          <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
          <button type="submit" className="btn-save">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;

