import React, { useEffect, useState } from "react";
import API_BASE from "./api";
import io from "socket.io-client";
import "./App.css";

const socket = io(API_BASE);

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    fetchImages();

    socket.on("doorbell", () => {
      setNotif("🚪 Someone rang the doorbell!");
      setTimeout(() => setNotif(null), 5000);
      fetchImages();
    });

    return () => socket.disconnect();
  }, []);

  const fetchImages = async () => {
    const res = await fetch(`${API_BASE}/images`);
    const data = await res.json();
    setImages(data);
  };

  const viewImage = async (id) => {
    const res = await fetch(`${API_BASE}/images/${id}`);
    const data = await res.json();
    setSelectedImage(data);
  };

  return (
    <div className="container">
      <h1>Doorbell Camera</h1>
      {notif && <div className="notification">{notif}</div>}

      <ul className="image-list">
        {images.map((img) => (
          <li key={img._id}>
            <span>{new Date(img.uploadedAt).toLocaleString()}</span>
            <button onClick={() => viewImage(img._id)}>View</button>
          </li>
        ))}
      </ul>

      {selectedImage && (
        <div className="image-viewer">
          <button className="close" onClick={() => setSelectedImage(null)}>
            ✖
          </button>
          <img
            src={`data:image/jpeg;base64,${selectedImage.data}`}
            alt="Doorbell"
          />
          <p>{new Date(selectedImage.uploadedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default App;

