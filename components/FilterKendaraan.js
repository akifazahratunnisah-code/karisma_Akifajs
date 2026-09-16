"use client";
import { useState } from "react";
import VehicleCard from "./VehicleCard";

export default function FilterKendaraan({ kendaraan }) {
  const [jenis, setJenis] = useState("semua");

  const tampil =
    jenis === "semua" ? kendaraan : kendaraan.filter((k) => k.jenis === jenis);

  const tombol = (nilai, label) => (
    <button
      onClick={() => setJenis(nilai)}
      className={jenis === nilai
        ? "rounded-lg bg-white text-black px-4 py-1.5 text-sm"
        : "rounded-lg border px-4 py-1.5 text-sm"}>
      {label}
    </button>
  );

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        {tombol("semua", "Semua")}
        {tombol("mobil", "Mobil")}
        {tombol("motor", "Motor")}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tampil.map((k) => (
          <VehicleCard key={k.slug} {...k} />
        ))}
      </div>
    </div>
  );
}