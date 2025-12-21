"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

export default function ManageUserPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "kaprodi") {
      alert("AKSES DITOLAK: Halaman ini hanya untuk Kaprodi!");
      router.push("/"); // Tendang ke dashboard
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah User</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* Dummy Data */}
            <tr className="hover:bg-gray-50">
              <td className="p-4">Budi Santoso</td>
              <td className="p-4">budi@dosen.com</td>
              <td className="p-4"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Dosen</span></td>
              <td className="p-4 text-green-600">Aktif</td>
              <td className="p-4"><button className="text-blue-600 hover:underline">Edit</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4">Siti Aminah</td>
              <td className="p-4">siti@mhs.com</td>
              <td className="p-4"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Mahasiswa</span></td>
              <td className="p-4 text-green-600">Aktif</td>
              <td className="p-4"><button className="text-blue-600 hover:underline">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}