import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getImages, getImageById, BACKEND_URL } from "./api";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Fetch image list
    const loadImages = async () => {
      const data = await getImages();
      setImages(data);
    };
    loadImages();

    // Socket connection
    const socket = io(BACKEND_URL);
    socket.on("doorbell", (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(""), 4000);
      loadImages(); // refresh list
    });

    return () => socket.disconnect();
  }, []);

  const handleView = async (id) => {
    const data = await getImageById(id);
    if (data && data.data) setSelectedImage(data);
  };

  return (
    <div className="container">
      <h2>Doorbell Activity Feed</h2>
      {notification && (
        <div
          style={{
            background: "#28a745",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {notification}
        </div>
      )}

      {selectedImage ? (
        <div>
          <button onClick={() => setSelectedImage(null)}>← Back</button>
          <h4>{selectedImage.filename}</h4>
          <img
  					src={`https://doorbell-backend.onrender.com/images/${selectedImage.filename}`}
            alt={selectedImage.filename}
          />
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <p style={{ textAlign: "center" }}>No doorbell images found.</p>
          ) : (
            <ul className="image-list">
              {images.map((img) => (
                <li key={img._id} className="image-item">
                  <div>
                    <strong>{img.filename}</strong>
                    <br />
                    <small>
                      {new Date(img.uploadedAt).toLocaleString()}
                    </small>
                  </div>
                  <button onClick={() => handleView(img._id)}>View</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;

