const API = process.env.NEXT_PUBLIC_API_URL;
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG; // "budi-rental"
const headers = { "X-Merchant-Slug": MERCHANT };

export async function getVehicles(jenis) {
  const url = jenis
    ? `${API}/public/vehicles?jenis=${jenis}`
    : `${API}/public/vehicles`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Gagal memuat kendaraan");
  const json = await res.json();
  return json.data;               // API bungkus di { data, total, ... }
}

export async function getVehicle(slug) {
  const res = await fetch(`${API}/public/vehicles/${slug}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal memuat detail");
  return res.json();
}

export async function getLanding() {
  const res = await fetch(`${API}/public/landing`, { headers });
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
}

export async function getTestimonials() {
  const res = await fetch(`${API}/public/testimonials`, { headers });
  if (!res.ok) throw new Error("Gagal memuat testimoni");
  return res.json();   // array langsung
}

export async function getSocials() {
  const res = await fetch(`${API}/public/socials`, { headers });
  if (!res.ok) throw new Error("Gagal memuat sosial media");
  return res.json();   // array langsung
}