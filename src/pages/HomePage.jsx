import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/HomePage.module.css";
import PGList from "./PGList"; // Existing PGList
import { Link } from "react-router-dom";


const HomePage = () => {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();
  const featuredRef = useRef(null);

 useEffect(() => {
  // ✅ Check login token and role when storage changes
  const checkToken = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setRole(localStorage.getItem("role") || "");
  };

  window.addEventListener("storage", checkToken);

  // ✅ Detect user's city using geolocation
  const fetchCityFromLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      if (data.city) {
        setCity(data.city);
      } else if (data.locality) {
        setCity(data.locality);
      }
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityFromLocation(latitude, longitude);
      },
      (error) => {
        console.error("Location permission denied or error:", error);
      }
    );
  } else {
    console.error("Geolocation not supported in this browser.");
  }

  return () => window.removeEventListener("storage", checkToken);
}, []);


  const handleUserIconClick = () => {
    if (role === "student") navigate("/student-dashboard/home");
    else if (role === "owner") navigate("/owner/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for PGs in ${city} with budget ${budget}`);
    // Later: Filter PGList based on city/budget
    if (featuredRef.current) {
    featuredRef.current.scrollIntoView({ behavior: "smooth" });
  }
  };

  return (
    <div className={styles.homePage}>
      {/* ===== HEADER ===== */}
      <header className={styles.header}>
        <h1>PG Finder</h1>
        <nav>
          <ul className={styles.navList}>
            <li><a href="#home">Home</a></li>
            <li><Link to="/about">About Us</Link>
</li>
            <li><Link to="/contact">Contact</Link></li>

            {!isLoggedIn ? (
              <li><a href="/login">Login</a></li>
            ) : (
              <>
                <li>
                  <button className={styles.userBtn} onClick={handleUserIconClick} title="Go to Dashboard">👤</button>
                </li>
                <li>
                  <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* ===== HERO / SEARCH ===== */}
      <section className={styles.hero}>
        <h2>Find the Best PG Near You!</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Enter city or area"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            
          />
          <input
            type="number"
            placeholder="Enter your budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* ===== POPULAR CITIES ===== */}
      <section className={styles.popularCities}>
  <h2>Popular Cities</h2>
  <div className={styles.cityGrid}>
    {["Ahmedabad", "Mumbai", "Bangalore", "Pune"].map((city, index) => {
      
      // Fixed PG-style images for 4 cities
      const pgImages = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=60", // Ahmedabad
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=60", // Mumbai
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=400&q=60", // Bangalore
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=400&q=60"  // Pune
      ];

      return (
        <div
          key={city}
          className={styles.cityCard}
          onClick={() => console.log(`Filter PGs by ${city}`)}
        >
          <div className={styles.cityOverlay}>{city}</div>
          <img src={pgImages[index]} alt={city} />
        </div>
      );
    })}
  </div>
</section>


      {/* ===== FEATURED PGs ===== */}
      <section className={styles.featuredPGs}  ref={featuredRef}>
        <h2>Featured PGs</h2>
        <PGList city={city} budget={budget} />

      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1️⃣</span>
            <h3>Search PG</h3>
            <p>Find PGs in your preferred location easily.</p>
          </div>
          <div className={styles.step}>
            <span>2️⃣</span>
            <h3>Check Details</h3>
            <p>View images, amenities, and rent details before booking.</p>
          </div>
          <div className={styles.step}>
            <span>3️⃣</span>
            <h3>Contact Owner</h3>
            <p>Directly reach out to PG owners to finalize booking.</p>
          </div>
          <div className={styles.step}>
            <span>4️⃣</span>
            <h3>Book & Move In</h3>
            <p>Confirm your stay and move in hassle-free.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.cta}>
        <h2>Ready to find your perfect PG?</h2>
        {!isLoggedIn ? (
          <button onClick={() => navigate("/signup")}>Sign Up Now</button>
        ) : (
          <button onClick={handleUserIconClick}>Go to Dashboard</button>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <p>&copy; 2025 PG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

