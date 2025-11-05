import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://doorbell-backend.onrender.com";

function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select an image first!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Uploaded successfully!");
      setFile(null);
      onUploaded(); // refresh gallery
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "📤 Upload"}
      </button>
    </form>
  );
}

export default UploadForm;

