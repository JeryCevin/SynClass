"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

interface MataKuliah {
  id?: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  dosen_id?: string | null;
  profiles?: {
    id: string;
    username: string;
    role: string;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("manageUser");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mata Kuliah state
  const [courses, setCourses] = useState<MataKuliah[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Add/Edit Mata Kuliah modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<MataKuliah | null>(null);
  const [courseForm, setCourseForm] = useState<MataKuliah>({
    kode_mk: "",
    nama_mk: "",
    sks: 3,
    semester: 1,
    dosen_id: null,
  });

  // Dosen list untuk dropdown pengampu
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseFormError, setCourseFormError] = useState<string | null>(null);

  const supabase = createClient();
  const [profilesTableName, setProfilesTableName] = useState<string | null>(
    null
  );

  // Fetch Mata Kuliah from Supabase
  const fetchCourses = async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const { data, error } = await supabase
        .from("matakuliah")
        .select(
          `
          *,
          profiles:dosen_id (id, username, role)
        `
        )
        .order("semester", { ascending: true })
        .order("kode_mk", { ascending: true });

      if (error) {
        console.error("Error fetching courses:", error);
        setCoursesError(error.message);
      } else {
        setCourses(data || []);
      }
    } catch (err: any) {
      setCoursesError(err?.message || "Gagal mengambil data mata kuliah.");
    } finally {
      setLoadingCourses(false);
    }
  };

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
            setProfilesTableName(t);
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

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // Update dosen list when users change (include kaprodi as eligible pengampu)
  useEffect(() => {
    const pengampu = users.filter((u) => {
      const role = (u.role ?? u.user_role)?.toLowerCase();
      return role === "dosen" || role === "lecturer" || role === "kaprodi";
    });
    setDosenList(pengampu);
  }, [users]);

  // CRUD Mata Kuliah
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      kode_mk: "",
      nama_mk: "",
      sks: 3,
      semester: 1,
      dosen_id: null,
    });
    setCourseFormError(null);
    setShowCourseModal(true);
  };

  const openEditCourse = (course: MataKuliah) => {
    setEditingCourse(course);
    setCourseForm({
      kode_mk: course.kode_mk,
      nama_mk: course.nama_mk,
      sks: course.sks,
      semester: course.semester,
      dosen_id: course.dosen_id || null,
    });
    setCourseFormError(null);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.kode_mk.trim() || !courseForm.nama_mk.trim()) {
      setCourseFormError("Kode MK dan Nama MK wajib diisi.");
      return;
    }

    setSavingCourse(true);
    setCourseFormError(null);

    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from("matakuliah")
          .update({
            kode_mk: courseForm.kode_mk.trim(),
            nama_mk: courseForm.nama_mk.trim(),
            sks: courseForm.sks,
            semester: courseForm.semester,
            dosen_id: courseForm.dosen_id || null,
          })
          .eq("id", editingCourse.id);

        if (error) {
          setCourseFormError(error.message);
          return;
        }
      } else {
        // Insert new course
        const { error } = await supabase.from("matakuliah").insert([
          {
            kode_mk: courseForm.kode_mk.trim(),
            nama_mk: courseForm.nama_mk.trim(),
            sks: courseForm.sks,
            semester: courseForm.semester,
            dosen_id: courseForm.dosen_id || null,
          },
        ]);

        if (error) {
          setCourseFormError(error.message);
          return;
        }
      }

      setShowCourseModal(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (err: any) {
      setCourseFormError(err?.message || "Gagal menyimpan mata kuliah.");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (course: MataKuliah) => {
    if (!course.id) return;

    const ok = confirm(`Hapus mata kuliah "${course.nama_mk}"?`);
    if (!ok) return;

    try {
      const { error } = await supabase
        .from("matakuliah")
        .delete()
        .eq("id", course.id);

      if (error) {
        alert("Gagal menghapus: " + error.message);
      } else {
        await fetchCourses();
      }
    } catch (err: any) {
      alert("Gagal menghapus: " + err?.message);
    }
  };

  // Group courses by semester
  const coursesBySemester = courses.reduce((acc, course) => {
    const sem = course.semester;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(course);
    return acc;
  }, {} as Record<number, MataKuliah[]>);

  const sortedSemesters = Object.keys(coursesBySemester)
    .map(Number)
    .sort((a, b) => a - b);

  // Filter courses by search
  const filterCourses = (courseList: MataKuliah[]) =>
    courseList.filter(
      (c) =>
        c.nama_mk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.kode_mk.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const hasFilteredResults = sortedSemesters.some(
    (sem) => filterCourses(coursesBySemester[sem]).length > 0
  );

  // Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("student");
  const [newNim, setNewNim] = useState("");
  const [newProgramStudi, setNewProgramStudi] = useState("");
  const [newFakultas, setNewFakultas] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // Edit user state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("student");
  const [editNim, setEditNim] = useState("");
  const [editProgramStudi, setEditProgramStudi] = useState("");
  const [editFakultas, setEditFakultas] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [deletingId, setDeletingId] = useState<any>(null);

  const openAddForRole = (role: string) => {
    setNewRole(role);
    setShowAddModal(true);
  };

  const handleCreateUser = async () => {
    setCreatingUser(true);
    setCreateError(null);
    try {
      const payload: any = {
        role: newRole,
      };
      if (newEmail.trim()) payload.email = newEmail.trim();
      if (newUsername.trim()) payload.username = newUsername.trim();
      if (newProgramStudi.trim()) payload.jurusan = newProgramStudi.trim();
      if (newFakultas.trim()) payload.fakultas = newFakultas.trim();
      if (newNim.trim()) {
        const idKey =
          newRole === "dosen" || newRole === "kaprodi" ? "nidn" : "nomor_induk";
        payload[idKey] = newNim.trim();
      }

      const table = profilesTableName ?? "profiles";
      const res = await supabase.from(table).insert([payload]).select("*");
      if (res.error) {
        const err = res.error as any;
        console.error(`Gagal membuat user di '${table}':`, {
          status: (res as any).status,
          statusText: (res as any).statusText,
          errorMessage: err?.message,
          error: err,
          data: res.data,
        });
        const msg =
          err?.message ?? JSON.stringify(err) ?? "Gagal membuat user.";
        setCreateError(msg);
      } else {
        setShowAddModal(false);
        setNewEmail("");
        setNewUsername("");
        setNewRole("student");
        setNewNim("");
        setNewProgramStudi("");
        setNewFakultas("");
        setCreateError(null);
        await fetchUsers();
      }
    } catch (err: any) {
      console.error("Unexpected error saat membuat user:", err);
      const msg = err?.message ?? JSON.stringify(err);
      setCreateError(msg);
    } finally {
      setCreatingUser(false);
    }
  };

  const openEditForUser = (u: any) => {
    const id = u.id ?? u.user_id ?? u.uuid ?? null;
    if (!id) {
      alert("Tidak dapat mengedit: id user tidak ditemukan.");
      return;
    }
    setEditId(id);
    setEditEmail(u.email ?? u.user_email ?? "");
    setEditUsername(u.username ?? "");
    setEditRole(u.role ?? u.user_role ?? "student");
    setEditNim(resolveIdForRole(u));
    setEditProgramStudi(u.jurusan ?? u.program_studi ?? u.prodi ?? "");
    setEditFakultas(u.fakultas ?? u.faculty ?? u.department ?? "");
    setShowEditModal(true);
  };

  const handleEditUser = async () => {
    if (!editId) return;
    setEditingUser(true);
    try {
      const payload: any = {
        role: editRole,
      };
      if (editEmail.trim()) payload.email = editEmail.trim();
      if (editUsername.trim()) payload.username = editUsername.trim();
      if (editProgramStudi.trim()) payload.jurusan = editProgramStudi.trim();
      if (editFakultas.trim()) payload.fakultas = editFakultas.trim();
      if (editNim.trim()) {
        const idKey =
          editRole === "dosen" || editRole === "kaprodi"
            ? "nidn"
            : "nomor_induk";
        payload[idKey] = editNim.trim();
      }

      const table = profilesTableName ?? "profiles";
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", editId)
        .select();
      if (error) {
        console.error(`Gagal mengupdate user di '${table}':`, error);
        alert("Gagal mengupdate user: " + error.message);
      } else {
        setShowEditModal(false);
        setEditId(null);
        await fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingUser(false);
    }
  };

  const handleDeleteUser = async (u: any) => {
    const id = u.id ?? u.user_id ?? u.uuid ?? null;
    if (!id) {
      alert("Tidak dapat menghapus: id user tidak ditemukan.");
      return;
    }
    const ok = confirm(
      `Hapus pengguna ${u.full_name ?? u.name ?? u.username ?? id}?`
    );
    if (!ok) return;
    setDeletingId(id);
    try {
      const table = profilesTableName ?? "profiles";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        console.error(`Gagal menghapus user di '${table}':`, error);
        alert("Gagal menghapus user: " + error.message);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

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

  // Semester color styling
  const getSemesterColor = (semester: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600",
    ];
    return colors[(semester - 1) % colors.length];
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

    // fallback to username/name/full_name
    return u?.full_name ?? u?.name ?? u?.username ?? "-";
  };

  const resolveNim = (u: any) => {
    if (!u) return "-";
    // prefer NIM for students, but if user role is dosen/kaprodi prefer NIDN
    const role = (u.role ?? u.user_role ?? "").toString().toLowerCase();
    const nidnCandidates = ["nidn", "nidn_number", "nomor_dosen", "nidn_id"];
    const nimCandidates = ["nomor_induk", "nim", "nim_user", "student_id"];
    if (
      role === "dosen" ||
      role === "kaprodi" ||
      role === "lecturer" ||
      role === "admin"
    ) {
      for (const k of nidnCandidates) if (u[k]) return u[k];
      for (const k of nimCandidates) if (u[k]) return u[k];
    }
    for (const k of nimCandidates) if (u[k]) return u[k];
    for (const k of nidnCandidates) if (u[k]) return u[k];
    return "-";
  };

  // Resolve identifier (nim for students, nidn for dosen/kaprodi) from a user object.
  const resolveIdForRole = (u: any, roleOverride?: string) => {
    if (!u) return "";
    const role = (roleOverride ?? u.role ?? u.user_role ?? "")
      .toString()
      .toLowerCase();
    const nidnCandidates = ["nidn", "nidn_number", "nomor_dosen", "nidn_id"];
    const nimCandidates = ["nomor_induk", "nim", "nim_user", "student_id"];
    if (
      role === "dosen" ||
      role === "kaprodi" ||
      role === "lecturer" ||
      role === "admin"
    ) {
      for (const k of nidnCandidates) if (u[k]) return u[k];
      for (const k of nimCandidates) if (u[k]) return u[k];
    } else {
      for (const k of nimCandidates) if (u[k]) return u[k];
      for (const k of nidnCandidates) if (u[k]) return u[k];
    }
    return "";
  };

  const resolveFakultas = (u: any) => {
    if (!u) return "-";
    return u.fakultas ?? u.faculty ?? u.department ?? u.unit ?? u.kampus ?? "-";
  };

  const resolveProdi = (u: any) => {
    if (!u) return "-";
    return (
      u.jurusan ??
      u.program_studi ??
      u.prodi ??
      u.major ??
      u.study_program ??
      "-"
    );
  };

  // User Table Component
  const UserTable = ({
    title,
    icon,
    users,
    colorClass,
    onAdd,
  }: {
    title: string;
    icon: string;
    users: any[];
    colorClass: string;
    onAdd?: () => void;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div
        className={`px-6 py-4 ${colorClass} flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/80">
              {users.length} pengguna terdaftar
            </p>
          </div>
        </div>
        {onAdd && (
          <div>
            <button
              onClick={onAdd}
              className="px-3 py-1 bg-white/90 text-slate-800 rounded-md text-sm font-medium hover:bg-white"
            >
              + Tambah
            </button>
          </div>
        )}
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
                  NIM / NIDN
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Fakultas
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Program Studi
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
                        {(
                          (u.full_name ?? u.name ?? u.username ?? "?") as string
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">
                        {u.full_name ?? u.name ?? u.username ?? "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{resolveNim(u)}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {resolveFakultas(u)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {resolveProdi(u)}
                  </td>
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
                        onClick={() => openEditForUser(u)}
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
                        onClick={() => handleDeleteUser(u)}
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
                onAdd={() => openAddForRole("student")}
                colorClass="bg-gradient-to-r from-blue-600 to-blue-700"
              />
              <UserTable
                title="Dosen"
                icon="👨‍🏫"
                users={getDosen()}
                onAdd={() => openAddForRole("dosen")}
                colorClass="bg-gradient-to-r from-green-600 to-green-700"
              />
              <UserTable
                title="Kaprodi / Admin"
                icon="👔"
                users={getKaprodi()}
                onAdd={() => openAddForRole("kaprodi")}
                colorClass="bg-gradient-to-r from-purple-600 to-purple-700"
              />
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-4">Tambah Pengguna</h3>
            <div className="grid grid-cols-1 gap-3">
              {createError && (
                <div className="text-sm text-red-600 p-2 rounded bg-red-50">
                  {createError}
                </div>
              )}
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Username (opsional)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={newNim}
                onChange={(e) => setNewNim(e.target.value)}
                placeholder="Nomor Induk / NIM / NIDN (opsional)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={newProgramStudi}
                onChange={(e) => setNewProgramStudi(e.target.value)}
                placeholder="Program Studi (jurusan)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={newFakultas}
                onChange={(e) => setNewFakultas(e.target.value)}
                placeholder="Fakultas"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="student">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="kaprodi">Kaprodi / Admin</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Batal
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creatingUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {creatingUser ? "Membuat..." : "Buat Pengguna"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-4">Edit Pengguna</h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Username (opsional)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={editNim}
                onChange={(e) => setEditNim(e.target.value)}
                placeholder="Nomor Induk / NIM / NIDN (opsional)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={editProgramStudi}
                onChange={(e) => setEditProgramStudi(e.target.value)}
                placeholder="Program Studi (jurusan)"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <input
                value={editFakultas}
                onChange={(e) => setEditFakultas(e.target.value)}
                placeholder="Fakultas"
                className="w-full px-4 py-3 rounded-lg border"
              />
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="student">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="kaprodi">Kaprodi / Admin</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Batal
              </button>
              <button
                onClick={handleEditUser}
                disabled={editingUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {editingUser ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
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
            <button
              onClick={openAddCourse}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
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

          {/* Loading State */}
          {loadingCourses && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat data mata kuliah...</p>
            </div>
          )}

          {/* Error State */}
          {!loadingCourses && coursesError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              <span className="text-2xl mr-2">⚠️</span>
              {coursesError}
            </div>
          )}

          {/* Courses Grouped by Semester */}
          {!loadingCourses && !coursesError && (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                  <p className="text-slate-500 text-sm">Total Mata Kuliah</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {courses.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                  <p className="text-slate-500 text-sm">Total SKS</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {courses.reduce((sum, c) => sum + c.sks, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                  <p className="text-slate-500 text-sm">Jumlah Semester</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sortedSemesters.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                  <p className="text-slate-500 text-sm">
                    Rata-rata SKS/Semester
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sortedSemesters.length > 0
                      ? Math.round(
                          courses.reduce((sum, c) => sum + c.sks, 0) /
                            sortedSemesters.length
                        )
                      : 0}
                  </p>
                </div>
              </div>

              {/* Grouped by Semester */}
              {sortedSemesters.map((semester) => {
                const semesterCourses = filterCourses(
                  coursesBySemester[semester]
                );
                if (semesterCourses.length === 0) return null;

                const totalSks = semesterCourses.reduce(
                  (sum, c) => sum + c.sks,
                  0
                );

                return (
                  <div
                    key={semester}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Semester Header */}
                    <div
                      className={`bg-gradient-to-r ${getSemesterColor(
                        semester
                      )} px-6 py-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                              {semester}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Semester {semester}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {semesterCourses.length} Mata Kuliah • {totalSks}{" "}
                              SKS
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Cards Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {semesterCourses.map((course) => (
                          <div
                            key={course.id ?? course.kode_mk}
                            className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                                {course.kode_mk}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => openEditCourse(course)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <svg
                                    className="h-4 w-4"
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
                                  onClick={() => handleDeleteCourse(course)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <svg
                                    className="h-4 w-4"
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
                            <h4 className="font-semibold text-slate-900 mb-2">
                              {course.nama_mk}
                            </h4>
                            <div className="flex flex-col gap-1.5 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <span>📘</span> {course.sks} SKS
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <span>👤</span>
                                {course.profiles?.username ? (
                                  course.profiles.username
                                ) : (
                                  <span className="italic text-slate-400">
                                    Belum ada pengampu
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty State */}
              {!hasFilteredResults && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <span className="text-6xl mb-4 block">
                    {searchQuery ? "🔍" : "📚"}
                  </span>
                  <p className="text-slate-600 text-lg">
                    {searchQuery
                      ? "Tidak ada mata kuliah yang ditemukan."
                      : "Belum ada mata kuliah. Klik 'Tambah Mata Kuliah' untuk menambahkan."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Mata Kuliah Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingCourse ? "Edit Mata Kuliah" : "Tambah Mata Kuliah Baru"}
            </h3>

            {courseFormError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {courseFormError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kode Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseForm.kode_mk}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, kode_mk: e.target.value })
                  }
                  placeholder="Contoh: IF101"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseForm.nama_mk}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, nama_mk: e.target.value })
                  }
                  placeholder="Contoh: Algoritma dan Pemrograman"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SKS <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={courseForm.sks}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        sks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} SKS
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={courseForm.semester}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        semester: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        Semester {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dosen Pengampu
                </label>
                <select
                  value={courseForm.dosen_id || ""}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      dosen_id: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  {dosenList.map((dosen) => (
                    <option key={dosen.id} value={dosen.id}>
                      {dosen.username ||
                        dosen.email ||
                        `Dosen ${dosen.id.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih dosen yang akan mengampu mata kuliah ini
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCourseModal(false);
                  setEditingCourse(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCourse}
                disabled={savingCourse}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {savingCourse ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Menyimpan...
                  </>
                ) : editingCourse ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Mata Kuliah"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
