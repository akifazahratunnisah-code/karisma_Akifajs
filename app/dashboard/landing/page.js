"use client";
import { useEffect, useState } from "react";
import { fetchAuth } from "@/lib/auth";

export default function EditLandingPage() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchAuth("/merchant").then((m) => {
      const d = m.data ?? m;
      setForm({
        hero_judul: d.hero_judul ?? "",
        hero_subjudul: d.hero_subjudul ?? "",
        hero_gambar: d.hero_gambar ?? "",
        tentang: d.tentang ?? "",
        alamat: d.alamat ?? "",
        jam_buka: d.jam_buka ?? "",
      });
    });
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  async function simpan(e) {
    e.preventDefault();
    await fetchAuth("/merchant/landing", { method: "PATCH", body: JSON.stringify(form) });
    alert("Tersimpan!");
  }

  if (!form) return <p className="text-gray-500">Memuat…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Landing</h1>
      <form onSubmit={simpan} className="grid max-w-lg gap-3 rounded-xl border p-4">
        <input placeholder="Judul hero" value={form.hero_judul} onChange={(e) => set("hero_judul", e.target.value)} className="rounded border px-3 py-2" />
        <input placeholder="Subjudul hero" value={form.hero_subjudul} onChange={(e) => set("hero_subjudul", e.target.value)} className="rounded border px-3 py-2" />
        <input placeholder="URL gambar hero" value={form.hero_gambar} onChange={(e) => set("hero_gambar", e.target.value)} className="rounded border px-3 py-2" />
        <textarea placeholder="Tentang kami" value={form.tentang} onChange={(e) => set("tentang", e.target.value)} className="rounded border px-3 py-2" />
        <input placeholder="Alamat" value={form.alamat} onChange={(e) => set("alamat", e.target.value)} className="rounded border px-3 py-2" />
        <input placeholder="Jam buka" value={form.jam_buka} onChange={(e) => set("jam_buka", e.target.value)} className="rounded border px-3 py-2" />
        <button className="rounded-full bg-black py-2 font-semibold text-white">Simpan Perubahan</button>
      </form>
    </div>
  );
}