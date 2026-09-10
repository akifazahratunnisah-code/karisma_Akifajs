"use client";
import { useState } from "react";

export default function SapaNama() {
  const [nama, setNama] = useState("");
  return (
    <div>
      <input
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Ketik nama kamu"
        className="rounded border px-3 py-1"
      />
      <p className="mt-2">Halo, {nama || "..."}!</p>
    </div>
  );
}