export default function Calculator({harga,lama_sewa}){
    const total = harga * lama_sewa;
    return(
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-2">Total Biaya Sewa</h2>
            <p className="text-gray-700">Harga Sewa: Rp {harga.toLocaleString()}</p>
            <p className="text-gray-700">Lama Sewa: {lama_sewa} hari</p>
            <p className="text-gray-900 font-bold mt-2">Total: Rp {total.toLocaleString()}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Tambah
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Kurang
            </button>
        </div>
    )

    }