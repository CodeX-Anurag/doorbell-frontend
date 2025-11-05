import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadForm from "./UploadForm";
import "./App.css";

const API_BASE = "https://doorbell-backend.onrender.com";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/images`);
      setImages(res.data);
    } catch (err) {
      console.error("❌ Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    const interval = setInterval(fetchImages, 60000); // every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>📸 Doorbell History</h1>

      <UploadForm onUploaded={fetchImages} />

      <button onClick={fetchImages} disabled={loading} className="refresh-btn">
        {loading ? "Refreshing..." : "🔄 Refresh"}
      </button>

      <div className="gallery">
        {images.length === 0 && <p>No images yet.</p>}
        {images.map((img) => (
          <div key={img._id} className="card">
            <img
              src={`${API_BASE}${img.path}`}
              alt={img.filename}
              className="photo"
            />
            <p>{new Date(img.uploadedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

