import React, { useState } from "react";
import styles from "./AddPG.module.css";
import { useNavigate } from "react-router-dom";

const AddPGMultiStep = () => {
  const [step, setStep] = useState(1);
  const ownerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

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
  });

  const [suggestions, setSuggestions] = useState([]);

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

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

  // ⭐⭐⭐ VALIDATION FUNCTION FOR ALL STEPS ⭐⭐⭐

  const validateStep1 = () => {
    let newErrors = {};

    // PG Name
    if (!formData.name.trim()) {
      newErrors.name = "PG name is required";
    } else if (!/^[A-Za-z0-9\s]{3,40}$/.test(formData.name)) {
      newErrors.name = "Name must be 3–40 characters, letters & numbers only";
    }

    // Rent
    if (!formData.rent) {
      newErrors.rent = "Rent is required";
    } else if (formData.rent < 1000) {
      newErrors.rent = "Rent must be at least ₹1000";
    }

    // Deposit
    if (formData.deposit && formData.deposit < 500) {
      newErrors.deposit = "Deposit must be at least ₹500";
    }

    // Contact
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Full address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    let newErrors = {};

    if (formData.availableRooms && formData.availableRooms < 0) {
      newErrors.availableRooms = "Available rooms cannot be negative";
    }

    if (!formData.rules.entryTime.trim()) {
      newErrors.entryTime = "Entry time is required";
    }

    if (!formData.rules.exitTime.trim()) {
      newErrors.exitTime = "Exit time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ⭐⭐⭐ FINAL SUBMIT ⭐⭐⭐
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    const formattedData = {
      ...formData,
      amenities: formData.amenities
        ? formData.amenities.split(",").map((a) => a.trim())
        : [],
      utilitiesIncluded: formData.utilitiesIncluded
        ? formData.utilitiesIncluded.split(",").map((u) => u.trim())
        : [],
      owner: ownerId,
    };

    try {
      const res = await fetch("http://localhost:5000/api/pg-add-page/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();
      alert(data.message);
      navigate(`/upload-images/${data.pgId}`);
    } catch (err) {
      console.error("Error submitting PG:", err);
      alert("Failed to add PG.");
    }
  };

  const progressPercentage = () => (step / 3) * 100;

  // Auto-suggest API
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (!value) return setSuggestions([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error:", err);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (s) => {
    setFormData({
      ...formData,
      location: s.address.city || s.display_name,
      locality: s.address.suburb || "",
      address: s.display_name,
    });
    setSuggestions([]);
  };

  // ⭐⭐⭐ UI RETURN ⭐⭐⭐
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>➕ Add New PG</h1>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercentage()}%` }}></div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <label>PG Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}

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
            <input type="number" name="rent" value={formData.rent} onChange={handleChange} />
            {errors.rent && <p className="error">{errors.rent}</p>}

            <label>Deposit (₹):</label>
            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} />
            {errors.deposit && <p className="error">{errors.deposit}</p>}

            <label>Contact Number:</label>
            <input
              type="tel"
              name="contact"
              maxLength="10"
              placeholder="10-digit number"
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}

            <div className={styles.buttons}>
              <button type="button" onClick={nextStep} className={styles.nextBtn}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <label>City / Location:</label>
            <input type="text" value={formData.location} onChange={handleLocationChange} />
            {errors.location && <p className="error">{errors.location}</p>}

            {suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((s) => (
                  <li key={s.place_id} onClick={() => selectSuggestion(s)}>
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}

            <label>Locality:</label>
            <input type="text" name="locality" value={formData.locality} onChange={handleChange} />

            <label>Full Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
            {errors.address && <p className="error">{errors.address}</p>}

            <label>Landmark:</label>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />

            <label>Amenities (comma separated):</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
            />

            <label>Utilities Included (comma separated):</label>
            <input
              type="text"
              name="utilitiesIncluded"
              value={formData.utilitiesIncluded}
              onChange={handleChange}
            />

            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className={styles.prevBtn}>← Previous</button>
              <button type="button" onClick={nextStep} className={styles.nextBtn}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <label>Available Rooms:</label>
            <input
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
            />
            {errors.availableRooms && <p className="error">{errors.availableRooms}</p>}

            <label>Smoking Allowed:</label>
            <input
              type="checkbox"
              name="rules.smokingAllowed"
              checked={formData.rules.smokingAllowed}
              onChange={handleChange}
            />

            <label>Pets Allowed:</label>
            <input
              type="checkbox"
              name="rules.petsAllowed"
              checked={formData.rules.petsAllowed}
              onChange={handleChange}
            />

            <label>Guests Allowed:</label>
            <input
              type="checkbox"
              name="rules.guestsAllowed"
              checked={formData.rules.guestsAllowed}
              onChange={handleChange}
            />

            <label>Entry Time:</label>
            <input
              type="text"
              name="rules.entryTime"
              value={formData.rules.entryTime}
              onChange={handleChange}
            />
            {errors.entryTime && <p className="error">{errors.entryTime}</p>}

            <label>Exit Time:</label>
            <input
              type="text"
              name="rules.exitTime"
              value={formData.rules.exitTime}
              onChange={handleChange}
            />
            {errors.exitTime && <p className="error">{errors.exitTime}</p>}

            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className={styles.prevBtn}>
                ← Previous
              </button>
              <button type="submit" className={styles.submitBtn}>
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddPGMultiStep;
