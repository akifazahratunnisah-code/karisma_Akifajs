"use client";
import { useEffect, useState } from "react";
import { fetchAuth, fetchUpload } from "@/lib/auth";

const KOSONG = { 
  nama: "", 
  slug: "", 
  jenis: "mobil", 
  transmisi: "matic", 
  harga_harian: "", 
  kapasitas: "", 
  status: "tersedia", 
  deskripsi: "" 
};

export default function KendaraanPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(KOSONG);
  const [berkas, setBerkas] = useState([]); 
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    try {
      const data = await fetchAuth("/vehicles");
      setItems(data.data ?? data);
    } catch (err) {
      console.error("Gagal memuat data kendaraan:", err);
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
      slug: k.slug, 
      jenis: k.jenis, 
      transmisi: k.transmisi, 
      harga_harian: k.harga_harian, 
      kapasitas: k.kapasitas, 
      status: k.status, 
      deskripsi: k.deskripsi ?? "" 
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
        harga_harian: Number(form.harga_harian), 
        kapasitas: Number(form.kapasitas) 
      });

      // 1) Simpan data kendaraan (JSON) — POST kalau baru, PATCH kalau edit
      const res = editId
        ? await fetchAuth(`/vehicles/${editId}`, { method: "PATCH", body })
        : await fetchAuth("/vehicles", { method: "POST", body });

      const vehicleId = editId ?? res?.id ?? res?.data?.id;

      // 2) Kalau ada foto dipilih, upload (multipart) ke id kendaraannya
      if (berkas.length > 0 && vehicleId) {
        const fd = new FormData();
        berkas.forEach((file) => fd.append("files", file));
        await fetchUpload(`/vehicles/${vehicleId}/photos`, fd);
      } else if (berkas.length > 0 && !vehicleId) {
        console.warn("ID kendaraan tidak ditemukan, foto gagal di-upload.");
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
    if (!confirm("Hapus kendaraan ini?")) return;
    try {
      await fetchAuth(`/vehicles/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus kendaraan.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kendaraan</h1>

      <form onSubmit={simpan} className="mb-8 grid max-w-lg gap-3 rounded-xl border p-4">
        {errorMsg && <div className="rounded bg-red-50 p-2 text-sm text-red-600">{errorMsg}</div>}
        
        <input 
          placeholder="Nama" 
          value={form.nama} 
          onChange={(e) => set("nama", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />
        <input 
          placeholder="Slug (mis. toyota-avanza-2022)" 
          value={form.slug} 
          onChange={(e) => set("slug", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />
        
        <select value={form.jenis} onChange={(e) => set("jenis", e.target.value)} className="rounded border px-3 py-2">
          <option value="mobil">Mobil</option>
          <option value="motor">Motor</option>
        </select>

        <select value={form.transmisi} onChange={(e) => set("transmisi", e.target.value)} className="rounded border px-3 py-2">
          <option value="matic">Matic</option>
          <option value="manual">Manual</option>
        </select>

        <input 
          type="number" 
          placeholder="Harga per hari" 
          value={form.harga_harian} 
          onChange={(e) => set("harga_harian", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />
        <input 
          type="number" 
          placeholder="Kapasitas (orang)" 
          value={form.kapasitas} 
          onChange={(e) => set("kapasitas", e.target.value)} 
          required
          className="rounded border px-3 py-2" 
        />

        <select value={form.status} onChange={(e) => set("status", e.target.value)} className="rounded border px-3 py-2">
          <option value="tersedia">Tersedia</option>
          <option value="disewa">Disewa</option>
        </select>

        <textarea 
          placeholder="Deskripsi" 
          value={form.deskripsi} 
          onChange={(e) => set("deskripsi", e.target.value)} 
          className="rounded border px-3 py-2" 
        />

        <input 
          type="file" 
          multiple 
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
            {loading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Tambah Kendaraan")}
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
            {k.foto?.[0] && <img src={k.foto[0].url ?? k.foto[0]} alt={k.nama} className="h-12 w-16 rounded object-cover" />}
            <span className="flex-1">{k.nama} · {k.jenis} · Rp{Number(k.harga_harian)?.toLocaleString("id-ID")}/hari</span>
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