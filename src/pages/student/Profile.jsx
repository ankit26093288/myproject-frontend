import React, { useState, useEffect } from "react";
import "./Profile.css";
import { fetchStudentDashboard, updateProfile } from "./utils/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "https://via.placeholder.com/100"
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const data = await fetchStudentDashboard();
      if (data && data.user) {
        setProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          profileImage: data.user.profileImage || "https://via.placeholder.com/100"
        });
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = await updateProfile(profile);
    if (updated && updated.success) {
      alert("Profile updated successfully!");
      setEditing(false);
    } else {
      alert("Failed to update profile. Please try again.");
    }
    setSaving(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>My Profile 👤</h2>

      <div className="profile-card">
        <img src={profile.profileImage} alt="Profile" className="profile-img" />

        {editing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </label>
            <label>
              Phone:
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </form>
        ) : (
          <div className="profile-info">
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
            <button className="btn" onClick={() => setEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}
