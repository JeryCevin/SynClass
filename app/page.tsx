"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const userRole = localStorage.getItem("user_role");
    const userEmail = localStorage.getItem("user_email");
    if (!userRole) {
      router.push("/login");
    } else {
      setRole(userRole);
      setUserName(userEmail?.split("@")[0] || "User");
    }
  }, [router]);

  const getRoleLabel = (r: string) => {
    switch (r) {
      case "kaprodi":
        return "Kepala Program Studi";
      case "dosen":
        return "Dosen";
      case "mahasiswa":
        return "Mahasiswa";
      default:
        return r;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Selamat datang,</p>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {userName}
                </h1>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fdf2f4] text-[#7a1d38] border border-[#f9d0d9]">
                {getRoleLabel(role)}
              </span>
            </div>
          </div>
          <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Hari ini
            </p>
            <p className="text-xl font-semibold text-gray-800">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </p>
            <p className="text-sm text-[#7a1d38] font-medium mt-1">
              Semester Ganjil 2024/2025
            </p>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Status Akademik
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Aktif</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-[#7a1d38] text-xl">✓</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-green-600">Sistem berjalan normal</p>
          </div>
        </div>

        {/* Total SKS Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Total SKS
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-[#7a1d38] h-1.5 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">80% dari maks. SKS</p>
          </div>
        </div>

        {/* Classes Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Mata Kuliah
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">📖</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Semester ini</p>
        </div>

        {/* Performance Card */}
        <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                IPK Kumulatif
              </p>
              <p className="text-3xl font-bold text-white mt-2">3.85</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">⭐</span>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-4">
            Predikat: Sangat Memuaskan
          </p>
        </div>
      </div>

      {/* Secondary Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                📋
              </span>
              Aktivitas Terbaru
            </h2>
            <button className="text-sm text-[#7a1d38] hover:underline font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors group cursor-pointer">
              <div className="w-10 h-10 bg-[#fdf2f4] group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <span>📝</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Tugas Algoritma Dikumpulkan
                </p>
                <p className="text-sm text-gray-500">Hari ini pukul 10:30</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                Sukses
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors group cursor-pointer">
              <div className="w-10 h-10 bg-[#fdf2f4] group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <span>📖</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Materi Basis Data Diperbarui
                </p>
                <p className="text-sm text-gray-500">Kemarin pukul 14:00</p>
              </div>
              <span className="text-xs bg-[#fdf2f4] text-[#7a1d38] px-3 py-1.5 rounded-full font-medium">
                Baru
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors group cursor-pointer">
              <div className="w-10 h-10 bg-[#fdf2f4] group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <span>📅</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Jadwal UAS Dipublikasikan
                </p>
                <p className="text-sm text-gray-500">2 hari yang lalu</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
                Info
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
              🚀
            </span>
            Akses Cepat
          </h2>
          <div className="space-y-2">
            <Link
              href="/list-kelas"
              className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
            >
              <span className="text-lg">📅</span>
              <span className="flex-1">Jadwal Kelas</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/krs"
              className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
            >
              <span className="text-lg">📋</span>
              <span className="flex-1">KRS Saya</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/khs"
              className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
            >
              <span className="text-lg">📊</span>
              <span className="flex-1">KHS & Nilai</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/profil"
              className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
            >
              <span className="text-lg">👤</span>
              <span className="flex-1">Profil Saya</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
