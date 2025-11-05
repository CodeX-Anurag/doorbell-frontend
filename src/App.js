import React, { useEffect, useState } from "react";
import "./App.css";
import { getImages, getImageById, BACKEND_URL } from "./api";
import { io } from "socket.io-client";

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    loadImages();

    // connect socket
    const socket = io(BACKEND_URL, { transports: ["websocket"] });

    // when new doorbell ping occurs
    socket.on("doorbell", () => {
      setNotification("🔔 Someone pressed the doorbell!");
      setTimeout(() => setNotification(""), 5000);
    });

    // when new image added
    socket.on("newImage", (data) => {
      setNotification("🖼️ New image uploaded!");
      setImages((prev) => [data, ...prev]);
      setTimeout(() => setNotification(""), 5000);
    });

    return () => socket.disconnect();
  }, []);

  const loadImages = async () => {
    try {
      const data = await getImages();
      const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
      setImages(sorted);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const data = await getImageById(id);
      setSelectedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      console.error("Error loading image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>📸 Doorbell Activity Feed</h1>

      {notification && <div className="notification">{notification}</div>}

      <div className="image-list">
        {images.length === 0 && <p>No images found</p>}
        {images.map((img) => (
          <div key={img._id} className="image-card">
            <p><b>Time:</b> {new Date(img.timestamp).toLocaleString()}</p>
            <button onClick={() => handleView(img._id)}>View</button>
          </div>
        ))}
      </div>

      {loading && <p>Loading image...</p>}

      {selectedImage && (
        <div className="popup" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
}

export default App;

