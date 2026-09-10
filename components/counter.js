"use client";
import { useState } from "react";

export default function Counter() {
  const [angka, setAngka] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setAngka(angka - 1)} className="rounded border px-3 py-1">−</button>
      <span className="font-bold">{angka}</span>
      <button onClick={() => setAngka(angka + 1)} className="rounded border px-3 py-1">+</button>
    </div>
  );
}