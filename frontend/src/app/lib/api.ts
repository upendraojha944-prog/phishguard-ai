const getDefaultApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return "http://localhost:8000";
};

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || getDefaultApiBaseUrl()).replace(/\/+$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
