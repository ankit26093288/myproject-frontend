import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AddPG.module.css";

const EditPGMultiStep = () => {
  const { id } = useParams(); // PG ID
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "boys",
    sharingType: "single",
    rent: "",
    deposit: "",
    contact: "", 
    location: "",
    locality: "",
    address: "",
    landmark: "",
    amenities: "",
    utilitiesIncluded: "",
    availableRooms: "",
    rules: {
      smokingAllowed: false,
      petsAllowed: false,
      guestsAllowed: true,
      entryTime: "Anytime",
      exitTime: "Anytime",
    },
    imageUrls: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch PG data for editing
  useEffect(() => {
    const fetchPG = async () => {
      try {
        const res = await fetch(`https://myproject-backend-xj7r.onrender.com/api/pgs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Convert arrays to comma-separated strings for editing
          setFormData({
            ...data,
            contact: data.contact || "",
            amenities: data.amenities?.join(", ") || "",
            utilitiesIncluded: data.utilitiesIncluded?.join(", ") || "",
            imageUrls: data.imageUrls?.join(", ") || "",
            rules: {
              smokingAllowed: data.rules?.smokingAllowed || false,
              petsAllowed: data.rules?.petsAllowed || false,
              guestsAllowed: data.rules?.guestsAllowed ?? true,
              entryTime: data.rules?.entryTime || "Anytime",
              exitTime: data.rules?.exitTime || "Anytime",
            },
          });
        } else {
          alert(data.message || "Failed to fetch PG data");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch PG data");
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id, token]);

  if (loading) return <p>Loading PG data...</p>;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("rules.")) {
      const ruleName = name.split(".")[1];
      setFormData({
        ...formData,
        rules: { ...formData.rules, [ruleName]: type === "checkbox" ? checked : value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        amenities:
          typeof formData.amenities === "string"
            ? formData.amenities.split(",").map((a) => a.trim())
            : formData.amenities || [],
        utilitiesIncluded:
          typeof formData.utilitiesIncluded === "string"
            ? formData.utilitiesIncluded.split(",").map((u) => u.trim())
            : formData.utilitiesIncluded || [],
        imageUrls:
          typeof formData.imageUrls === "string"
            ? formData.imageUrls.split(",").map((url) => url.trim())
            : formData.imageUrls || [],
      };

      const res = await fetch(`https://myproject-backend-xj7r.onrender.com/api/pg-add-page/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("PG updated successfully");
        navigate("/owner/manage-listings");
      } else {
        alert(data.message || "Failed to update PG");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const progressPercentage = () => (step / 3) * 100;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>✏️ Edit PG</h1>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercentage()}%` }}></div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <label>PG Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>PG Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="co-living">Co-living</option>
              <option value="mixed">Mixed</option>
            </select>

            <label>Sharing Type:</label>
            <select name="sharingType" value={formData.sharingType} onChange={handleChange}>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>

            <label>Monthly Rent (₹):</label>
            <input type="number" name="rent" value={formData.rent} onChange={handleChange} required />

            <label>Deposit (₹):</label>
            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} />

            <label>Contact Number:</label>
<input
  type="tel"
  name="contact"
  value={formData.contact}
  maxLength="10"
  pattern="[0-9]{10}"
  placeholder="Enter 10-digit phone number"
  onChange={handleChange}
  required
/>


            <div className={styles.buttons}>
              <button type="button" onClick={nextStep} className={styles.nextBtn}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <label>City / Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />

            <label>Locality / Area:</label>
            <input type="text" name="locality" value={formData.locality} onChange={handleChange} />

            <label>Full Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>

            <label>Landmark:</label>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />

            <label>Amenities (comma separated):</label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} />

            <label>Utilities Included (comma separated):</label>
            <input type="text" name="utilitiesIncluded" value={formData.utilitiesIncluded} onChange={handleChange} />

            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className={styles.prevBtn}>
                ← Previous
              </button>
              <button type="button" onClick={nextStep} className={styles.nextBtn}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <label>Available Rooms:</label>
            <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} />

            <label>Smoking Allowed:</label>
            <input type="checkbox" name="rules.smokingAllowed" checked={formData.rules.smokingAllowed} onChange={handleChange} />

            <label>Pets Allowed:</label>
            <input type="checkbox" name="rules.petsAllowed" checked={formData.rules.petsAllowed} onChange={handleChange} />

            <label>Guests Allowed:</label>
            <input type="checkbox" name="rules.guestsAllowed" checked={formData.rules.guestsAllowed} onChange={handleChange} />

            <label>Entry Time:</label>
            <input type="text" name="rules.entryTime" value={formData.rules.entryTime} onChange={handleChange} />

            <label>Exit Time:</label>
            <input type="text" name="rules.exitTime" value={formData.rules.exitTime} onChange={handleChange} />

           {/* ✅ Uploaded Images Preview Section */}
<label>Uploaded Images:</label>
<div className={styles.imageGrid}>
  {formData.imageUrls && formData.imageUrls.length > 0 ? (
    // imageUrls might be a string like "url1, url2"
    (typeof formData.imageUrls === "string"
      ? formData.imageUrls.split(",")
      : formData.imageUrls
    ).map((url, index) => (
      <img
        key={index}
        src={url.trim()}
        alt={`pg-${index}`}
        width="100"
        style={{
          margin: "5px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
    ))
  ) : (
    <p>No images uploaded yet.</p>
  )}
</div>

{/* ✅ Button to open Upload Page */}
<button
  type="button"
  className={styles.uploadBtn}
  onClick={() => navigate(`/owner/delete-images/${id}`)}
>
  Manage / Upload Images
</button>


            <label>Video URL (optional):</label>
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />

            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className={styles.prevBtn}>
                ← Previous
              </button>
              <button type="submit" className={styles.submitBtn}>
                Update PG
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EditPGMultiStep;

