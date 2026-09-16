export default function VehicleCard({ nama, jenis, harga_harian, status, foto }) {
  return (
    <div className="rounded-xl border p-4">
      <img src={foto?.[0]} alt={nama} className="w-full h-40 object-cover rounded-lg mb-3 bg-gray-100" />
      <div className="flex items-start justify-between">
        <h3 className="font-bold">{nama}</h3>

        <span className={status === "tersedia"
          ? "text-xs rounded-full bg-green-100 text-green-700 px-2 py-1"
          : "text-xs rounded-full bg-red-100 text-red-700 px-2 py-1"}>
          {status === "tersedia" ? "Tersedia" : "Disewa"}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{jenis}</p>
      <p className="font-semibold mt-2">Rp{harga_harian.toLocaleString("id-ID")}/hari</p>
    </div>
  );
}
