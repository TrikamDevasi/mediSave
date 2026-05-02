import axios from "axios";

// In development: http://localhost:5000/api
// In production:  set VITE_API_URL=https://your-render-app.onrender.com/api in Vercel env vars
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

/** Safe wrapper: returns mock fallback if API unreachable. */
export async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await api.get<T>(path);
    return res.data;
  } catch {
    return fallback;
  }
}
