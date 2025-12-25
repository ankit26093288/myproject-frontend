import React from "react";
import styles from "../css/AboutUs.module.css";

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Find Your Perfect PG 🏠</h1>
          <p>Connecting students and professionals with verified and affordable accommodation.</p>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          PG Finder was created to make finding a home away from home simple and transparent. 
          We understand how challenging it can be to locate safe, budget-friendly, and verified 
          accommodations when moving to a new city — that’s why we’re here to help.
        </p>
      </section>

      {/* ===== FEATURES ===== */}
      <section className={styles.features}>
        <h2>What We Offer</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <span>✅</span>
            <h3>Verified Listings</h3>
            <p>All PGs are reviewed and approved for safety and authenticity.</p>
          </div>
          <div className={styles.featureCard}>
            <span>💰</span>
            <h3>Budget Friendly</h3>
            <p>Find rooms that match your budget and comfort level.</p>
          </div>
          <div className={styles.featureCard}>
            <span>📍</span>
            <h3>Location Based Search</h3>
            <p>Quickly find PGs near your college, office, or city area.</p>
          </div>
          <div className={styles.featureCard}>
            <span>💬</span>
            <h3>Direct Owner Contact</h3>
            <p>Contact PG owners directly — no middlemen involved.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={styles.steps}>
        <h2>How It Works</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <span>🔍</span>
            <h4>Search</h4>
            <p>Enter your city and budget preferences.</p>
          </div>
          <div className={styles.stepCard}>
            <span>🏘️</span>
            <h4>Explore</h4>
            <p>Browse through verified and detailed PG listings.</p>
          </div>
          <div className={styles.stepCard}>
            <span>📅</span>
            <h4>Book</h4>
            <p>Contact the owner or book instantly online.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.cta}>
        <h2>Ready to Find Your Next Home?</h2>
        <p>Start exploring PGs in your city today.</p>
        <button onClick={() => window.location.href = "/"}>🔍 Explore Now</button>
      </section>
    </div>
  );
};

export default AboutUs;

