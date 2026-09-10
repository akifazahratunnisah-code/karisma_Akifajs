"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { kendaraan } from "./data";

export default function BerandaPage() {
  const [filter, setFilter] = useState("Semua");
  const [sembunyikan, setSembunyikan] = useState(false);

  const ditampilkan =
    filter === "Semua"
      ? kendaraan
      : kendaraan.filter((k) => k.jenis === filter);

  return (
    <div>
      <Navbar />
      <Hero />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Tombol Filter dan Sembunyikan dalam satu baris */}
        <div className="flex gap-2 mb-4 items-center">
          <button onClick={() => setFilter("Semua")} className="rounded-full border px-4 py-1">Semua</button>
          <button onClick={() => setFilter("Mobil")} className="rounded-full border px-4 py-1">Mobil</button>
          <button onClick={() => setFilter("Motor")} className="rounded-full border px-4 py-1">Motor</button>
          
          {/* Tombol Sembunyikan dengan background hitam dan garis tepi (border) putih */}
          <button 
            onClick={() => setSembunyikan(!sembunyikan)} 
            className="rounded-full bg-black text-white border border-white px-4 py-1 transition hover:bg-gray-800"
          >
            {sembunyikan ? "Tampilkan" : "Sembunyikan"}
          </button>
        </div>

        {/* Kondisi jika sembunyikan bernilai true, maka list disembunyikan */}
        {!sembunyikan && (
          <div className="grid grid-cols-3 gap-4">
            {ditampilkan.map((k) => (
              <VehicleCard key={k.id} id={k.id} nama={k.nama} jenis={k.jenis} harga={k.harga} status={k.status} gambar={k.gambar} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}