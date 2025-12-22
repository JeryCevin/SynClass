"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

// Interface definitions
interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
}

interface Kelas {
  id: string;
  matakuliah_id: number;
  dosen_id: string;
  semester: string;
  hari: string;
  jam: string;
  ruangan: string;
  matakuliah?: MataKuliah;
}

interface KelasMahasiswa {
  id: string;
  kelas_id: string;
  mahasiswa_id: string;
  nilai_huruf: string | null;
  nilai_angka: number | null;
  kelas?: Kelas & { matakuliah: MataKuliah };
  profiles?: { id: string; username: string; jurusan: string };
  _originalId?: number | string; // Original ID from database
}

interface GradeOption {
  huruf: string;
  angka: number;
  label: string;
}

// Grade options sesuai standar akademik
const GRADE_OPTIONS: GradeOption[] = [
  { huruf: "A", angka: 4.0, label: "A (4.00)" },
  { huruf: "A-", angka: 3.7, label: "A- (3.70)" },
  { huruf: "B+", angka: 3.3, label: "B+ (3.30)" },
  { huruf: "B", angka: 3.0, label: "B (3.00)" },
  { huruf: "B-", angka: 2.7, label: "B- (2.70)" },
  { huruf: "C+", angka: 2.3, label: "C+ (2.30)" },
  { huruf: "C", angka: 2.0, label: "C (2.00)" },
  { huruf: "D", angka: 1.0, label: "D (1.00)" },
  { huruf: "E", angka: 0.0, label: "E (0.00)" },
];

const getGradeColor = (nilai: string | null) => {
  if (!nilai) return "bg-gray-100 text-gray-600";
  switch (nilai) {
    case "A":
    case "A-":
      return "bg-green-100 text-green-800";
    case "B+":
    case "B":
    case "B-":
      return "bg-blue-100 text-blue-800";
    case "C+":
    case "C":
      return "bg-yellow-100 text-yellow-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    case "E":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function KHSPage() {
  const supabase = createClient();

  // State umum
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // State untuk Mahasiswa
  const [grades, setGrades] = useState<KelasMahasiswa[]>([]);

  // State untuk Dosen
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [mahasiswaList, setMahasiswaList] = useState<KelasMahasiswa[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const userRole = localStorage.getItem("user_role") || "mahasiswa";
      setRole(userRole);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        setUserId(user.id);

        if (userRole === "dosen" || userRole === "kaprodi") {
          await fetchDosenKelas(user.id);
        } else {
          await fetchMahasiswaGrades(user.id);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  // Fetch nilai untuk Mahasiswa
  const fetchMahasiswaGrades = async (mahasiswaId: string) => {
    const { data, error } = await supabase
      .from("kelas_mahasiswa")
      .select(
        `
        *,
        kelas (
          *,
          matakuliah (*)
        )
      `
      )
      .eq("mahasiswa_id", mahasiswaId)
      .order("created_at", { ascending: false });

    if (data) setGrades(data);
    if (error) console.error("Error fetching grades:", error);
  };

  // Fetch kelas/matakuliah untuk Dosen (dari tabel matakuliah berdasarkan dosen_id)
  const fetchDosenKelas = async (dosenId: string) => {
    const { data, error } = await supabase
      .from("matakuliah")
      .select("*")
      .eq("dosen_id", dosenId)
      .order("semester", { ascending: true });

    if (data) {
      // Transform matakuliah to Kelas format for compatibility
      const kelasData: Kelas[] = data.map((mk) => ({
        id: mk.id.toString(),
        matakuliah_id: mk.id,
        dosen_id: dosenId,
        semester: `Semester ${mk.semester}`,
        hari: "-",
        jam: "-",
        ruangan: "-",
        matakuliah: mk,
      }));
      setKelasList(kelasData);
    }
    if (error) console.error("Error fetching matakuliah:", error);
  };

  // Fetch mahasiswa yang mengambil mata kuliah ini (dari krs_detail yang approved)
  const fetchKelasMahasiswa = async (kelasId: string) => {
    // kelasId di sini adalah matakuliah_id (karena kita transform dari matakuliah)
    const matakuliahId = parseInt(kelasId);

    try {
      // Step 1: Get all krs_detail for this matakuliah
      const { data: krsDetails, error: krsError } = await supabase
        .from("krs_detail")
        .select(
          `
          id,
          matakuliah_id,
          nilai_huruf,
          nilai_angka,
          krs_pengajuan_id
        `
        )
        .eq("matakuliah_id", matakuliahId);

      if (krsError) throw krsError;
      if (!krsDetails || krsDetails.length === 0) {
        setMahasiswaList([]);
        return;
      }

      // Step 2: Get the krs_pengajuan to filter by approved status
      const pengajuanIds = [
        ...new Set(krsDetails.map((d) => d.krs_pengajuan_id)),
      ];
      const { data: pengajuanData, error: pengajuanError } = await supabase
        .from("krs_pengajuan")
        .select("id, mahasiswa_id, status")
        .in("id", pengajuanIds)
        .eq("status", "approved");

      if (pengajuanError) throw pengajuanError;
      if (!pengajuanData || pengajuanData.length === 0) {
        setMahasiswaList([]);
        return;
      }

      // Step 3: Get mahasiswa profiles
      const mahasiswaIds = pengajuanData.map((p) => p.mahasiswa_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, jurusan")
        .in("id", mahasiswaIds);

      if (profilesError) throw profilesError;

      // Step 4: Combine the data
      const approvedPengajuanMap = new Map(pengajuanData.map((p) => [p.id, p]));
      const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

      const mahasiswaData: KelasMahasiswa[] = krsDetails
        .filter((detail) => approvedPengajuanMap.has(detail.krs_pengajuan_id))
        .map((detail) => {
          const pengajuan = approvedPengajuanMap.get(detail.krs_pengajuan_id);
          const profile = profilesMap.get(pengajuan?.mahasiswa_id || "");
          return {
            id: String(detail.id), // Keep original ID format as string
            kelas_id: kelasId,
            mahasiswa_id: pengajuan?.mahasiswa_id || "",
            nilai_huruf: detail.nilai_huruf,
            nilai_angka: detail.nilai_angka,
            profiles: profile || { id: "", username: "Unknown", jurusan: "-" },
            _originalId: detail.id, // Store original ID for update
          };
        });

      setMahasiswaList(mahasiswaData);
    } catch (err) {
      console.error("Error fetching mahasiswa:", err);
      setMahasiswaList([]);
    }
  };

  // Select kelas (Dosen)
  const handleSelectKelas = async (kelas: Kelas) => {
    setSelectedKelas(kelas);
    await fetchKelasMahasiswa(kelas.id);
  };

  // Update nilai mahasiswa (Dosen) - update di krs_detail
  const handleUpdateNilai = async (
    kelasMahasiswaId: string,
    gradeOption: GradeOption | null,
    originalId?: number | string
  ) => {
    setSavingId(kelasMahasiswaId);

    try {
      // Gunakan originalId jika tersedia, atau parse dari kelasMahasiswaId
      const idToUpdate = originalId ?? parseInt(kelasMahasiswaId);

      // Update di krs_detail
      const { error } = await supabase
        .from("krs_detail")
        .update({
          nilai_huruf: gradeOption?.huruf || null,
          nilai_angka: gradeOption?.angka || null,
        })
        .eq("id", idToUpdate);
      // Update local state
      setMahasiswaList((prev) =>
        prev.map((m) =>
          m.id === kelasMahasiswaId
            ? {
                ...m,
                nilai_huruf: gradeOption?.huruf || null,
                nilai_angka: gradeOption?.angka || null,
              }
            : m
        )
      );
    } catch (err: any) {
      alert("Gagal menyimpan nilai: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  // Hitung statistik mahasiswa
  const calculateStats = () => {
    const gradesWithNilai = grades.filter((g) => g.nilai_angka !== null);
    const totalSks = gradesWithNilai.reduce(
      (sum, g) => sum + (g.kelas?.matakuliah?.sks || 0),
      0
    );
    const totalMutu = gradesWithNilai.reduce(
      (sum, g) => sum + (g.nilai_angka || 0) * (g.kelas?.matakuliah?.sks || 0),
      0
    );
    const ipk = totalSks > 0 ? totalMutu / totalSks : 0;
    return { totalSks, ipk, totalMK: gradesWithNilai.length };
  };

  // Group grades by semester
  const groupedGrades = grades.reduce((acc, grade) => {
    const sem = grade.kelas?.semester || "Unknown";
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(grade);
    return acc;
  }, {} as Record<string, KelasMahasiswa[]>);

  // Calculate semester stats
  const calculateSemesterStats = (semGrades: KelasMahasiswa[]) => {
    const gradesWithNilai = semGrades.filter((g) => g.nilai_angka !== null);
    const totalSks = gradesWithNilai.reduce(
      (sum, g) => sum + (g.kelas?.matakuliah?.sks || 0),
      0
    );
    const totalMutu = gradesWithNilai.reduce(
      (sum, g) => sum + (g.nilai_angka || 0) * (g.kelas?.matakuliah?.sks || 0),
      0
    );
    const ips = totalSks > 0 ? totalMutu / totalSks : 0;
    return { totalSks, ips };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ========== TAMPILAN DOSEN ==========
  if (role === "dosen" || role === "kaprodi") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📝 Input Nilai Mahasiswa
          </h1>
          <p className="text-slate-600 text-lg">
            Kelola nilai mahasiswa di kelas yang Anda ampu
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar Kelas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Kelas Saya</h2>
              <p className="text-indigo-100 text-sm">
                {kelasList.length} kelas
              </p>
            </div>

            {kelasList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="text-4xl block mb-2">📭</span>
                <p>Belum ada kelas yang diampu.</p>
              </div>
            ) : (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {kelasList.map((kelas) => (
                  <div
                    key={kelas.id}
                    onClick={() => handleSelectKelas(kelas)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedKelas?.id === kelas.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <p className="font-semibold text-slate-900">
                      {kelas.matakuliah?.nama_mk}
                    </p>
                    <p className="text-sm text-slate-500">
                      {kelas.matakuliah?.kode_mk} • {kelas.matakuliah?.sks} SKS
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {kelas.semester}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daftar Mahasiswa & Input Nilai */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                {selectedKelas
                  ? selectedKelas.matakuliah?.nama_mk
                  : "Pilih Kelas"}
              </h2>
              {selectedKelas && (
                <p className="text-green-100 text-sm">
                  {selectedKelas.hari} {selectedKelas.jam} •{" "}
                  {selectedKelas.ruangan}
                </p>
              )}
            </div>

            {!selectedKelas ? (
              <div className="p-12 text-center text-slate-500">
                <span className="text-5xl block mb-4">👈</span>
                <p>Pilih kelas dari daftar di sebelah kiri</p>
              </div>
            ) : mahasiswaList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <span className="text-5xl block mb-4">👥</span>
                <p>Belum ada mahasiswa terdaftar di kelas ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Nama Mahasiswa
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Jurusan
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        Nilai
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        Angka
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mahasiswaList.map((mhs, idx) => (
                      <tr key={mhs.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-600">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {mhs.profiles?.username
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-slate-900">
                              {mhs.profiles?.username || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {mhs.profiles?.jurusan || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <select
                              value={mhs.nilai_huruf || ""}
                              onChange={(e) => {
                                const selected = GRADE_OPTIONS.find(
                                  (g) => g.huruf === e.target.value
                                );
                                handleUpdateNilai(
                                  mhs.id,
                                  selected || null,
                                  mhs._originalId
                                );
                              }}
                              disabled={savingId === mhs.id}
                              className={`px-4 py-2 rounded-lg border font-semibold text-center min-w-[100px] ${getGradeColor(
                                mhs.nilai_huruf
                              )} ${savingId === mhs.id ? "opacity-50" : ""}`}
                            >
                              <option value="">-- Pilih --</option>
                              {GRADE_OPTIONS.map((grade) => (
                                <option key={grade.huruf} value={grade.huruf}>
                                  {grade.huruf}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-lg font-semibold text-slate-700">
                            {mhs.nilai_angka?.toFixed(2) || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {selectedKelas && mahasiswaList.length > 0 && (
              <div className="p-4 bg-slate-50 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Total: {mahasiswaList.length} mahasiswa
                  </span>
                  <span className="text-slate-600">
                    Sudah dinilai:{" "}
                    {mahasiswaList.filter((m) => m.nilai_huruf).length} /{" "}
                    {mahasiswaList.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panduan Nilai */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            📊 Panduan Konversi Nilai
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {GRADE_OPTIONS.map((grade) => (
              <div
                key={grade.huruf}
                className={`p-3 rounded-xl text-center ${getGradeColor(
                  grade.huruf
                )}`}
              >
                <p className="text-2xl font-bold">{grade.huruf}</p>
                <p className="text-sm">{grade.angka.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========== TAMPILAN MAHASISWA ==========
  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          📊 Kartu Hasil Studi
        </h1>
        <p className="text-slate-600 text-lg">
          Lihat riwayat nilai akademik Anda
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <p className="text-blue-100 text-sm">Indeks Prestasi Kumulatif</p>
            <p className="text-4xl font-bold text-white">
              {stats.ipk.toFixed(2)}
            </p>
          </div>
          <div className="px-6 py-3 bg-blue-50">
            <p className="text-sm text-blue-700">
              {stats.ipk >= 3.5
                ? "🌟 Sangat Baik"
                : stats.ipk >= 3.0
                ? "👍 Baik"
                : stats.ipk >= 2.5
                ? "📚 Cukup"
                : "💪 Perlu Peningkatan"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-slate-500 text-sm uppercase tracking-wide">
            Total SKS
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {stats.totalSks}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            SKS yang telah diselesaikan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <p className="text-slate-500 text-sm uppercase tracking-wide">
            Mata Kuliah
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {stats.totalMK}
          </p>
          <p className="text-sm text-slate-500 mt-2">Mata kuliah selesai</p>
        </div>
      </div>

      {/* Grades by Semester */}
      {Object.keys(groupedGrades).length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-slate-600 text-lg">Belum ada data nilai.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedGrades)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([semester, semGrades]) => {
              const semStats = calculateSemesterStats(semGrades);
              return (
                <div
                  key={semester}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Semester Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {semester}
                        </h2>
                        <p className="text-indigo-100 text-sm">
                          {semGrades.length} Mata Kuliah
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-100 text-sm">IPS</p>
                        <p className="text-2xl font-bold text-white">
                          {semStats.ips.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grades Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Kode
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Mata Kuliah
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                            SKS
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                            Nilai
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                            Angka
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                            Mutu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {semGrades.map((grade) => (
                          <tr key={grade.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                {grade.kelas?.matakuliah?.kode_mk || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {grade.kelas?.matakuliah?.nama_mk || "-"}
                            </td>
                            <td className="px-6 py-4 text-center text-slate-600">
                              {grade.kelas?.matakuliah?.sks || 0}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {grade.nilai_huruf ? (
                                <span
                                  className={`px-4 py-1 rounded-full text-sm font-bold ${getGradeColor(
                                    grade.nilai_huruf
                                  )}`}
                                >
                                  {grade.nilai_huruf}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center font-mono text-slate-700">
                              {grade.nilai_angka?.toFixed(2) || "-"}
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-slate-900">
                              {grade.nilai_angka && grade.kelas?.matakuliah?.sks
                                ? (
                                    grade.nilai_angka *
                                    grade.kelas.matakuliah.sks
                                  ).toFixed(2)
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 border-t">
                        <tr>
                          <td
                            colSpan={2}
                            className="px-6 py-4 font-bold text-slate-900"
                          >
                            Total
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-900">
                            {semStats.totalSks}
                          </td>
                          <td colSpan={2}></td>
                          <td className="px-6 py-4 text-center font-bold text-slate-900">
                            {semGrades
                              .filter((g) => g.nilai_angka)
                              .reduce(
                                (sum, g) =>
                                  sum +
                                  (g.nilai_angka || 0) *
                                    (g.kelas?.matakuliah?.sks || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
