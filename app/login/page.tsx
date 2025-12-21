"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
// IMPORT CLIENT YANG ANDA BUAT TADI
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let supabase;
    try {
      supabase = createClient();
    } catch (err: any) {
      setError(err?.message || "Supabase client initialization gagal.");
      setLoading(false);
      return;
    }

    // Kirim data ke Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setError(authError.message); // Menampilkan error asli dari Supabase
      setLoading(false);
    } else {
      // --- LOGIKA TAMBAHAN: SIMPAN ROLE SEMENTARA ---
      // Logika ini berjalan HANYA jika login Supabase BERHASIL
      
      let role = "mahasiswa"; // Default role
      
      // Deteksi role berdasarkan string email (Logic simulasi kita)
      if (email.includes("admin") || email.includes("kaprodi")) {
        role = "kaprodi";
      } else if (email.includes("dosen")) {
        role = "dosen";
      }

      // Simpan ke LocalStorage agar Dashboard bisa membaca role-nya
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", email);
      // ----------------------------------------------

      router.push("/");
      router.refresh(); // Memastikan state login terupdate di seluruh aplikasi
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Masuk ke Synclass sekarang
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 p-3 border border-gray-900 text-black rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
} 