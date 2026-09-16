import Navbar from "@/components/Navbar";
import FilterKendaraan from "@/components/FilterKendaraan";
import { getLanding, getVehicles, getTestimonials, getSocials } from "@/lib/api";

export default async function Home() {
  const info = await getLanding();
  const kendaraan = await getVehicles();
  const testimoni = await getTestimonials();
  const socials = await getSocials();

  const pesan = encodeURIComponent("Halo, saya mau sewa kendaraan");
  const waUrl = `https://wa.me/${info.whatsapp}?text=${pesan}`;

  return (
    <main>
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold">Sewa Mobil & Motor di Lombok</h1>
        <p className="mt-3 text-gray-600">Harga transparan, unit terawat.</p>
        <div className="mt-7 flex justify-center gap-3">
          <a href={waUrl} target="_blank" className="rounded-full bg-green-600 px-6 py-2.5 font-semibold text-white">Booking via WhatsApp</a>
          <a href="#kendaraan" className="rounded-full border px-6 py-2.5 font-semibold">Lihat Kendaraan</a>
        </div>
      </section>

      {/* Katalog */}
      <section id="kendaraan" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Pilihan Kendaraan</h2>
        <FilterKendaraan kendaraan={kendaraan} />
      </section>

      {/* Tentang */}
      <section id="tentang" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Tentang Kami</h2>
        <p className="mt-3 max-w-2xl text-gray-600">{info.tentang}</p>
      </section>

      {/* Testimoni */}
      <section id="testimoni" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Kata Pelanggan</h2>
        <div className="grid grid-cols-2 gap-4">
          {testimoni.map((t, i) => (
            <div key={i} className="rounded-xl border p-5">
              <p className="text-yellow-500">{"★".repeat(t.rating)}</p>
              <p className="mt-2 text-gray-700">"{t.pesan}"</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={t.foto} alt={t.nama} className="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                <span className="text-sm font-semibold">{t.nama}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sosial media */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Ikuti Kami</h2>
        <div className="flex flex-wrap gap-4">
          {socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank" className="flex items-center gap-2 rounded-full border px-4 py-2">
              <img src={s.image} alt={s.name} className="h-5 w-5" />
              {s.name}
            </a>
          ))}
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Siap Jalan-Jalan di Lombok?</h2>
          <p className="mt-2 text-gray-600">{info.alamat}</p>
          <p className="text-gray-600">Jam buka: {info.jam_buka}</p>
          <a href={waUrl} target="_blank" className="mt-5 inline-block rounded-full bg-green-600 px-6 py-2.5 font-semibold text-white">Chat via WhatsApp</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        (c) 2026 {info.nama}. Semua hak dilindungi.
      </footer>
    </main>
  );
}