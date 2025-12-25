import React, { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ to read pgId from URL
import styles from "./UploadImages.module.css";
import { useNavigate } from "react-router-dom";

const UploadImages = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { pgId } = useParams(); // ✅ get PG id from route
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upload images.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file); // backend will use multer to parse
      });

      // ✅ send pgId in body too
      formData.append("pgId", pgId);

      const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/pgs/upload-images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // do NOT set Content-Type manually for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data);
        alert(data.message || "Upload failed.");
        return;
      }

      console.log("Images uploaded successfully:", data);
      alert("Images uploaded successfully!");
      setSelectedFiles([]); // reset
      navigate(`/owner/manage-listings`);

    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong while uploading.1");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📸 Upload PG Images</h2>
      <p className={styles.pgId}>PG ID: {pgId}</p> {/* helpful for debugging */}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        <div className={styles.previewGrid}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={styles.previewCard}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className={styles.previewImage}
              />
              <p className={styles.fileName}>{file.name}</p>
            </div>
          ))}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Upload Images
        </button>
      </form>
    </div>
  );
};

export default UploadImages;

