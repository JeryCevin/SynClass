"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function SettingsPage() {
  // State untuk Tab Aktif (hanya 2 tab: Manage User, Mata Kuliah)
  const [activeTab, setActiveTab] = useState("manageUser");

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // (notifikasi UI removed)

  useEffect(() => {
    const supabase = createClient();
    const fetchProfileAndCourses = async () => {
      setLoadingCourses(true);
      try {
        // only fetch courses for Mata Kuliah tab
        const candidates = ["matakuliah", "mata_kuliah", "courses", "classes", "enrollments"];
        let found: any = null;
        for (const t of candidates) {
          try {
            const res = await supabase.from(t).select("*");
            if (!res.error && res.data && (res.data as any[]).length > 0) { found = res.data; break; }
          } catch {
            // ignore
          }
        }
        if (found) setCourses(found as any[]);
      } catch (err: any) {
        setCoursesError(err?.message || "Gagal mengambil data mata kuliah.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchProfileAndCourses();

    // Fetch all users for Manage User table (try common table names)
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const tables = ["profiles", "profile"];
        let all: any[] | null = null;
        for (const t of tables) {
          try {
            const res = await supabase.from(t).select("*");
            if (!res.error && res.data && (res.data as any[]).length > 0) { all = res.data as any[]; break; }
          } catch (e) { /* ignore */ }
        }
        if (!all) {
          setUsers([]);
          setUsersError("Tidak dapat mengambil daftar user (cek RLS / nama tabel).");
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

  // password/account UI removed — manage user table will be used instead

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h1>

      {/* --- MENU TAB (Manage User | Mata Kuliah) --- */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("manageUser")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "manageUser"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Manage User
        </button>
        <button
          onClick={() => setActiveTab("matakuliah")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "matakuliah"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Mata Kuliah
        </button>
      </div>

      {/* --- KONTEN TAB: MANAGE USER --- */}
      {activeTab === "manageUser" && (
        <div className="max-w-xl">
          {/* Manage User Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Manage User</h3>
            {loadingUsers ? (
              <p className="text-gray-500">Memuat daftar pengguna...</p>
            ) : usersError ? (
              <p className="text-red-600">{usersError}</p>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-sm font-medium">Nama</th>
                      <th className="px-4 py-2 text-sm font-medium">Email</th>
                      <th className="px-4 py-2 text-sm font-medium">Role</th>
                      <th className="px-4 py-2 text-sm font-medium">Status</th>
                      <th className="px-4 py-2 text-sm font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id ?? idx} className="border-t">
                        <td className="px-4 py-3">{u.nama ?? u.name ?? u.full_name ?? u.username ?? '-'}</td>
                        <td className="px-4 py-3">{u.email ?? '-'}</td>
                        <td className="px-4 py-3">{u.role ?? u.user_role ?? '-'}</td>
                        <td className="px-4 py-3">{(u.status ?? u.active ?? u.is_active) ? 'Active' : 'Inactive'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                            <button className="text-sm px-3 py-1 bg-red-600 text-white rounded">Toggle</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada pengguna.</p>
            )}
          </div>
        </div>
      )}

      {/* --- KONTEN TAB lainnya dihapus; Mata Kuliah dipindah ke tab khusus di bawah --- */}
      
      {/* --- KONTEN TAB: MATA KULIAH --- */}
      {activeTab === "matakuliah" && (
        <div className="max-w-2xl">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Mata Kuliah Terdaftar</h3>
            {loadingCourses ? (
              <p className="text-gray-500">Memuat mata kuliah...</p>
            ) : coursesError ? (
              <p className="text-red-600">{coursesError}</p>
            ) : courses && courses.length > 0 ? (
              <ul className="space-y-2">
                {courses.map((c, i) => (
                  <li key={i} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="font-bold">{c.name ?? c.nama ?? c.title ?? c.kode ?? 'Mata Kuliah'}</div>
                    <div className="text-sm text-gray-500">{c.code ?? c.kode ?? c.kd ?? ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Belum ada mata kuliah terdaftar.</p>
            )}
          </div>
        </div>
      )}

      {/* (Mata Kuliah ditampilkan di tab 'Mata Kuliah') */}
    </div>
  );
}