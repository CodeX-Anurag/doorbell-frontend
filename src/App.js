import { useEffect, useState } from "react";
import io from "socket.io-client";

const API = "https://doorbell-backend.onrender.com";
const socket = io(API);

function App() {
  const [images, setImages] = useState([]);
  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    fetch(`${API}/images`)
      .then((res) => res.json())
      .then(setImages);

    socket.on("new_image", (data) => {
      setImages((prev) => [data, ...prev]);
    });
  }, []);

  const openImage = async (id) => {
    const res = await fetch(`${API}/images/${id}`);
    const data = await res.json();
    setViewImage(`data:image/png;base64,${data.data}`);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>🔔 Doorbell Log</h2>
      <ul>
        {images.map((img) => (
          <li key={img._id}>
            <strong>{new Date(img.uploadedAt).toLocaleString()}</strong>{" "}
            - {img.filename}{" "}
            <button onClick={() => openImage(img._id)}>View</button>
          </li>
        ))}
      </ul>

      {viewImage && (
        <div>
          <h3>Viewing Image</h3>
          <img src={viewImage} alt="Doorbell" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default App;

