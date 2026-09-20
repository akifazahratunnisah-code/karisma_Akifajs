const API = process.env.NEXT_PUBLIC_API_URL;

// === Login: satu-satunya request TANPA token — ambil token lalu simpan ===
export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Email atau password salah");
  const data = await res.json();
  setToken(data.token);        // simpan token buat request berikutnya
  return data;
}

// === Request ke endpoint MERCHANT (JSON, butuh Bearer) ===
export async function fetchAuth(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  if (res.status === 401) { clearToken(); throw new Error("Sesi habis — login lagi"); }
  if (!res.ok) throw new Error("Request gagal");
  return res.json();
}

// Upload file (multipart) — JANGAN set Content-Type, biar browser isi boundary sendiri
export async function fetchUpload(path, formData, method = "POST") {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (res.status === 401) { clearToken(); throw new Error("Sesi habis — login lagi"); }
  if (!res.ok) throw new Error("Upload gagal");
  return res.json();
}

// === Helper token (dipakai fungsi di atas) — function declaration di-hoist ===
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
export function setToken(t) { localStorage.setItem("token", t); }
export function clearToken() { localStorage.removeItem("token"); }