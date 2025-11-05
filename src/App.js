import React, { useState, useEffect } from "react";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/images`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      alert("✅ Uploaded successfully!");
      fetchImages(); // refresh list
    } catch (err) {
      alert("❌ Upload failed.");
    }
  };

  return (
    <div className="container">
      <h1>📸 Doorbell Camera</h1>

      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="gallery">
          {images.length === 0 ? (
            <p>No images yet.</p>
          ) : (
            images.map((img) => (
              <div className="card" key={img.id}>
                <img src={img.base64} alt={img.filename} />
                <p>{new Date(img.uploadedAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      <label className="upload-btn">
        ⬆️ Upload Test Image
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          hidden
        />
      </label>
    </div>
  );
}

