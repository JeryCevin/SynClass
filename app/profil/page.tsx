"use client";

import { useState, useEffect } from "react";

export default function ProfilPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("user_email") || "");
    setRole(localStorage.getItem("user_role") || "");
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Pengguna</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold">Jery Cevin</h2>
            <p className="text-gray-500">{email}</p>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold mt-2 inline-block">
              {role}
            </span>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Depan</label>
              <input type="text" defaultValue="Jery" className="w-full border p-2 rounded bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nama Belakang</label>
              <input type="text" defaultValue="Cevin" className="w-full border p-2 rounded bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Induk</label>
            <input type="text" defaultValue="202122001" disabled className="w-full border p-2 rounded bg-gray-200 cursor-not-allowed" />
          </div>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}