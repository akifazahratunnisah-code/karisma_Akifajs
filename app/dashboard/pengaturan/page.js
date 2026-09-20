"use client";
import { useEffect, useState } from "react";
import { fetchAuth } from "@/lib/auth";

export default function PengaturanPage() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchAuth("/merchant").then((m) => {
      const d = m.data ?? m;
      setForm({ nama: d.nama ?? "", whatsapp: d.whatsapp ?? "" });
    });
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  async function simpan(e) {
    e.preventDefault();
    await fetchAuth("/merchant", { method: "PATCH", body: JSON.stringify(form) });
    alert("Tersimpan!");
  }

  if (!form) return <p className="text-gray-500">Memuat…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pengaturan</h1>
      <form onSubmit={simpan} className="grid max-w-lg gap-3 rounded-xl border p-4">
        <input placeholder="Nama bisnis" value={form.nama} onChange={(e) => set("nama", e.target.value)} className="rounded border px-3 py-2" />
        <input placeholder="Nomor WhatsApp (628...)" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="rounded border px-3 py-2" />
        <button className="rounded-full bg-black py-2 font-semibold text-white">Simpan</button>
      </form>
    </div>
  );
}