"use client";
import { useEffect, useState } from "react";
import { fetchAuth } from "@/lib/auth";

const KOSONG = { 
  platform: "instagram", 
  nama_akun: "", 
  url: "", 
  ikon: "" 
};

export default function SocialMediaPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(KOSONG);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    try {
      const data = await fetchAuth("/social-medias");
      setItems(data.data ?? data);
    } catch (err) {
      console.error("Gagal memuat data media sosial:", err);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  function mulaiEdit(k) {
    setEditId(k.id);
    setForm({ 
      platform: k.platform, 
      nama_akun: k.nama_akun, 
      url: k.url, 
      ikon: k.ikon ?? "" 
    });
  }

  function batal() { 
    setEditId(null); 
    setForm(KOSONG); 
    setErrorMsg("");
  }

  async function simpan(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const body = JSON.stringify(form);

      if (editId) {
        await fetchAuth(`/social-medias/${editId}`, { method: "PATCH", body });
      } else {
        await fetchAuth("/social-medias", { method: "POST", body });
      }

      batal();
      load();
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  }

  async function hapus(id) {
    if (!confirm("Hapus tautan media sosial ini?")) return;
    try {
      await fetchAuth(`/social-medias/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus media sosial.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Media Sosial</h1>

      <form onSubmit={simpan} className="mb-8 grid max-w-lg gap-3 rounded-xl border p-4">
        {errorMsg && <div className="rounded bg-red-50 p-2 text-sm text-red-600">{errorMsg}</div>}
        
        <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className="rounded border px-3 py-2">
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="twitter">Twitter / X</option>
        </select>

        <input 
          placeholder="Nama Akun (mis. @rental_mobil)" 
          value={form.nama_akun} 
          onChange={(e) => set("nama_akun", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />

        <input 
          type="url"
          placeholder="URL Tautan (mis. https://instagram.com/...)" 
          value={form.url} 
          onChange={(e) => set("url", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />

        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-full bg-black px-5 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Tambah Media Sosial")}
          </button>
          
          {editId && (
            <button type="button" onClick={batal} className="rounded-full border px-5 py-2">
              Batal
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {items.map((k) => (
          <li key={k.id} className="flex items-center gap-3 rounded-lg border p-3">
            <span className="flex-1 font-medium capitalize">
              {k.platform}: <a href={k.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{k.nama_akun}</a>
            </span>
            <div className="flex gap-3 text-sm">
              <button onClick={() => mulaiEdit(k)} className="text-blue-600">Edit</button>
              <button onClick={() => hapus(k.id)} className="text-red-600">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}