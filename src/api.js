const BACKEND_URL = "https://doorbell-backend.onrender.com";

export async function fetchImages() {
  const res = await fetch(`${BACKEND_URL}/images`);
  return res.json();
}

export async function fetchImage(id) {
  const res = await fetch(`${BACKEND_URL}/images/id/${id}`);
  return res.json();
}

export { BACKEND_URL };

