"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Tipe data untuk Role
type Role = "kaprodi" | "dosen" | "mahasiswa";

export default function DashboardPage() {
  const router = useRouter();
  
  // STATE: Default kita set sebagai Mahasiswa dulu
  const [role, setRole] = useState<Role>("mahasiswa");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // LOGIKA MENU BERDASARKAN USE CASE DIAGRAM
  const allMenus = [
    { label: "Dashboard", icon: "🏠", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "Profil", icon: "👤", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "Manage User", icon: "👥", roles: ["kaprodi"] }, // KHUSUS KAPRODI
    { label: "List Kelas", icon: "📚", roles: ["kaprodi", "dosen", "mahasiswa"] }, // Include Materi & Presensi
    { label: "KRS", icon: "📄", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "KHS", icon: "📊", roles: ["kaprodi", "dosen", "mahasiswa"] },
  ];

  // Filter menu yang boleh dilihat oleh Role saat ini
  const visibleMenus = allMenus.filter((menu) => menu.roles.includes(role));

  const handleLogout = () => {
    alert("Logout berhasil!");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* --- SIDEBAR (Dinamis Sesuai Role) --- */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-5 flex items-center justify-between border-b border-slate-700">
          <h1 className={`font-bold text-xl text-blue-400 ${!isSidebarOpen && "hidden"}`}>SynClass</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* List Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleMenus.map((menu) => (
            <div key={menu.label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition text-gray-300 hover:text-white">
              <span className="text-xl">{menu.icon}</span>
              <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>{menu.label}</span>
            </div>
          ))}
        </nav>

        {/* Tombol Logout (Selalu Ada) */}
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-200 transition">
            <span>🚪</span>
            <span className={`${!isSidebarOpen && "hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        
        {/* Header Atas */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dashboard {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
            <p className="text-sm text-gray-500">Selamat datang di Sistem Informasi Akademik</p>
          </div>

          {/* SIMULASI GANTI ROLE (Hanya untuk Dev) */}
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase">Simulasi Role:</span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-white text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="kaprodi">Kaprodi</option>
            </select>
          </div>
        </header>

        {/* Konten Halaman */}
        <div className="p-8 overflow-y-auto">
          
          {/* Tampilan Khusus Berdasarkan Role */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Kartu 1: Berbeda tiap role */}
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg opacity-80">
                {role === 'mahasiswa' ? 'IPK Semester Ini' : role === 'dosen' ? 'Total Kelas Ajar' : 'Total User Aktif'}
              </h3>
              <p className="text-4xl font-bold mt-2">
                {role === 'mahasiswa' ? '3.85' : role === 'dosen' ? '4 Kelas' : '1,240'}
              </p>
            </div>

            {/* Kartu 2: Status */}
            <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg opacity-80">Status Akademik</h3>
              <p className="text-2xl font-bold mt-2">Aktif / 2025</p>
            </div>

            {/* Kartu 3: Notifikasi */}
            <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg opacity-80">Notifikasi Baru</h3>
              <p className="text-4xl font-bold mt-2">3</p>
            </div>
          </div>

          {/* Area Konten Sesuai Use Case */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Aktivitas Terbaru</h3>
            
            {role === 'kaprodi' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                👑 <b>Menu Admin:</b> Anda memiliki akses untuk menu <i>Manage User</i> di sidebar.
              </div>
            )}

            {role === 'dosen' && (
              <p className="text-gray-600">Jadwal mengajar Anda hari ini kosong.</p>
            )}

            {role === 'mahasiswa' && (
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="text-green-500">✅</span> Presensi berhasil di mata kuliah Pemrograman Web.
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="text-blue-500">ℹ️</span> Nilai KHS Semester 4 sudah keluar.
                </li>
              </ul>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}