"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Role = "kaprodi" | "dosen" | "mahasiswa";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkRole = () => {
      const storedRole = localStorage.getItem("user_role") as Role;
      if (storedRole) {
        setRole(storedRole);
      }
    };
    checkRole();
  }, [pathname]);

  if (pathname === "/login") {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const allMenus = [
    {
      label: "Dashboard",
      icon: "🏠",
      href: "/",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
    {
      label: "Profil",
      icon: "👤",
      href: "/profil",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
    {
      label: "Jadwal Kelas",
      icon: "📅",
      href: "/list-kelas",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
    {
      label: "KRS",
      icon: "📋",
      href: "/krs",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
    {
      label: "KHS",
      icon: "📊",
      href: "/khs",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
    {
      label: "Pengaturan",
      icon: "⚙️",
      href: "/settings",
      roles: ["kaprodi", "dosen", "mahasiswa"],
    },
  ];

  const roleAllowed: Record<Role, string[]> = {
    mahasiswa: ["/", "/profil", "/list-kelas", "/krs", "/khs"],
    dosen: ["/", "/profil", "/list-kelas", "/khs"],
    kaprodi: allMenus.map((m) => m.href as string),
  };

  const visibleMenus = role
    ? allMenus.filter((menu) => roleAllowed[role].includes(menu.href))
    : [];

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case "kaprodi":
        return "Kepala Program Studi";
      case "dosen":
        return "Dosen";
      case "mahasiswa":
        return "Mahasiswa";
      default:
        return "";
    }
  };

  return (
    <aside
      className={`${
        isOpen ? "w-72" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col min-h-screen sticky top-0 h-screen z-50 shadow-sm`}
    >
      {/* Header / Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${
              !isOpen && "justify-center w-full"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-xl text-[#7a1d38]">SynClass</h1>
                <p className="text-xs text-gray-400">Academic Portal</p>
              </div>
            )}
          </div>
          {isOpen && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full mt-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Role Badge */}
      {isOpen && role && (
        <div className="px-5 py-3">
          <div className="bg-gradient-to-r from-[#fdf2f4] to-[#fce7ea] rounded-xl p-3 border border-[#f9d0d9]">
            <p className="text-xs text-[#7a1d38] font-medium uppercase tracking-wide">
              Role Aktif
            </p>
            <p className="text-sm font-semibold text-[#5c1529] capitalize">
              {getRoleLabel(role)}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {role === null && (
          <div className="text-center text-gray-400 text-xs animate-pulse mt-4 px-3">
            Memuat menu...
          </div>
        )}

        {visibleMenus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white shadow-md"
                    : "hover:bg-[#fdf2f4] text-gray-600 hover:text-[#7a1d38]"
                }`}
            >
              <span
                className={`text-xl ${
                  isActive ? "" : "grayscale group-hover:grayscale-0"
                }`}
              >
                {menu.icon}
              </span>
              {isOpen && (
                <span className="font-medium whitespace-nowrap">
                  {menu.label}
                </span>
              )}
              {isActive && isOpen && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white/50"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100">
        {isOpen && (
          <div className="mb-3 px-2">
            <p className="text-xs text-gray-400">Semester Ganjil</p>
            <p className="text-sm font-medium text-gray-700">2024/2025</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 
            hover:bg-red-50 text-gray-500 hover:text-red-600 group ${
              !isOpen && "justify-center"
            }`}
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen && <span className="font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
