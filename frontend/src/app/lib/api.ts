export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "https://phishguard-backend-j35c.onrender.com").replace(/\/+$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
