"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ProfilPage() {
  // State untuk menyimpan data profil
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data dummy yang nanti akan diganti dengan data dari Supabase
  const [profil, setProfil] = useState({
    nama: "",
    nomorInduk: "", // Bisa NIM atau NIP
    jurusan: "",
    angkatan: "",
    fakultas: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();

        // Get the currently authenticated user
        const userResp = await supabase.auth.getUser();
        const user = (userResp as any)?.data?.user;
        if (!user?.email) {
          setError("Tidak ada pengguna yang terautentikasi.");
          setLoading(false);
          return;
        }

        // Query the `profile` table preferring the auth user id.
        // Try common column names: 'id', then 'user_id', then fallback to 'email'.
        let profileData: any = null;
        let profileError: any = null;

        const byId = await supabase.from("profile").select("*").eq("id", user.id).maybeSingle();
        if (byId.error) profileError = byId.error;
        if (byId.data) profileData = byId.data;

        if (!profileData) {
          const byUserId = await supabase.from("profile").select("*").eq("user_id", user.id).maybeSingle();
          if (byUserId.error) profileError = byUserId.error;
          if (byUserId.data) profileData = byUserId.data;
        }

        if (!profileData) {
          const byEmail = await supabase.from("profile").select("*").eq("email", user.email).maybeSingle();
          if (byEmail.error) profileError = byEmail.error;
          if (byEmail.data) profileData = byEmail.data;
        }

        if (profileError && !profileData) throw profileError;

        if (!profileData) {
          setError("Data profil tidak ditemukan di Supabase.");
          setLoading(false);
          return;
        }

        // Map fields from the profile row to our component state
        setProfil({
          nama: profileData.nama ?? profileData.name ?? "",
          nomorInduk: profileData.nomor_induk ?? profileData.nomorInduk ?? profileData.nim ?? "",
          jurusan: profileData.jurusan ?? profileData.prodi ?? "",
          angkatan: profileData.angkatan ?? profileData.year ?? "",
          fakultas: profileData.fakultas ?? ""
        });

        setRole(profileData.role ?? (profileData.user_role ?? "mahasiswa"));
        setEmail(user.email);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Pengguna</h1>
      {loading && <p className="text-gray-500 mb-4">Memuat profil...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        
        {/* HEADER PROFIL (Warna beda sesuai role) */}
        <div className={`p-8 flex items-center gap-6 text-white
          ${role === 'mahasiswa' ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 
            role === 'dosen' ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-gray-800'}`}>
          
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
            {role === 'dosen' ? '👨‍🏫' : role === 'kaprodi' ? '👮‍♂️' : '👨‍🎓'}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">{profil.nama}</h2>
            <p className="opacity-90">{email}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>{role}</span>
              <span>•</span>
              {/* Logika Tampilan Status */}
              <span>{role === 'mahasiswa' ? 'Mahasiswa Aktif' : 'Staf Pengajar'}</span>
            </div>
          </div>
        </div>

        {/* FORM DATA DIRI */}
        <div className="p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Nama Lengkap (Read Only) */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={profil.nama} 
                disabled 
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" 
              />
            </div>

            {/* 2. NIM atau NIP (Dinamis Labelnya) */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'mahasiswa' ? 'NIM (Nomor Induk Mahasiswa)' : role === 'dosen' ? 'NIP (Nomor Induk Pegawai)' : 'ID User'}
              </label>
              <input 
                type="text" 
                value={profil.nomorInduk} 
                disabled 
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600 font-mono cursor-not-allowed" 
              />
            </div>

            {/* 3. Jurusan / Prodi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
              <input 
                type="text" 
                value={profil.jurusan} 
                disabled 
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600" 
              />
            </div>

            {/* 4. Fakultas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fakultas</label>
              <input 
                type="text" 
                value={profil.fakultas} 
                disabled 
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600" 
              />
            </div>

            {/* 5. KHUSUS MAHASISWA: Tampilkan Angkatan */}
            {role === 'mahasiswa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                <input 
                  type="text" 
                  value={profil.angkatan} 
                  disabled 
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-gray-600" 
                />
              </div>
            )}

          </form>

          {/* Tombol Aksi (Hanya Hiasan dulu) */}
          <div className="mt-8 pt-6 border-t flex justify-end gap-3">
             <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Ubah Password</button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                Request Edit Data
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}