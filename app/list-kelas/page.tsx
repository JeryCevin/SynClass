"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

// ==================== INTERFACES ====================
interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string;
  dosen_id: string;
  profiles?: { username: string };
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
  profiles?: { username: string };
}

// ==================== CONSTANTS ====================
const HARI_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

// ==================== MAIN COMPONENT ====================
export default function ListKelasPage() {
  const supabase = createClient();
  const router = useRouter();

  // State
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // ==================== INIT ====================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userRole = localStorage.getItem("user_role") || "mahasiswa";
      setRole(userRole.toLowerCase());

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUserId(authData.user.id);
        await fetchKelas(authData.user.id, userRole.toLowerCase());
      }
      setLoading(false);
    };
    init();
  }, []);

  // ==================== FETCH FUNCTIONS ====================
  const fetchKelas = async (uid: string, userRole: string) => {
    if (userRole === "dosen" || userRole === "kaprodi") {
      // Dosen/Kaprodi: ambil mata kuliah yang mereka ampu dari tabel matakuliah
      const { data: mkData, error: mkError } = await supabase
        .from("matakuliah")
        .select(`*, profiles:dosen_id (username)`)
        .eq("dosen_id", uid);

      if (mkError) {
        console.error("Error fetching matakuliah:", mkError);
        setKelasList([]);
        return;
      }

      if (mkData && mkData.length > 0) {
        const virtualKelas: Kelas[] = mkData.map((mk) => ({
          id: `mk-${mk.id}`,
          matakuliah_id: mk.id,
          dosen_id: uid,
          semester: mk.semester?.toString() || "1",
          hari: mk.hari || "Belum Diatur",
          jam:
            mk.jam_mulai && mk.jam_selesai
              ? `${mk.jam_mulai} - ${mk.jam_selesai}`
              : "Belum Diatur",
          ruangan: mk.ruangan || "TBA",
          matakuliah: mk,
          profiles: mk.profiles || { username: "Anda" },
        }));
        setKelasList(virtualKelas);
      } else {
        setKelasList([]);
      }
    } else {
      // Mahasiswa: ambil kelas dari krs_detail yang approved
      const { data: krsData } = await supabase
        .from("krs_pengajuan")
        .select("id")
        .eq("mahasiswa_id", uid)
        .eq("status", "approved");

      if (krsData && krsData.length > 0) {
        const pengajuanIds = krsData.map((k) => k.id);
        const { data: detailData } = await supabase
          .from("krs_detail")
          .select("matakuliah_id")
          .in("krs_pengajuan_id", pengajuanIds);

        if (detailData && detailData.length > 0) {
          const mkIds = detailData.map((d) => d.matakuliah_id);

          const { data: mkData } = await supabase
            .from("matakuliah")
            .select(`*, profiles:dosen_id (username)`)
            .in("id", mkIds);

          if (mkData && mkData.length > 0) {
            const virtualKelas: Kelas[] = mkData.map((mk) => ({
              id: `mk-${mk.id}`,
              matakuliah_id: mk.id,
              dosen_id: mk.dosen_id,
              semester: mk.semester?.toString() || "1",
              hari: mk.hari || "Belum Diatur",
              jam:
                mk.jam_mulai && mk.jam_selesai
                  ? `${mk.jam_mulai} - ${mk.jam_selesai}`
                  : "Belum Diatur",
              ruangan: mk.ruangan || "TBA",
              matakuliah: mk,
              profiles: mk.profiles || { username: "-" },
            }));
            setKelasList(virtualKelas);
          } else {
            setKelasList([]);
          }
        } else {
          setKelasList([]);
        }
      } else {
        setKelasList([]);
      }
    }
  };

  // ==================== NAVIGATE TO DETAIL ====================
  const openKelasDetail = (kelas: Kelas) => {
    router.push(`/kelas/${kelas.id}`);
  };

  // ==================== GROUPING ====================
  const groupedByHari = kelasList.reduce((acc, kelas) => {
    const hari = kelas.hari || "Lainnya";
    if (!acc[hari]) acc[hari] = [];
    acc[hari].push(kelas);
    return acc;
  }, {} as Record<string, Kelas[]>);

  const sortedHari = Object.keys(groupedByHari).sort(
    (a, b) => HARI_ORDER.indexOf(a) - HARI_ORDER.indexOf(b)
  );

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat jadwal kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          📅 Jadwal Kelas
        </h1>
        <p className="text-slate-600 text-lg">
          {role === "mahasiswa"
            ? "Kelas yang Anda ikuti semester ini"
            : "Kelas yang Anda ampu semester ini"}
        </p>
      </header>

      {/* Summary Stats */}
      {kelasList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-2xl font-bold text-slate-900">
              {kelasList.length}
            </p>
            <p className="text-sm text-slate-500">Total Kelas</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-2xl font-bold text-slate-900">
              {kelasList.reduce((sum, k) => sum + (k.matakuliah?.sks || 0), 0)}
            </p>
            <p className="text-sm text-slate-500">Total SKS</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-2xl font-bold text-slate-900">
              {sortedHari.length}
            </p>
            <p className="text-sm text-slate-500">Hari Aktif</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <p className="text-2xl font-bold text-slate-900 capitalize">
              {role}
            </p>
            <p className="text-sm text-slate-500">Role Anda</p>
          </div>
        </div>
      )}

      {/* Kelas List by Hari */}
      {kelasList.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-slate-600 text-lg mb-2">
            Belum ada kelas terdaftar.
          </p>
          <p className="text-slate-400 text-sm">
            {role === "mahasiswa"
              ? "Pastikan KRS Anda sudah disetujui oleh Kaprodi."
              : "Pastikan mata kuliah sudah ditambahkan dan Anda ditetapkan sebagai pengampu."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedHari.map((hari) => (
            <div key={hari}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {hari.substring(0, 2)}
                </span>
                {hari}
                <span className="text-sm font-normal text-slate-400">
                  ({groupedByHari[hari].length} kelas)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByHari[hari]
                  .sort((a, b) => (a.jam || "").localeCompare(b.jam || ""))
                  .map((kelas) => (
                    <div
                      key={kelas.id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                      onClick={() => openKelasDetail(kelas)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg text-sm">
                          {kelas.matakuliah?.kode_mk}
                        </div>
                        <span className="text-slate-500 text-sm font-medium bg-slate-50 px-2 py-1 rounded">
                          🕐 {kelas.jam || "-"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {kelas.matakuliah?.nama_mk}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-500 flex items-center gap-2">
                          <span>👤</span>
                          {kelas.profiles?.username || "Dosen"}
                        </p>
                        <p className="text-slate-400 flex items-center gap-2">
                          <span>📍</span>
                          {kelas.ruangan || "Ruangan belum ditentukan"}
                        </p>
                        <p className="text-slate-400 flex items-center gap-2">
                          <span>📚</span>
                          {kelas.matakuliah?.sks} SKS • Semester{" "}
                          {kelas.matakuliah?.semester}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <span className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold text-center group-hover:bg-indigo-100 transition-colors">
                          ✅ Presensi
                        </span>
                        <span className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold text-center group-hover:bg-emerald-100 transition-colors">
                          📚 Materi
                        </span>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-xs text-blue-500 font-medium group-hover:underline">
                          Klik untuk melihat detail →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
