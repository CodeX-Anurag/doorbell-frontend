import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchImages, fetchImage, BACKEND_URL } from "./api";
import "./App.css";

export default function App() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [doorbellMsg, setDoorbellMsg] = useState("");

  useEffect(() => {
    // Connect to socket
    const socket = io(BACKEND_URL);
    socket.on("doorbell", (msg) => {
      setDoorbellMsg(msg.message);
      setTimeout(() => setDoorbellMsg(""), 5000);
    });
    socket.on("new_image", (meta) => {
      setImages((prev) => [meta, ...prev]);
    });

    fetchImages().then(setImages);
    return () => socket.disconnect();
  }, []);

  async function viewImage(id) {
    const img = await fetchImage(id);
    setSelected(img);
  }

  return (
    <div className="app">
      <h1>Smart Doorbell Feed</h1>

      {doorbellMsg && (
        <div className="doorbell-notif">🔔 {doorbellMsg}</div>
      )}

      <div className="image-grid">
        {images.map((img) => (
          <div key={img._id} className="image-card">
            <p>{img.filename}</p>
            <button onClick={() => viewImage(img._id)}>View</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setSelected(null)}>×</button>
            <img
              src={`data:${selected.contentType};base64,${selected.data}`}
              alt={selected.filename}
            />
            <p>{selected.filename}</p>
          </div>
        </div>
      )}
    </div>
  );
}

