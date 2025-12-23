"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
}

interface Profile {
  id: string;
  username: string;
  role: string;
  jurusan: string;
}

interface KRSPengajuan {
  id: string;
  mahasiswa_id: string;
  semester: string;
  status: "pending" | "approved" | "rejected";
  catatan: string | null;
  total_sks: number;
  created_at: string;
  profiles?: Profile;
  krs_detail?: KRSDetail[];
}

interface KRSDetail {
  id: string;
  krs_pengajuan_id: string;
  matakuliah_id: number;
  matakuliah?: MataKuliah;
}

interface MataKuliahDiambil {
  id: string;
  mahasiswa_id: string;
  matakuliah_id: number;
  semester: string;
}

const CURRENT_SEMESTER = "Ganjil 2025/2026";

export default function KRSPage() {
  const supabase = createClient();

  // State umum
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // State untuk Mahasiswa
  const [allMataKuliah, setAllMataKuliah] = useState<MataKuliah[]>([]);
  const [mataKuliahDiambil, setMataKuliahDiambil] = useState<number[]>([]);
  const [selectedMataKuliah, setSelectedMataKuliah] = useState<number[]>([]);
  const [existingPengajuan, setExistingPengajuan] =
    useState<KRSPengajuan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // State untuk Kaprodi
  const [pengajuanList, setPengajuanList] = useState<KRSPengajuan[]>([]);
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<KRSPengajuan | null>(null);
  const [catatan, setCatatan] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Get role from localStorage
      const userRole = localStorage.getItem("user_role") || "mahasiswa";
      setRole(userRole);

      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        setUserId(user.id);

        if (userRole === "kaprodi") {
          await fetchPengajuanList();
        } else {
          await fetchMahasiswaData(user.id);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  // Fetch data untuk Mahasiswa
  const fetchMahasiswaData = async (mahasiswaId: string) => {
    // 1. Fetch semua mata kuliah
    const { data: mkData } = await supabase
      .from("matakuliah")
      .select("*")
      .order("semester", { ascending: true });

    if (mkData) setAllMataKuliah(mkData);

    // 2. Fetch mata kuliah yang sudah diambil sebelumnya
    const { data: diambilData } = await supabase
      .from("matakuliah_diambil")
      .select("matakuliah_id")
      .eq("mahasiswa_id", mahasiswaId);

    if (diambilData) {
      setMataKuliahDiambil(diambilData.map((d) => d.matakuliah_id));
    }

    // 3. Cek apakah sudah ada pengajuan di semester ini
    const { data: pengajuanData } = await supabase
      .from("krs_pengajuan")
      .select(
        `
        *,
        krs_detail (
          id,
          matakuliah_id,
          matakuliah (*)
        )
      `
      )
      .eq("mahasiswa_id", mahasiswaId)
      .eq("semester", CURRENT_SEMESTER)
      .single();

    if (pengajuanData) {
      setExistingPengajuan(pengajuanData);
      // Set selected dari pengajuan yang ada
      const mkIds =
        pengajuanData.krs_detail?.map((d: KRSDetail) => d.matakuliah_id) || [];
      setSelectedMataKuliah(mkIds);
    }
  };

  // Fetch data untuk Kaprodi
  const fetchPengajuanList = async () => {
    const { data } = await supabase
      .from("krs_pengajuan")
      .select(
        `
        *,
        profiles (id, username, role, jurusan),
        krs_detail (
          id,
          matakuliah_id,
          matakuliah (*)
        )
      `
      )
      .eq("semester", CURRENT_SEMESTER)
      .order("created_at", { ascending: false });

    if (data) setPengajuanList(data);
  };

  // Toggle pilihan mata kuliah
  const toggleMataKuliah = (mkId: number) => {
    if (existingPengajuan?.status === "approved") return; // Tidak bisa edit jika sudah approved

    setSelectedMataKuliah((prev) =>
      prev.includes(mkId) ? prev.filter((id) => id !== mkId) : [...prev, mkId]
    );
  };

  // Hitung total SKS
  const calculateTotalSKS = () => {
    return allMataKuliah
      .filter((mk) => selectedMataKuliah.includes(mk.id))
      .reduce((sum, mk) => sum + mk.sks, 0);
  };

  // Submit pengajuan KRS (Mahasiswa)
  const handleSubmitKRS = async () => {
    if (selectedMataKuliah.length === 0) {
      alert("Pilih minimal satu mata kuliah!");
      return;
    }

    const totalSks = calculateTotalSKS();
    if (totalSks > 24) {
      alert("Total SKS tidak boleh lebih dari 24!");
      return;
    }

    setSubmitting(true);

    try {
      if (existingPengajuan) {
        // Update pengajuan yang ada (jika masih pending atau rejected)
        if (existingPengajuan.status === "approved") {
          alert("Pengajuan sudah disetujui, tidak dapat diubah.");
          return;
        }

        // Hapus detail lama
        await supabase
          .from("krs_detail")
          .delete()
          .eq("krs_pengajuan_id", existingPengajuan.id);

        // Update header
        await supabase
          .from("krs_pengajuan")
          .update({
            status: "pending",
            total_sks: totalSks,
            catatan: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPengajuan.id);

        // Insert detail baru
        const details = selectedMataKuliah.map((mkId) => ({
          krs_pengajuan_id: existingPengajuan.id,
          matakuliah_id: mkId,
        }));

        await supabase.from("krs_detail").insert(details);
      } else {
        // Buat pengajuan baru
        const { data: newPengajuan, error } = await supabase
          .from("krs_pengajuan")
          .insert({
            mahasiswa_id: userId,
            semester: CURRENT_SEMESTER,
            status: "pending",
            total_sks: totalSks,
          })
          .select()
          .single();

        if (error) throw error;

        // Insert detail
        const details = selectedMataKuliah.map((mkId) => ({
          krs_pengajuan_id: newPengajuan.id,
          matakuliah_id: mkId,
        }));

        await supabase.from("krs_detail").insert(details);
      }

      alert("Pengajuan KRS berhasil dikirim!");
      await fetchMahasiswaData(userId);
    } catch (err: any) {
      alert("Gagal mengirim pengajuan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Approve/Reject pengajuan (Kaprodi)
  const handleProcessPengajuan = async (action: "approved" | "rejected") => {
    if (!selectedPengajuan) return;

    setProcessing(true);

    try {
      // Update status pengajuan
      await supabase
        .from("krs_pengajuan")
        .update({
          status: action,
          catatan: catatan || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPengajuan.id);

      // Jika approved, masukkan ke matakuliah_diambil
      if (action === "approved" && selectedPengajuan.krs_detail) {
        const insertData = selectedPengajuan.krs_detail.map((detail) => ({
          mahasiswa_id: selectedPengajuan.mahasiswa_id,
          matakuliah_id: detail.matakuliah_id,
          semester: CURRENT_SEMESTER,
        }));

        await supabase.from("matakuliah_diambil").upsert(insertData, {
          onConflict: "mahasiswa_id,matakuliah_id",
        });
      }

      alert(
        `Pengajuan berhasil ${action === "approved" ? "disetujui" : "ditolak"}!`
      );
      setSelectedPengajuan(null);
      setCatatan("");
      await fetchPengajuanList();
    } catch (err: any) {
      alert("Gagal memproses: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Filter mata kuliah yang belum diambil
  const availableMataKuliah = allMataKuliah.filter(
    (mk) => !mataKuliahDiambil.includes(mk.id)
  );

  // Group by semester
  const groupedMataKuliah = availableMataKuliah.reduce((acc, mk) => {
    if (!acc[mk.semester]) acc[mk.semester] = [];
    acc[mk.semester].push(mk);
    return acc;
  }, {} as Record<number, MataKuliah[]>);

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Persetujuan";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#7a1d38] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ========== TAMPILAN KAPRODI ==========
  if (role === "kaprodi") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Persetujuan KRS
              </h1>
              <p className="text-gray-500">
                {CURRENT_SEMESTER} • Review dan setujui pengajuan KRS mahasiswa
              </p>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-[#7a1d38]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center">
                <span className="text-[#7a1d38]">📊</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Pengajuan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pengajuanList.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <span className="text-amber-600">⏳</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Menunggu</p>
                <p className="text-2xl font-bold text-amber-600">
                  {pengajuanList.filter((p) => p.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">
                  {pengajuanList.filter((p) => p.status === "approved").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <span className="text-red-600">❌</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">
                  {pengajuanList.filter((p) => p.status === "rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar Pengajuan */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#7a1d38] to-[#5c1529] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Daftar Pengajuan KRS
              </h2>
            </div>

            {pengajuanList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📭</span>
                </div>
                <p>Belum ada pengajuan KRS.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pengajuanList.map((pengajuan) => (
                  <div
                    key={pengajuan.id}
                    onClick={() => setSelectedPengajuan(pengajuan)}
                    className={`p-4 hover:bg-[#fdf2f4] cursor-pointer transition-colors ${
                      selectedPengajuan?.id === pengajuan.id
                        ? "bg-[#fdf2f4] border-l-4 border-[#7a1d38]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a1d38] to-[#9e2a4a] flex items-center justify-center text-white font-bold">
                          {pengajuan.profiles?.username
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {pengajuan.profiles?.username || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {pengajuan.profiles?.jurusan || "-"} •{" "}
                            {pengajuan.total_sks} SKS
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          pengajuan.status
                        )}`}
                      >
                        {getStatusText(pengajuan.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Pengajuan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#5c1529] to-[#7a1d38] px-6 py-4">
              <h2 className="text-lg font-bold text-white">Detail Pengajuan</h2>
            </div>

            {selectedPengajuan ? (
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Mahasiswa</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedPengajuan.profiles?.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedPengajuan.profiles?.jurusan}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Mata Kuliah Diajukan
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedPengajuan.krs_detail?.map((detail) => (
                      <div
                        key={detail.id}
                        className="bg-gray-50 p-3 rounded-xl"
                      >
                        <p className="font-medium text-gray-900">
                          {detail.matakuliah?.nama_mk}
                        </p>
                        <p className="text-xs text-gray-500">
                          {detail.matakuliah?.kode_mk} •{" "}
                          {detail.matakuliah?.sks} SKS
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6 p-4 bg-[#fdf2f4] rounded-xl border border-[#f9d0d9]">
                  <p className="text-sm text-[#7a1d38]">Total SKS</p>
                  <p className="text-2xl font-bold text-[#5c1529]">
                    {selectedPengajuan.total_sks} SKS
                  </p>
                </div>

                {selectedPengajuan.status === "pending" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan (Opsional)
                      </label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Tambahkan catatan jika perlu..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProcessPengajuan("approved")}
                        disabled={processing}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {processing ? "Memproses..." : "✓ Setujui"}
                      </button>
                      <button
                        onClick={() => handleProcessPengajuan("rejected")}
                        disabled={processing}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {processing ? "Memproses..." : "✕ Tolak"}
                      </button>
                    </div>
                  </>
                )}

                {selectedPengajuan.status !== "pending" && (
                  <div
                    className={`p-4 rounded-xl ${
                      selectedPengajuan.status === "approved"
                        ? "bg-green-50 border border-green-100"
                        : "bg-red-50 border border-red-100"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        selectedPengajuan.status === "approved"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {selectedPengajuan.status === "approved"
                        ? "✓ Sudah Disetujui"
                        : "✕ Sudah Ditolak"}
                    </p>
                    {selectedPengajuan.catatan && (
                      <p className="text-sm mt-1 text-gray-600">
                        Catatan: {selectedPengajuan.catatan}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👆</span>
                </div>
                <p>Pilih pengajuan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== TAMPILAN MAHASISWA ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📄</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kartu Rencana Studi
            </h1>
            <p className="text-gray-500">{CURRENT_SEMESTER}</p>
          </div>
        </div>
      </header>

      {/* Status Pengajuan */}
      {existingPengajuan && (
        <div
          className={`mb-6 p-5 rounded-2xl border ${
            existingPengajuan.status === "pending"
              ? "bg-amber-50 border-amber-200"
              : existingPengajuan.status === "approved"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Status Pengajuan KRS</p>
              <p className="text-sm text-gray-600">
                {existingPengajuan.status === "pending" &&
                  "Pengajuan Anda sedang menunggu persetujuan Kaprodi."}
                {existingPengajuan.status === "approved" &&
                  "Selamat! Pengajuan KRS Anda telah disetujui."}
                {existingPengajuan.status === "rejected" &&
                  "Pengajuan Anda ditolak. Silakan ajukan ulang."}
              </p>
              {existingPengajuan.catatan && (
                <p className="text-sm mt-1">
                  <strong>Catatan:</strong> {existingPengajuan.catatan}
                </p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full font-semibold ${getStatusBadge(
                existingPengajuan.status
              )}`}
            >
              {getStatusText(existingPengajuan.status)}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar Mata Kuliah */}
        <div className="lg:col-span-2 space-y-6">
          {Object.keys(groupedMataKuliah).length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-[#fdf2f4] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-gray-600 text-lg">
                Semua mata kuliah sudah pernah diambil!
              </p>
            </div>
          ) : (
            Object.entries(groupedMataKuliah)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([semester, mkList]) => (
                <div
                  key={semester}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] px-6 py-4">
                    <h2 className="text-lg font-bold text-white">
                      Semester {semester}
                    </h2>
                    <p className="text-white/70 text-sm">
                      {mkList.length} mata kuliah tersedia
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {mkList.map((mk) => {
                      const isSelected = selectedMataKuliah.includes(mk.id);
                      const isDisabled =
                        existingPengajuan?.status === "approved";

                      return (
                        <div
                          key={mk.id}
                          onClick={() => !isDisabled && toggleMataKuliah(mk.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#7a1d38] bg-[#fdf2f4]"
                              : "border-gray-200 hover:border-[#7a1d38]/40"
                          } ${
                            isDisabled ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? "border-[#7a1d38] bg-[#7a1d38] text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {mk.nama_mk}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {mk.kode_mk}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-[#fdf2f4] text-[#7a1d38] rounded-full text-sm font-medium">
                              {mk.sks} SKS
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Sidebar Ringkasan */}
        <div className="space-y-6">
          {/* Mata Kuliah Dipilih */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
            <div className="bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Mata Kuliah Dipilih
              </h2>
              <p className="text-white/80 text-sm">
                {selectedMataKuliah.length} mata kuliah
              </p>
            </div>

            <div className="p-4">
              {selectedMataKuliah.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Belum ada yang dipilih
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {allMataKuliah
                    .filter((mk) => selectedMataKuliah.includes(mk.id))
                    .map((mk) => (
                      <div
                        key={mk.id}
                        className="flex items-center justify-between p-2 bg-[#fdf2f4] rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {mk.nama_mk}
                          </p>
                          <p className="text-xs text-gray-500">{mk.kode_mk}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#7a1d38]">
                          {mk.sks} SKS
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Total SKS */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-700">Total SKS</span>
                  <span
                    className={`text-2xl font-bold ${
                      calculateTotalSKS() > 24
                        ? "text-red-600"
                        : "text-[#7a1d38]"
                    }`}
                  >
                    {calculateTotalSKS()} / 24
                  </span>
                </div>

                {calculateTotalSKS() > 24 && (
                  <p className="text-sm text-red-600 mb-4">
                    ⚠️ Total SKS melebihi batas maksimal!
                  </p>
                )}

                {existingPengajuan?.status !== "approved" && (
                  <button
                    onClick={handleSubmitKRS}
                    disabled={
                      submitting ||
                      selectedMataKuliah.length === 0 ||
                      calculateTotalSKS() > 24
                    }
                    className="w-full bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white py-3 rounded-xl font-bold hover:from-[#5c1529] hover:to-[#7a1d38] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    {submitting
                      ? "Mengirim..."
                      : existingPengajuan
                      ? "Perbarui Pengajuan"
                      : "Ajukan KRS"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#fdf2f4] rounded-xl p-4 border border-[#f9d0d9]">
            <h3 className="font-bold text-[#7a1d38] mb-2">ℹ️ Informasi</h3>
            <ul className="text-sm text-[#5c1529] space-y-1">
              <li>• Maksimal pengambilan 24 SKS per semester</li>
              <li>• Mata kuliah yang sudah diambil tidak ditampilkan</li>
              <li>• Pengajuan harus disetujui oleh Kaprodi</li>
              <li>• Anda dapat mengubah pengajuan selama belum disetujui</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
