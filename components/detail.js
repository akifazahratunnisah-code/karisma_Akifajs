"use client";
import { useState } from "react";

export default function Detail() {
  const [buka, setBuka] = useState(false);
  return (
    <div>
      <button onClick={() => setBuka(!buka)} className="rounded border px-3 py-1">
        {buka ? "Sembunyikan" : "Tampilkan"} detail
      </button>
      {buka && <p className="mt-2 text-gray-600">Ini detail yang tadi disembunyiin.</p>}
    </div>
  );
}