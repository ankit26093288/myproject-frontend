import React, { useState } from "react";
import styles from "../css/RegistrationPage.module.css";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP sent to your email. Please verify.");
        setOtpStage(true);
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(`❌ ${data.message || "Invalid OTP"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Could not verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/users/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ New OTP sent to your email.");
      } else {
        setMessage(`❌ ${data.message || "Failed to resend OTP"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {otpStage ? "Verify Your Email" : "Create Your Account"}
        </h2>
        <p className={styles.subtitle}>
          {otpStage
            ? "Enter the OTP sent to your email"
            : "Join us and start finding your perfect PG today."}
        </p>

        {message && <p className={styles.message}>{message}</p>}

        {!otpStage ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="student">Student</option>
              <option value="owner">PG Owner</option>
            </select>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className={styles.button}
              disabled={loading}
              style={{ marginTop: "10px", backgroundColor: "#888" }}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        )}

        {!otpStage && (
          <p className={styles.loginText}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

