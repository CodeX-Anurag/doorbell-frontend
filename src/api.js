const BACKEND_URL = "https://doorbell-backend.onrender.com";

export const getImages = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/images`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
};

export const getImageById = async (id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/images/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching image:", err);
    return null;
  }
};

export { BACKEND_URL };

