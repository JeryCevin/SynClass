export default function KRSPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Kartu Rencana Studi (KRS)</h1>
      <p className="text-gray-500 mb-6">Semester Ganjil 2025/2026</p>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold mb-4">Mata Kuliah Ditawarkan</h3>
        <div className="space-y-3">
          {/* Item KRS 1 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-800">Manajemen Proyek IT (3 SKS)</p>
              <p className="text-xs text-gray-500">TI-601 • Senin, 10:00</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">Ambil</button>
          </div>
          
          {/* Item KRS 2 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-800">Keamanan Jaringan (3 SKS)</p>
              <p className="text-xs text-gray-500">TI-605 • Kamis, 08:00</p>
            </div>
            <button className="bg-gray-300 text-gray-500 px-4 py-1 rounded text-sm cursor-not-allowed">Penuh</button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <p className="font-bold">Total SKS Diambil: <span className="text-blue-600">21 SKS</span></p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
            Ajukan KRS
          </button>
        </div>
      </div>
    </div>
  );
}