"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

// Dummy data untuk Mata Kuliah
const dummyCourses = [
  {
    id: 1,
    kode: "IF101",
    nama: "Algoritma dan Pemrograman",
    sks: 3,
    semester: 1,
  },
  { id: 2, kode: "IF102", nama: "Struktur Data", sks: 3, semester: 2 },
  { id: 3, kode: "IF201", nama: "Basis Data", sks: 3, semester: 3 },
  { id: 4, kode: "IF202", nama: "Pemrograman Web", sks: 3, semester: 3 },
  {
    id: 5,
    kode: "IF301",
    nama: "Rekayasa Perangkat Lunak",
    sks: 4,
    semester: 5,
  },
  { id: 6, kode: "IF302", nama: "Kecerdasan Buatan", sks: 3, semester: 5 },
  { id: 7, kode: "IF303", nama: "Machine Learning", sks: 3, semester: 6 },
  { id: 8, kode: "IF401", nama: "Proyek Akhir", sks: 6, semester: 8 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("manageUser");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const tables = ["profiles", "profile"];
        let all: any[] | null = null;
        for (const t of tables) {
          try {
            const res = await supabase.from(t).select("*");
            if (!res.error && res.data && (res.data as any[]).length > 0) {
              all = res.data as any[];
              break;
            }
          } catch {
            /* ignore */
          }
        }
        if (!all) {
          setUsers([]);
          setUsersError(
            "Tidak dapat mengambil daftar user (cek RLS / nama tabel)."
          );
        } else {
          setUsers(all);
        }
      } catch (err: any) {
        setUsersError(err?.message || "Gagal mengambil users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users berdasarkan role
  const getStudents = () =>
    users.filter(
      (u) =>
        (u.role ?? u.user_role)?.toLowerCase() === "student" ||
        (u.role ?? u.user_role)?.toLowerCase() === "mahasiswa"
    );
  const getDosen = () =>
    users.filter(
      (u) =>
        (u.role ?? u.user_role)?.toLowerCase() === "dosen" ||
        (u.role ?? u.user_role)?.toLowerCase() === "lecturer"
    );
  const getKaprodi = () =>
    users.filter(
      (u) =>
        (u.role ?? u.user_role)?.toLowerCase() === "kaprodi" ||
        (u.role ?? u.user_role)?.toLowerCase() === "admin"
    );

  // Filter mata kuliah berdasarkan search
  const filteredCourses = dummyCourses.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Role badge styling
  const getRoleBadge = (role: string) => {
    const r = role?.toLowerCase() || "";
    if (r === "student" || r === "mahasiswa") {
      return "bg-blue-100 text-blue-800";
    } else if (r === "dosen" || r === "lecturer") {
      return "bg-green-100 text-green-800";
    } else if (r === "kaprodi" || r === "admin") {
      return "bg-purple-100 text-purple-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Resolve email from various possible column names (prefer profile fields)
  const resolveEmail = (u: any) => {
    if (!u) return "-";
    const candidates = [
      "email",
      "user_email",
      "profile_email",
      "email_profile",
      "email_address",
      "mail",
      "account_email",
    ];
    for (const k of candidates) {
      if (u[k]) return u[k];
    }

    // scan all string fields for an address containing '@'
    for (const key of Object.keys(u)) {
      const val = u[key];
      if (typeof val === "string" && val.includes("@")) return val;
    }

    // fallback to username/name
    return u?.username ?? u?.name ?? u?.nama ?? "-";
  };

  // User Table Component
  const UserTable = ({
    title,
    icon,
    users,
    colorClass,
  }: {
    title: string;
    icon: string;
    users: any[];
    colorClass: string;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className={`px-6 py-4 ${colorClass} flex items-center gap-3`}>
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-white/80">
            {users.length} pengguna terdaftar
          </p>
        </div>
      </div>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Nama
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Role
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id ?? idx}
                  className="border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600">
                        {(u.nama ?? u.name ?? u.full_name ?? "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">
                        {u.nama ?? u.name ?? u.full_name ?? u.username ?? "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{resolveEmail(u)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        u.role ?? u.user_role
                      )}`}
                    >
                      {(u.role ?? u.user_role ?? "-").charAt(0).toUpperCase() +
                        (u.role ?? u.user_role ?? "-").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500">
          <span className="text-4xl mb-2 block">📭</span>
          <p>Tidak ada pengguna dalam kategori ini.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          ⚙️ Pengaturan
        </h1>
        <p className="text-slate-600 text-lg">
          Kelola pengguna dan mata kuliah sistem
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex gap-2">
        <button
          onClick={() => setActiveTab("manageUser")}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "manageUser"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          👥 Manage User
        </button>
        <button
          onClick={() => setActiveTab("matakuliah")}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "matakuliah"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          📚 Mata Kuliah
        </button>
      </div>

      {/* Tab Content: Manage User */}
      {activeTab === "manageUser" && (
        <div>
          {loadingUsers ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat daftar pengguna...</p>
            </div>
          ) : usersError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              <span className="text-2xl mr-2">⚠️</span>
              {usersError}
            </div>
          ) : (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm uppercase tracking-wide">
                        Mahasiswa
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {getStudents().length}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                      🎓
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm uppercase tracking-wide">
                        Dosen
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {getDosen().length}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">
                      👨‍🏫
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm uppercase tracking-wide">
                        Kaprodi
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {getKaprodi().length}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">
                      👔
                    </div>
                  </div>
                </div>
              </div>

              {/* User Tables by Role */}
              <UserTable
                title="Mahasiswa"
                icon="🎓"
                users={getStudents()}
                colorClass="bg-gradient-to-r from-blue-600 to-blue-700"
              />
              <UserTable
                title="Dosen"
                icon="👨‍🏫"
                users={getDosen()}
                colorClass="bg-gradient-to-r from-green-600 to-green-700"
              />
              <UserTable
                title="Kaprodi / Admin"
                icon="👔"
                users={getKaprodi()}
                colorClass="bg-gradient-to-r from-purple-600 to-purple-700"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Mata Kuliah */}
      {activeTab === "matakuliah" && (
        <div>
          {/* Search & Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari mata kuliah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Mata Kuliah
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <span className="text-blue-100 text-sm font-medium">
                    {course.kode}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">
                    {course.nama}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📘</span>
                      <span>{course.sks} SKS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📅</span>
                      <span>Semester {course.semester}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-slate-600 text-lg">
                Tidak ada mata kuliah yang ditemukan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
