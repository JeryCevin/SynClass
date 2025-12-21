"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    // Cek keamanan sederhana
    const userRole = localStorage.getItem("user_role");
    if (!userRole) {
      router.push("/login");
    } else {
      setRole(userRole);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 capitalize mb-2">
              Dashboard {role}
            </h1>
            <p className="text-slate-600 text-lg">
              Selamat datang kembali di SynClass
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Hari ini</p>
            <p className="text-2xl font-semibold text-slate-700">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                Status
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">Aktif</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4">Sistem berjalan normal</p>
        </div>

        {/* Total SKS Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                Total SKS
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4">Semester ini</p>
        </div>

        {/* Classes Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                Kelas
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-4">Diikuti tahun ini</p>
        </div>

        {/* Performance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                IPK
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">3.85</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-4">Sangat baik</p>
        </div>
      </div>

      {/* Secondary Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>📝</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Tugas Algoritma Dikumpulkan
                </p>
                <p className="text-sm text-slate-600">Hari ini pukul 10:30</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Sukses
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>📖</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Materi Basis Data Diperbarui
                </p>
                <p className="text-sm text-slate-600">Kemarin pukul 14:00</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Baru
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>📅</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Jadwal UAS Dipublikasikan
                </p>
                <p className="text-sm text-slate-600">2 hari yang lalu</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                Info
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Akses Cepat</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all font-medium">
              📚 Daftar Kelas
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 text-green-900 rounded-lg hover:from-green-100 hover:to-green-200 transition-all font-medium">
              📋 Tugas & Nilai
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-900 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all font-medium">
              👤 Profil Saya
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-900 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all font-medium">
              ⚙️ Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
