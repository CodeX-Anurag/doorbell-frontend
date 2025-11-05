const BACKEND_URL = "https://doorbell-backend.onrender.com";

export const getImages = async () => {
  const res = await fetch(`${BACKEND_URL}/api/images`);
  return await res.json();
};

export const getImageById = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/images/${id}`);
  return await res.json();
};

export { BACKEND_URL };

