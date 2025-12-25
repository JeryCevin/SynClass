"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
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

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      let role = "mahasiswa";

      if (email.includes("admin") || email.includes("kaprodi")) {
        role = "kaprodi";
      } else if (email.includes("dosen")) {
        role = "dosen";
      }

      // Store user data in localStorage
      if (data?.user?.id) {
        localStorage.setItem("user_id", data.user.id);
        console.log("✅ User ID stored:", data.user.id);
      }
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", email);
      console.log("✅ Login successful - Role:", role, "Email:", email);

      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7a1d38] via-[#5c1529] to-[#3d0f1c] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-[#7a1d38]">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SynClass</h1>
          <p className="text-white/70">Academic Information System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Selamat Datang
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Masuk ke akun untuk melanjutkan
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-3.5 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#7a1d38] focus:ring-[#7a1d38]"
                />
                Ingat saya
              </label>
              <a
                href="#"
                className="text-[#7a1d38] hover:underline font-medium"
              >
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white py-4 rounded-xl font-semibold hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                loading ? "opacity-70 cursor-not-allowed transform-none" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 SynClass. All rights reserved.
        </p>
      </div>
    </div>
  );
}
