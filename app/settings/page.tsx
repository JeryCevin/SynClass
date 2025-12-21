"use client";

import { useState } from "react";

export default function SettingsPage() {
  // State untuk Tab Aktif
  const [activeTab, setActiveTab] = useState("akun");

  // State Form Ganti Password
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // State Notifikasi (Toggle)
  const [notifications, setNotifications] = useState({
    emailGrade: true,
    emailNews: false,
    pushNotif: true
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("❌ Password baru dan konfirmasi tidak cocok!");
      return;
    }
    // Disini nanti panggil Supabase: supabase.auth.updateUser(...)
    alert("✅ Password berhasil diubah!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h1>

      {/* --- MENU TAB --- */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("akun")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "akun" 
              ? "border-b-2 border-blue-600 text-blue-600" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Keamanan Akun
        </button>
        <button
          onClick={() => setActiveTab("notifikasi")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "notifikasi" 
              ? "border-b-2 border-blue-600 text-blue-600" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Notifikasi
        </button>
        <button
          onClick={() => setActiveTab("umum")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "umum" 
              ? "border-b-2 border-blue-600 text-blue-600" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Umum
        </button>
      </div>

      {/* --- KONTEN TAB: AKUN --- */}
      {activeTab === "akun" && (
        <div className="max-w-xl">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ganti Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Simpan Password
                </button>
              </div>
            </form>
          </div>

          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <h3 className="text-red-800 font-bold mb-2">Zona Bahaya</h3>
            <p className="text-red-600 text-sm mb-4">
              Menghapus akun akan menghilangkan semua data nilai dan presensi secara permanen.
            </p>
            <button 
                onClick={() => alert("Fitur ini dinonaktifkan demi keamanan demo.")}
                className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50"
            >
              Hapus Akun Saya
            </button>
          </div>
        </div>
      )}

      {/* --- KONTEN TAB: NOTIFIKASI --- */}
      {activeTab === "notifikasi" && (
        <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Preferensi Notifikasi</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Notifikasi Nilai Keluar</p>
                <p className="text-sm text-gray-500">Kirim email saat dosen memposting nilai baru.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.emailGrade}
                onChange={() => setNotifications({...notifications, emailGrade: !notifications.emailGrade})}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
            
            <hr />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Berita Kampus</p>
                <p className="text-sm text-gray-500">Dapatkan update mingguan tentang acara kampus.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.emailNews}
                onChange={() => setNotifications({...notifications, emailNews: !notifications.emailNews})}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- KONTEN TAB: UMUM --- */}
      {activeTab === "umum" && (
        <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Tampilan Aplikasi</h3>
           
           <div className="flex items-center justify-between mb-4">
              <span>Tema Gelap (Dark Mode)</span>
              <button 
                onClick={() => alert("Fitur Dark Mode sedang dalam pengembangan!")}
                className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-bold"
              >
                Segera Hadir
              </button>
           </div>
           
           <div className="flex items-center justify-between">
              <span>Bahasa</span>
              <select className="border p-2 rounded bg-gray-50">
                <option>Indonesia</option>
                <option>English</option>
              </select>
           </div>
        </div>
      )}
    </div>
  );
}