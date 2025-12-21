"use client";

import { useState, FormEvent } from "react"; // 1. Kita import FormEvent
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>(""); // 2. (Opsional) Kasih tahu ini string
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const router = useRouter();

  // 3. Di sini bedanya TS vs JS!
  // Kita harus kasih tahu bahwa 'e' adalah event dari sebuah Form
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (email === "admin@gmail.com" && password === "123456") {
      alert("Login Berhasil!");
      router.push("/");
    } else {
      setError("Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login TypeScript
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              // TypeScript otomatis tahu 'e' di sini adalah input event
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}