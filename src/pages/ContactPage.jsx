import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/ContactPage.module.css";

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg({ type: "", text: "" });

    try {
      const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponseMsg({ type: "error", text: data.message || "Something went wrong" });
      } else {
        setResponseMsg({ type: "success", text: "✅ Your message has been sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });

        // ⏱ After 2 seconds, navigate to home page
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error(err);
      setResponseMsg({ type: "error", text: "⚠️ Could not connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h2 className={styles.title}>Contact Us</h2>
      <p className={styles.subtitle}>
        Have a question or feedback? Send us a message and we’ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {responseMsg.text && (
        <div
          className={`${styles.responseMsg} ${
            responseMsg.type === "success" ? styles.success : styles.error
          }`}
        >
          {responseMsg.text}
        </div>
      )}
    </div>
  );
};

export default ContactPage;

