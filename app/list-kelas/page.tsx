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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#7a1d38] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat jadwal kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jadwal Kelas</h1>
            <p className="text-gray-500">
              {role === "mahasiswa"
                ? "Kelas yang Anda ikuti semester ini"
                : "Kelas yang Anda ampu semester ini"}
            </p>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      {kelasList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-[#7a1d38]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center">
                <span className="text-[#7a1d38]">📚</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {kelasList.length}
                </p>
                <p className="text-xs text-gray-500">Total Kelas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-[#7a1d38]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center">
                <span className="text-[#7a1d38]">📖</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {kelasList.reduce(
                    (sum, k) => sum + (k.matakuliah?.sks || 0),
                    0
                  )}
                </p>
                <p className="text-xs text-gray-500">Total SKS</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-[#7a1d38]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center">
                <span className="text-[#7a1d38]">📆</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedHari.length}
                </p>
                <p className="text-xs text-gray-500">Hari Aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-md p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span>👤</span>
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{role}</p>
                <p className="text-xs text-white/70">Role Anda</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kelas List by Hari */}
      {kelasList.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-[#fdf2f4] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">📭</span>
          </div>
          <p className="text-gray-700 text-lg font-medium mb-2">
            Belum ada kelas terdaftar
          </p>
          <p className="text-gray-400 text-sm">
            {role === "mahasiswa"
              ? "Pastikan KRS Anda sudah disetujui oleh Kaprodi."
              : "Pastikan mata kuliah sudah ditambahkan dan Anda ditetapkan sebagai pengampu."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedHari.map((hari) => (
            <div key={hari}>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a1d38] to-[#9e2a4a] flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {hari.substring(0, 2)}
                </span>
                {hari}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  ({groupedByHari[hari].length} kelas)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByHari[hari]
                  .sort((a, b) => (a.jam || "").localeCompare(b.jam || ""))
                  .map((kelas) => (
                    <div
                      key={kelas.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#7a1d38]/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                      onClick={() => openKelasDetail(kelas)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#fdf2f4] text-[#7a1d38] font-bold px-3 py-1.5 rounded-lg text-sm">
                          {kelas.matakuliah?.kode_mk}
                        </div>
                        <span className="text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <span className="text-xs">🕐</span> {kelas.jam || "-"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#7a1d38] transition-colors">
                        {kelas.matakuliah?.nama_mk}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-500 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-xs">
                            👤
                          </span>
                          {kelas.profiles?.username || "Dosen"}
                        </p>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-xs">
                            📍
                          </span>
                          {kelas.ruangan || "Ruangan belum ditentukan"}
                        </p>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-xs">
                            📚
                          </span>
                          {kelas.matakuliah?.sks} SKS • Semester{" "}
                          {kelas.matakuliah?.semester}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <span className="flex-1 bg-[#fdf2f4] text-[#7a1d38] py-2.5 rounded-xl text-sm font-semibold text-center group-hover:bg-[#7a1d38] group-hover:text-white transition-all">
                          ✅ Presensi
                        </span>
                        <span className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold text-center group-hover:bg-[#fdf2f4] group-hover:text-[#7a1d38] transition-all">
                          📚 Materi
                        </span>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-xs text-[#7a1d38] font-medium group-hover:underline">
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
