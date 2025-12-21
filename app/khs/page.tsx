export default function KHSPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kartu Hasil Studi</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">3.85</h2>
            <p className="opacity-80">Indeks Prestasi Semester (IPS)</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Semester 4</p>
            <p className="font-bold">Tahun Ajaran 2024/2025</p>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Kode</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Mata Kuliah</th>
              <th className="p-4 text-sm font-semibold text-gray-600">SKS</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Nilai</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Mutu</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            <tr>
              <td className="p-4">TI-401</td>
              <td className="p-4">Pemrograman Mobile</td>
              <td className="p-4">3</td>
              <td className="p-4 font-bold text-green-600">A</td>
              <td className="p-4">12</td>
            </tr>
            <tr>
              <td className="p-4">TI-402</td>
              <td className="p-4">Statistika Probabilitas</td>
              <td className="p-4">3</td>
              <td className="p-4 font-bold text-blue-600">B+</td>
              <td className="p-4">10.5</td>
            </tr>
            <tr>
              <td className="p-4">TI-403</td>
              <td className="p-4">Etika Profesi</td>
              <td className="p-4">2</td>
              <td className="p-4 font-bold text-green-600">A</td>
              <td className="p-4">8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}