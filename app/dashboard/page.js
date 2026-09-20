"use client";
import { useEffect, useState } from "react";
import { fetchAuth } from "@/lib/auth";

export default function RingkasanPage() {
  const [stat, setStat] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchAuth("/vehicles"),
      fetchAuth("/testimonials"),
      fetchAuth("/socials"),
    ]).then(([v, t, s]) =>
      setStat({ kendaraan: (v.data ?? v).length, testimoni: (t.data ?? t).length, sosial: (s.data ?? s).length })
    );
  }, []);

  if (!stat) return <p className="text-gray-500">Memuat…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Ringkasan</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card label="Kendaraan" value={stat.kendaraan} />
        <Card label="Testimoni" value={stat.testimoni} />
        <Card label="Sosial Media" value={stat.sosial} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-xl border p-6">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}