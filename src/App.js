import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API_BASE } from "./api";
import "./App.css";

const socket = io(API_BASE);

function App() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch existing images
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/images`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload image
  const handleUpload = async () => {
    if (!selectedFile) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Handle doorbell + new image notifications
  useEffect(() => {
    fetchImages();

    socket.on("doorbell", (data) => {
      setAlertMessage(data.message);
      setTimeout(() => setAlertMessage(""), 5000);
    });

    socket.on("new_image", (data) => {
      setImages((prev) => [data.image, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Test Image</button>
      </div>

      <div className="gallery">
        {images.map((img) => (
          <div key={img._id} className="card">
            <img
              src={`${API_BASE}${img.path}`}
              alt={img.filename}
              loading="lazy"
            />
            <p>{new Date(img.uploadedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

