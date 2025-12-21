export default function ListKelasPage() {
  const kelas = [
    { nama: "Pemrograman Web Lanjut", kode: "TI-402", jadwal: "Senin, 08:00", dosen: "Pak Budi" },
    { nama: "Basis Data II", kode: "TI-305", jadwal: "Selasa, 10:00", dosen: "Bu Rina" },
    { nama: "Kecerdasan Buatan", kode: "TI-501", jadwal: "Rabu, 13:00", dosen: "Pak Andi" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Kelas Saya</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelas.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded text-sm">{item.kode}</div>
              <span className="text-gray-400 text-sm">{item.jadwal}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.nama}</h3>
            <p className="text-gray-500 text-sm mb-6">Dosen: {item.dosen}</p>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100">
                📚 Materi
              </button>
              <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100">
                ✅ Presensi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}