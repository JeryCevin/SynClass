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
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">Dashboard {role}</h2>
        <p className="text-gray-500">Selamat datang kembali di SynClass</p>
      </header>

      {/* Contoh Konten Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500">Status</h3>
          <p className="text-2xl font-bold">Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
           <h3 className="text-gray-500">Total SKS</h3>
           <p className="text-2xl font-bold">24</p>
        </div>
      </div>
    </div>
  );
}