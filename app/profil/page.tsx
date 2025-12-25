"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ProfilPage() {
  // State untuk menyimpan data profil
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPwdForm, setShowPwdForm] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data dummy yang nanti akan diganti dengan data dari Supabase
  const [profil, setProfil] = useState({
    nama: "",
    nomorInduk: "", // Bisa NIM atau NIP
    jurusan: "",
    angkatan: "",
    fakultas: "",
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

        const byId = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (byId.error) profileError = byId.error;
        if (byId.data) profileData = byId.data;

        if (!profileData) {
          const byUserId = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          if (byUserId.error) profileError = byUserId.error;
          if (byUserId.data) profileData = byUserId.data;
        }

        if (!profileData) {
          const byEmail = await supabase
            .from("profiles")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();
          if (byEmail.error) profileError = byEmail.error;
          if (byEmail.data) profileData = byEmail.data;
        }

        // If table 'profiles' didn't have data, try singular 'profile' (some schemas use that name)
        if (!profileData) {
          const pById = await supabase
            .from("profile")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          if (pById.error) profileError = pById.error;
          if (pById.data) profileData = pById.data;

          if (!profileData) {
            const pByUserId = await supabase
              .from("profile")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (pByUserId.error) profileError = pByUserId.error;
            if (pByUserId.data) profileData = pByUserId.data;
          }

          if (!profileData) {
            const pByEmail = await supabase
              .from("profile")
              .select("*")
              .eq("email", user.email)
              .maybeSingle();
            if (pByEmail.error) profileError = pByEmail.error;
            if (pByEmail.data) profileData = pByEmail.data;
          }
        }

        if (profileError && !profileData) throw profileError;

        if (!profileData) {
          setError("Data profil tidak ditemukan di Supabase.");
          setLoading(false);
          return;
        }

        // Map fields from the profile row to our component state
        const resolvedName =
          profileData.nama ??
          profileData.name ??
          profileData.full_name ??
          profileData.display_name ??
          profileData.username ??
          profileData.user_name ??
          "";

        const resolvedFakultas =
          profileData.fakultas ??
          profileData.faculty ??
          profileData.department ??
          profileData.departement ??
          profileData.fakultas_name ??
          "";

        if (!resolvedName)
          console.warn(
            "Profil: kolom nama tidak ditemukan di row 'profile(s)'."
          );
        if (!resolvedFakultas)
          console.warn(
            "Profil: kolom fakultas tidak ditemukan di row 'profile(s)'."
          );

        setProfil({
          nama: resolvedName,
          nomorInduk:
            profileData.nomor_induk ??
            profileData.nomorInduk ??
            profileData.nim ??
            profileData.nidn,
          jurusan: profileData.jurusan ?? profileData.prodi ?? "",
          angkatan: profileData.angkatan ?? profileData.year ?? "",
          fakultas: resolvedFakultas,
        });

        setRole(profileData.role ?? profileData.user_role ?? "mahasiswa");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">👤</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profil Pengguna
            </h1>
            <p className="text-gray-500">Informasi akun dan data diri</p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#7a1d38] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-500">Memuat profil...</span>
        </div>
      )}
      {error && !loading && (
        <p className="text-red-600 mb-4 bg-red-50 p-4 rounded-xl">{error}</p>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
          {/* HEADER PROFIL */}
          <div className="bg-gradient-to-r from-[#7a1d38] to-[#5c1529] p-8 flex items-center gap-6 text-white">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl border-4 border-white/30">
              {role === "dosen" ? "👨‍🏫" : role === "kaprodi" ? "👮‍♂️" : "👨‍🎓"}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profil.nama}</h2>
              <p className="text-white/80">{email}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold capitalize backdrop-blur-sm">
                <span>{role}</span>
                <span>•</span>
                <span>
                  {role === "mahasiswa" ? "Mahasiswa Aktif" : "Staf Pengajar"}
                </span>
              </div>
            </div>
          </div>

          {/* FORM DATA DIRI */}
          <div className="p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Nama Lengkap (Read Only) */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profil.nama}
                  disabled
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* 2. NIM atau NIP (Dinamis Labelnya) */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {role === "mahasiswa"
                    ? "NIM (Nomor Induk Mahasiswa)"
                    : role === "dosen"
                    ? "NIP (Nomor Induk Pegawai)"
                    : "ID User"}
                </label>
                <input
                  type="text"
                  value={profil.nomorInduk}
                  disabled
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600 font-mono cursor-not-allowed"
                />
              </div>

              {/* 3. Jurusan / Prodi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Studi
                </label>
                <input
                  type="text"
                  value={profil.jurusan}
                  disabled
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600"
                />
              </div>

              {/* 4. Fakultas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fakultas
                </label>
                <input
                  type="text"
                  value={profil.fakultas}
                  disabled
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600"
                />
              </div>

              {/* 5. KHUSUS MAHASISWA: Tampilkan Angkatan */}
              {role === "mahasiswa" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Angkatan
                  </label>
                  <input
                    type="text"
                    value={profil.angkatan}
                    disabled
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
              )}
            </form>

            {/* Tombol Aksi */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPwdForm((s) => !s);
                  setSuccessMessage(null);
                  setError(null);
                }}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium"
              >
                Ubah Password
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-xl hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md font-medium">
                Request Edit Data
              </button>
            </div>

            {/* Form Ubah Password (tampil ketika diaktifkan) */}
            {showPwdForm && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setSuccessMessage(null);
                  if (newPassword.length < 6) {
                    setError("Password harus minimal 6 karakter.");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setError("Konfirmasi password tidak cocok.");
                    return;
                  }
                  setUpdatingPassword(true);
                  try {
                    const supabase = createClient();
                    const { data, error: updErr } =
                      await supabase.auth.updateUser({ password: newPassword });
                    if (updErr) throw updErr;
                    setSuccessMessage("Password berhasil diubah.");
                    setNewPassword("");
                    setConfirmPassword("");
                    setShowPwdForm(false);
                  } catch (err: any) {
                    setError(err?.message || "Gagal mengubah password.");
                  } finally {
                    setUpdatingPassword(false);
                  }
                }}
                className="mt-6 p-6 border border-gray-100 rounded-2xl bg-gray-50"
              >
                <h4 className="font-semibold text-gray-800 mb-4">
                  🔐 Ubah Password
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPwdForm(false);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium shadow-md"
                  >
                    {updatingPassword ? "Menyimpan..." : "Simpan Password"}
                  </button>
                </div>
                {successMessage && (
                  <p className="text-green-600 mt-3 bg-green-50 p-3 rounded-lg">
                    {successMessage}
                  </p>
                )}
                {error && (
                  <p className="text-red-600 mt-3 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
