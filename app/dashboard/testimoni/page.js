"use client";
import { useEffect, useState } from "react";
import { fetchAuth, fetchUpload } from "@/lib/auth";

const KOSONG = { 
  nama: "", 
  pekerjaan: "", 
  testimoni: "", 
  rating: "5" 
};

export default function TestimoniPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(KOSONG);
  const [berkas, setBerkas] = useState([]); 
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    try {
      const data = await fetchAuth("/testimonials");
      setItems(data.data ?? data);
    } catch (err) {
      console.error("Gagal memuat data testimoni:", err);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  const set = (k, v) => setForm({ ...form, [k]: v });

  function mulaiEdit(k) {
    setEditId(k.id);
    setForm({ 
      nama: k.nama, 
      pekerjaan: k.pekerjaan ?? "", 
      testimoni: k.testimoni, 
      rating: String(k.rating ?? 5) 
    });
  }

  function batal() { 
    setEditId(null); 
    setForm(KOSONG); 
    setBerkas([]); 
    setErrorMsg("");
  }

  async function simpan(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const body = JSON.stringify({ 
        ...form, 
        rating: Number(form.rating) 
      });

      const res = editId
        ? await fetchAuth(`/testimonials/${editId}`, { method: "PATCH", body })
        : await fetchAuth("/testimonials", { method: "POST", body });

      const testimoniId = editId ?? res?.id ?? res?.data?.id;

      if (berkas.length > 0 && testimoniId) {
        const fd = new FormData();
        berkas.forEach((file) => fd.append("files", file));
        await fetchUpload(`/testimonials/${testimoniId}/photo`, fd);
      } else if (berkas.length > 0 && !testimoniId) {
        console.warn("ID testimoni tidak ditemukan, foto gagal di-upload.");
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
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      await fetchAuth(`/testimonials/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus testimoni.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Testimoni</h1>

      <form onSubmit={simpan} className="mb-8 grid max-w-lg gap-3 rounded-xl border p-4">
        {errorMsg && <div className="rounded bg-red-50 p-2 text-sm text-red-600">{errorMsg}</div>}
        
        <input 
          placeholder="Nama Pelanggan" 
          value={form.nama} 
          onChange={(e) => set("nama", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />
        <input 
          placeholder="Pekerjaan / Instansi (mis. Wisatawan)" 
          value={form.pekerjaan} 
          onChange={(e) => set("pekerjaan", e.target.value)} 
          className="rounded border px-3 py-2" 
        />
        
        <select value={form.rating} onChange={(e) => set("rating", e.target.value)} className="rounded border px-3 py-2">
          <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
          <option value="4">⭐⭐⭐⭐ (4/5)</option>
          <option value="3">⭐⭐⭐ (3/5)</option>
          <option value="2">⭐⭐ (2/5)</option>
          <option value="1">⭐ (1/5)</option>
        </select>

        <textarea 
          placeholder="Isi Testimoni" 
          value={form.testimoni} 
          onChange={(e) => set("testimoni", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />

        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setBerkas(Array.from(e.target.files))} 
          className="rounded border px-3 py-2" 
        />

        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-full bg-black px-5 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Tambah Testimoni")}
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
            {k.foto?.[0] && <img src={k.foto[0].url ?? k.foto[0]} alt={k.nama} className="h-12 w-12 rounded-full object-cover" />}
            <div className="flex-1">
              <p className="font-semibold">{k.nama} <span className="text-sm font-normal text-gray-500">({k.rating}★)</span></p>
              <p className="text-sm text-gray-600 line-clamp-1">&ldquo;{k.testimoni}&rdquo;</p>
            </div>
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