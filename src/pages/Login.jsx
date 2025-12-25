import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Login successful
      console.log("Login success:", data);

      // Save token + role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user.id); // ✅ store user ID
      console.log("Role:", data.user.role);
      console.log("Token:", data);

      alert("Login successful!");

      setTimeout(() => {

        navigate("/");
        
      }, 1500);
        
      // ✅ Redirect based on role
      /*setTimeout(() => {
        if (data.user.role === "student") {
          navigate("/student-dashboard");
        } else if (data.user.role === "owner") {
          navigate("/owner-dashboard");
        } else if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/"); // fallback
        }
      }, 1500);  */
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="navbarlg">
        <div className="logolg">PG Finder</div>
        {/* <button className="signup-btnlg">Sign Up</button> */}
      </nav>

      <div className="login-container">
        <h2>Login to Your Account</h2>
        <p className="welcome-text">Welcome back! Please login to your account.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot">
            <a href="/forgot-password">Forgot password?</a>.
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
