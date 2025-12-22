"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Role = "kaprodi" | "dosen" | "mahasiswa";

export default function Sidebar() {
  const pathname = usePathname(); // Cek URL aktif
  const router = useRouter();
  
  const [role, setRole] = useState<Role | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  
  // 1. TAMBAHAN PENTING: State untuk mengecek apakah sudah di browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Menandai bahwa komponen sudah siap dirender di browser
    setIsMounted(true);

    // Cek Role dari LocalStorage
    const checkRole = () => {
      const storedRole = localStorage.getItem("user_role") as Role;
      if (storedRole) {
        setRole(storedRole);
      }
    };

    checkRole();
  }, [pathname]); // 2. TAMBAHAN PENTING: Cek ulang setiap URL berubah

  // Jika sedang di halaman Login, Sembunyikan Sidebar
  if (pathname === "/login") {
    return null;
  }

  // 3. TAMBAHAN PENTING: Jangan render apa-apa kalau belum mounted (Mencegah Error di Vercel)
  if (!isMounted) {
    return null; 
  }

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Konfigurasi Menu
  const allMenus = [
    { label: "Dashboard", icon: "🏠", href: "/", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "Profil", icon: "👤", href: "/profil", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "List Kelas", icon: "📚", href: "/list-kelas", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "KRS", icon: "📄", href: "/krs", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "KHS", icon: "📊", href: "/khs", roles: ["kaprodi", "dosen", "mahasiswa"] },
    { label: "Pengaturan", icon: "⚙️", href: "/settings", roles: ["kaprodi", "dosen", "mahasiswa"] },
  ];

  // Filter menu berdasarkan Role — enforce explicit allowed menus per role
  const roleAllowed: Record<Role, string[]> = {
    mahasiswa: ["/", "/profil", "/list-kelas", "/krs", "/khs"],
    dosen: ["/", "/profil", "/list-kelas", "/khs"],
    kaprodi: allMenus.map((m) => m.href as string),
  };

  const visibleMenus = role ? allMenus.filter((menu) => roleAllowed[role].includes(menu.href)) : [];

  return (
    <aside className={`${isOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col min-h-screen sticky top-0 h-screen z-50`}>
      <div className="p-5 flex items-center justify-between border-b border-slate-700">
        <h1 className={`font-bold text-xl text-blue-400 ${!isOpen && "hidden"}`}>SynClass</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Fallback jika role belum terbaca tapi sudah mounted */}
        {role === null && (
           <div className="text-center text-gray-500 text-xs animate-pulse mt-4">
              Memuat menu...
           </div>
        )}

        {visibleMenus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link 
              key={menu.href} 
              href={menu.href}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
                ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-gray-300 hover:text-white"}`}
            >
              <span className="text-xl">{menu.icon}</span>
              <span className={`${!isOpen && "hidden"} whitespace-nowrap`}>{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-200 transition">
          <span>🚪</span>
          <span className={`${!isOpen && "hidden"}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
}