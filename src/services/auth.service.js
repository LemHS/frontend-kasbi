import { API_BASE_URL } from "../config";

export async function loginRequest(email, password) {
  const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw err || { message: "Login gagal" };
  }

  return res.json();
}
