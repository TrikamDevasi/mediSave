import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
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
