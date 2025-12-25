import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UploadImages.module.css";

const Deleteimg = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { pgId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Fetch existing images for this PG
    const fetchImages = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myproject-backend-xj7r.onrender.com/api/pgs/${pgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setExistingImages(data.imageUrls || []);
    };
    fetchImages();
  }, [pgId]);

  const handleRemoveImage = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myproject-backend-xj7r.onrender.com/api/pg-add-page/remove-image/${pgId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Image removed successfully!");
        setExistingImages(existingImages.filter((url) => url !== imageUrl));
      } else {
        alert(data.message || "Failed to remove image");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting image");
    }
  };

  // Your existing upload logic (unchanged)
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
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("pgId", pgId);

    const res = await fetch("https://myproject-backend-xj7r.onrender.com/api/pgs/upload-images", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Images uploaded successfully!");
      setExistingImages(data.pg.imageUrls);
      setSelectedFiles([]);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📸 Manage PG Images</h2>

      {/* ✅ Show existing images */}
      <div className={styles.previewGrid}>
        {existingImages.length > 0 ? (
          existingImages.map((url, index) => (
            <div key={index} className={styles.previewCard}>
              <img src={url} alt={`img-${index}`} className={styles.previewImage} />
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleRemoveImage(url)}
              >
                🗑️ Remove
              </button>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>

     {/*  ✅ Upload new images (optional)
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <button type="submit" className={styles.submitBtn}>
          Upload New Images
        </button>
      </form> */}

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Back to Edit PG
      </button>
    </div>
  );
};

export default Deleteimg;

