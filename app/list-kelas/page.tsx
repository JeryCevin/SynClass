"use client";

import { useEffect, useState } from "react";
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

interface PresensiSession {
  id: string;
  matakuliah_id: number;
  pertemuan: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  is_active: boolean;
}

interface Presensi {
  id: string;
  presensi_session_id: string;
  mahasiswa_id: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
  waktu_presensi: string | null;
  profiles?: { username: string; nim: number };
}

interface Post {
  id: string;
  matakuliah_id: number;
  judul: string;
  pertemuan: number;
  deskripsi: string;
  jenis: "materi" | "tugas";
  link: string | null;
  deadline: string | null;
  created_at: string;
  profiles?: { username: string };
}

interface TugasSubmission {
  id: string;
  post_id: string;
  mahasiswa_id: string;
  jawaban_text: string | null;
  jawaban_link: string | null;
  nilai: number | null;
  feedback: string | null;
  submitted_at: string;
  profiles?: { username: string; nim: number };
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

const STATUS_OPTIONS = [
  {
    value: "hadir",
    label: "Hadir",
    color: "bg-green-100 text-green-800",
    icon: "✅",
  },
  {
    value: "sakit",
    label: "Sakit",
    color: "bg-yellow-100 text-yellow-800",
    icon: "🤒",
  },
  {
    value: "izin",
    label: "Izin",
    color: "bg-blue-100 text-blue-800",
    icon: "📝",
  },
  {
    value: "alpha",
    label: "Alpha",
    color: "bg-red-100 text-red-800",
    icon: "❌",
  },
];

// ==================== MAIN COMPONENT ====================
export default function ListKelasPage() {
  const supabase = createClient();

  // State umum
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // State untuk modal
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [activeTab, setActiveTab] = useState<"presensi" | "materi">("presensi");

  // State Presensi
  const [presensiSessions, setPresensiSessions] = useState<PresensiSession[]>(
    []
  );
  const [selectedSession, setSelectedSession] =
    useState<PresensiSession | null>(null);
  const [presensiList, setPresensiList] = useState<Presensi[]>([]);
  const [myPresensi, setMyPresensi] = useState<Presensi | null>(null);

  // State Post (Materi/Tugas)
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [submissions, setSubmissions] = useState<TugasSubmission[]>([]);
  const [mySubmission, setMySubmission] = useState<TugasSubmission | null>(
    null
  );

  // State Form
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form data
  const [sessionForm, setSessionForm] = useState({
    pertemuan: 1,
    tanggal: new Date().toISOString().split("T")[0],
    waktu_mulai: "08:00",
    waktu_selesai: "10:00",
  });

  const [postForm, setPostForm] = useState({
    judul: "",
    pertemuan: 1,
    deskripsi: "",
    jenis: "materi" as "materi" | "tugas",
    link: "",
    deadline: "",
  });

  const [submitForm, setSubmitForm] = useState({
    jawaban_text: "",
    jawaban_link: "",
  });

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
        // Buat kelas dari data matakuliah (menggunakan jadwal dari matakuliah)
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

          // Ambil dari matakuliah dengan jadwal
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

  const fetchPresensiSessions = async (matakuliahId: number) => {
    const { data } = await supabase
      .from("presensi_session")
      .select("*")
      .eq("matakuliah_id", matakuliahId)
      .order("pertemuan", { ascending: true });
    if (data) setPresensiSessions(data);
  };

  const fetchPresensiList = async (sessionId: string) => {
    const { data } = await supabase
      .from("presensi")
      .select(`*, profiles:mahasiswa_id (username, nim)`)
      .eq("presensi_session_id", sessionId);
    if (data) setPresensiList(data);
  };

  const fetchMyPresensi = async (sessionId: string, mahasiswaId: string) => {
    const { data } = await supabase
      .from("presensi")
      .select("*")
      .eq("presensi_session_id", sessionId)
      .eq("mahasiswa_id", mahasiswaId)
      .single();
    setMyPresensi(data);
  };

  const fetchPosts = async (matakuliahId: number) => {
    const { data } = await supabase
      .from("post")
      .select(`*, profiles:created_by (username)`)
      .eq("matakuliah_id", matakuliahId)
      .order("pertemuan", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchSubmissions = async (postId: string) => {
    const { data } = await supabase
      .from("tugas_submission")
      .select(`*, profiles:mahasiswa_id (username, nim)`)
      .eq("post_id", postId)
      .order("submitted_at", { ascending: true });
    if (data) setSubmissions(data);
  };

  const fetchMySubmission = async (postId: string, mahasiswaId: string) => {
    const { data } = await supabase
      .from("tugas_submission")
      .select("*")
      .eq("post_id", postId)
      .eq("mahasiswa_id", mahasiswaId)
      .single();
    setMySubmission(data);
  };

  // ==================== HANDLER FUNCTIONS ====================
  const openKelasDetail = async (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setActiveTab("presensi");
    await fetchPresensiSessions(kelas.matakuliah_id);
    await fetchPosts(kelas.matakuliah_id);
  };

  const closeKelasDetail = () => {
    setSelectedKelas(null);
    setSelectedSession(null);
    setSelectedPost(null);
    setPresensiSessions([]);
    setPosts([]);
    setPresensiList([]);
    setSubmissions([]);
  };

  // Presensi Session handlers
  const handleCreateSession = async () => {
    if (!selectedKelas) return;
    const { error } = await supabase.from("presensi_session").insert({
      matakuliah_id: selectedKelas.matakuliah_id,
      pertemuan: sessionForm.pertemuan,
      tanggal: sessionForm.tanggal,
      waktu_mulai: sessionForm.waktu_mulai,
      waktu_selesai: sessionForm.waktu_selesai,
      is_active: false,
      created_by: userId,
    });
    if (!error) {
      await fetchPresensiSessions(selectedKelas.matakuliah_id);
      setShowSessionForm(false);
      setSessionForm({
        pertemuan: presensiSessions.length + 2,
        tanggal: new Date().toISOString().split("T")[0],
        waktu_mulai: "08:00",
        waktu_selesai: "10:00",
      });
    }
  };

  const handleToggleSession = async (session: PresensiSession) => {
    await supabase
      .from("presensi_session")
      .update({ is_active: !session.is_active })
      .eq("id", session.id);
    if (selectedKelas) await fetchPresensiSessions(selectedKelas.matakuliah_id);
  };

  const handleSelectSession = async (session: PresensiSession) => {
    setSelectedSession(session);
    if (role === "mahasiswa") {
      await fetchMyPresensi(session.id, userId);
    } else {
      await fetchPresensiList(session.id);
    }
  };

  // Presensi Mahasiswa
  const handleMahasiswaPresensi = async (status: string) => {
    if (!selectedSession) return;

    if (myPresensi) {
      await supabase
        .from("presensi")
        .update({ status, waktu_presensi: new Date().toISOString() })
        .eq("id", myPresensi.id);
    } else {
      await supabase.from("presensi").insert({
        presensi_session_id: selectedSession.id,
        mahasiswa_id: userId,
        status,
        waktu_presensi: new Date().toISOString(),
      });
    }
    await fetchMyPresensi(selectedSession.id, userId);
  };

  // Edit presensi oleh Dosen
  const handleEditPresensi = async (presensiId: string, status: string) => {
    await supabase.from("presensi").update({ status }).eq("id", presensiId);
    if (selectedSession) await fetchPresensiList(selectedSession.id);
  };

  // Post handlers
  const handleCreatePost = async () => {
    if (!selectedKelas) return;
    const { error } = await supabase.from("post").insert({
      matakuliah_id: selectedKelas.matakuliah_id,
      judul: postForm.judul,
      pertemuan: postForm.pertemuan,
      deskripsi: postForm.deskripsi,
      jenis: postForm.jenis,
      link: postForm.link || null,
      deadline:
        postForm.jenis === "tugas" && postForm.deadline
          ? postForm.deadline
          : null,
      created_by: userId,
    });
    if (!error) {
      await fetchPosts(selectedKelas.matakuliah_id);
      setShowPostForm(false);
      setPostForm({
        judul: "",
        pertemuan: 1,
        deskripsi: "",
        jenis: "materi",
        link: "",
        deadline: "",
      });
    }
  };

  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    if (role === "mahasiswa" && post.jenis === "tugas") {
      await fetchMySubmission(post.id, userId);
    } else if (role !== "mahasiswa" && post.jenis === "tugas") {
      await fetchSubmissions(post.id);
    }
  };

  // Submit tugas
  const handleSubmitTugas = async () => {
    if (!selectedPost) return;

    if (mySubmission) {
      await supabase
        .from("tugas_submission")
        .update({
          jawaban_text: submitForm.jawaban_text || null,
          jawaban_link: submitForm.jawaban_link || null,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", mySubmission.id);
    } else {
      await supabase.from("tugas_submission").insert({
        post_id: selectedPost.id,
        mahasiswa_id: userId,
        jawaban_text: submitForm.jawaban_text || null,
        jawaban_link: submitForm.jawaban_link || null,
      });
    }
    await fetchMySubmission(selectedPost.id, userId);
    setShowSubmitForm(false);
    setSubmitForm({ jawaban_text: "", jawaban_link: "" });
  };

  // Beri nilai
  const handleGradeSubmission = async (
    submissionId: string,
    nilai: number,
    feedback: string
  ) => {
    await supabase
      .from("tugas_submission")
      .update({
        nilai,
        feedback,
        graded_at: new Date().toISOString(),
        graded_by: userId,
      })
      .eq("id", submissionId);
    if (selectedPost) await fetchSubmissions(selectedPost.id);
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

      {/* Kelas List by Hari */}
      {kelasList.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-slate-600 text-lg">Belum ada kelas terdaftar.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedHari.map((hari) => (
            <div key={hari}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                {hari}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByHari[hari]
                  .sort((a, b) => (a.jam || "").localeCompare(b.jam || ""))
                  .map((kelas) => (
                    <div
                      key={kelas.id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition cursor-pointer"
                      onClick={() => openKelasDetail(kelas)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded text-sm">
                          {kelas.matakuliah?.kode_mk}
                        </div>
                        <span className="text-slate-500 text-sm font-medium">
                          🕐 {kelas.jam || "-"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {kelas.matakuliah?.nama_mk}
                      </h3>
                      <p className="text-slate-500 text-sm mb-2">
                        👤 {kelas.profiles?.username || "Dosen"}
                      </p>
                      <p className="text-slate-400 text-sm">
                        📍 {kelas.ruangan || "Ruangan belum ditentukan"}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <span className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold text-center">
                          ✅ Presensi
                        </span>
                        <span className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold text-center">
                          📚 Materi
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== MODAL DETAIL KELAS ==================== */}
      {selectedKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedKelas.matakuliah?.nama_mk}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {selectedKelas.matakuliah?.kode_mk} • {selectedKelas.hari}{" "}
                    {selectedKelas.jam}
                  </p>
                </div>
                <button
                  onClick={closeKelasDetail}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setActiveTab("presensi")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "presensi"
                      ? "bg-white text-blue-600"
                      : "bg-blue-500/30 text-white hover:bg-blue-500/50"
                  }`}
                >
                  ✅ Presensi
                </button>
                <button
                  onClick={() => setActiveTab("materi")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "materi"
                      ? "bg-white text-blue-600"
                      : "bg-blue-500/30 text-white hover:bg-blue-500/50"
                  }`}
                >
                  📚 Materi & Tugas
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ========== TAB PRESENSI ========== */}
              {activeTab === "presensi" && (
                <div>
                  {/* Dosen: Tombol Buat Sesi */}
                  {role !== "mahasiswa" && (
                    <div className="mb-4">
                      <button
                        onClick={() => setShowSessionForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                      >
                        + Buat Sesi Presensi
                      </button>
                    </div>
                  )}

                  {/* Daftar Sesi */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {presensiSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          selectedSession?.id === session.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <p className="font-bold text-slate-900">
                          Pertemuan {session.pertemuan}
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.tanggal}
                        </p>
                        <p className="text-xs text-slate-400">
                          {session.waktu_mulai} - {session.waktu_selesai}
                        </p>
                        {session.is_active && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            🟢 Aktif
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Detail Sesi */}
                  {selectedSession && (
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-900">
                          Presensi Pertemuan {selectedSession.pertemuan}
                        </h3>
                        {role !== "mahasiswa" && (
                          <button
                            onClick={() => handleToggleSession(selectedSession)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                              selectedSession.is_active
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {selectedSession.is_active
                              ? "Tutup Presensi"
                              : "Buka Presensi"}
                          </button>
                        )}
                      </div>

                      {/* Mahasiswa: Pilih Status */}
                      {role === "mahasiswa" && (
                        <div>
                          {!selectedSession.is_active ? (
                            <p className="text-slate-500">
                              Presensi belum dibuka oleh dosen.
                            </p>
                          ) : (
                            <div>
                              <p className="mb-3 text-slate-600">
                                Pilih status kehadiran Anda:
                              </p>
                              <div className="flex gap-3 flex-wrap">
                                {STATUS_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() =>
                                      handleMahasiswaPresensi(opt.value)
                                    }
                                    className={`px-4 py-3 rounded-xl font-medium transition ${
                                      myPresensi?.status === opt.value
                                        ? opt.color +
                                          " ring-2 ring-offset-2 ring-blue-500"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {opt.icon} {opt.label}
                                  </button>
                                ))}
                              </div>
                              {myPresensi && (
                                <p className="mt-4 text-sm text-slate-500">
                                  Tercatat:{" "}
                                  {new Date(
                                    myPresensi.waktu_presensi || ""
                                  ).toLocaleString("id-ID")}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dosen: Daftar Mahasiswa */}
                      {role !== "mahasiswa" && (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                  No
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                  NIM
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                  Nama
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {presensiList.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 text-slate-600">
                                    {idx + 1}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {p.profiles?.nim || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-slate-900 font-medium">
                                    {p.profiles?.username || "-"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      value={p.status}
                                      onChange={(e) =>
                                        handleEditPresensi(p.id, e.target.value)
                                      }
                                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                        STATUS_OPTIONS.find(
                                          (s) => s.value === p.status
                                        )?.color
                                      }`}
                                    >
                                      {STATUS_OPTIONS.map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              ))}
                              {presensiList.length === 0 && (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-slate-500"
                                  >
                                    Belum ada data presensi.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ========== TAB MATERI & TUGAS ========== */}
              {activeTab === "materi" && (
                <div>
                  {/* Dosen: Tombol Buat Post */}
                  {role !== "mahasiswa" && (
                    <div className="mb-4">
                      <button
                        onClick={() => setShowPostForm(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
                      >
                        + Buat Materi / Tugas
                      </button>
                    </div>
                  )}

                  {/* Daftar Post */}
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleSelectPost(post)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          selectedPost?.id === post.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  post.jenis === "tugas"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {post.jenis === "tugas"
                                  ? "📝 Tugas"
                                  : "📖 Materi"}
                              </span>
                              <span className="text-slate-400 text-sm">
                                Pertemuan {post.pertemuan}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900">
                              {post.judul}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {post.deskripsi}
                            </p>
                          </div>
                          {post.jenis === "tugas" && post.deadline && (
                            <span className="text-xs text-red-500 whitespace-nowrap">
                              ⏰{" "}
                              {new Date(post.deadline).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <p className="text-center text-slate-500 py-8">
                        Belum ada materi atau tugas.
                      </p>
                    )}
                  </div>

                  {/* Detail Post */}
                  {selectedPost && (
                    <div className="mt-6 bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            selectedPost.jenis === "tugas"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {selectedPost.jenis === "tugas"
                            ? "📝 Tugas"
                            : "📖 Materi"}
                        </span>
                        <span className="text-slate-400 text-sm">
                          Pertemuan {selectedPost.pertemuan}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {selectedPost.judul}
                      </h3>
                      <p className="text-slate-600 whitespace-pre-wrap mb-4">
                        {selectedPost.deskripsi}
                      </p>

                      {selectedPost.link && (
                        <a
                          href={selectedPost.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
                        >
                          🔗 Buka Link Materi/File
                        </a>
                      )}

                      {selectedPost.jenis === "tugas" &&
                        selectedPost.deadline && (
                          <p className="text-sm text-red-500 mb-4">
                            ⏰ Deadline:{" "}
                            {new Date(selectedPost.deadline).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        )}

                      {/* Mahasiswa: Submit Tugas */}
                      {role === "mahasiswa" &&
                        selectedPost.jenis === "tugas" && (
                          <div className="mt-4 pt-4 border-t">
                            {mySubmission ? (
                              <div className="bg-white p-4 rounded-lg">
                                <p className="font-medium text-slate-900 mb-2">
                                  ✅ Tugas Sudah Dikumpulkan
                                </p>
                                {mySubmission.jawaban_text && (
                                  <p className="text-sm text-slate-600 mb-2">
                                    <strong>Jawaban:</strong>{" "}
                                    {mySubmission.jawaban_text}
                                  </p>
                                )}
                                {mySubmission.jawaban_link && (
                                  <a
                                    href={mySubmission.jawaban_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    🔗 Link File
                                  </a>
                                )}
                                {mySubmission.nilai !== null && (
                                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                    <p className="font-bold text-green-700">
                                      Nilai: {mySubmission.nilai}
                                    </p>
                                    {mySubmission.feedback && (
                                      <p className="text-sm text-green-600">
                                        Feedback: {mySubmission.feedback}
                                      </p>
                                    )}
                                  </div>
                                )}
                                <button
                                  onClick={() => {
                                    setSubmitForm({
                                      jawaban_text:
                                        mySubmission.jawaban_text || "",
                                      jawaban_link:
                                        mySubmission.jawaban_link || "",
                                    });
                                    setShowSubmitForm(true);
                                  }}
                                  className="mt-3 text-sm text-blue-600 hover:underline"
                                >
                                  Edit Jawaban
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowSubmitForm(true)}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600"
                              >
                                📤 Kumpulkan Tugas
                              </button>
                            )}
                          </div>
                        )}

                      {/* Dosen: Lihat Submissions */}
                      {role !== "mahasiswa" &&
                        selectedPost.jenis === "tugas" && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-bold text-slate-900 mb-3">
                              📋 Jawaban Mahasiswa
                            </h4>
                            <div className="space-y-3">
                              {submissions.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="bg-white p-4 rounded-lg border"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-slate-900">
                                        {sub.profiles?.username}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        NIM: {sub.profiles?.nim}
                                      </p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                      {new Date(
                                        sub.submitted_at
                                      ).toLocaleString("id-ID")}
                                    </span>
                                  </div>
                                  {sub.jawaban_text && (
                                    <p className="text-sm text-slate-600 mt-2">
                                      {sub.jawaban_text}
                                    </p>
                                  )}
                                  {sub.jawaban_link && (
                                    <a
                                      href={sub.jawaban_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      🔗 Lihat File
                                    </a>
                                  )}
                                  <div className="mt-3 flex items-center gap-3">
                                    <input
                                      type="number"
                                      placeholder="Nilai (0-100)"
                                      defaultValue={sub.nilai || ""}
                                      min="0"
                                      max="100"
                                      className="w-24 px-3 py-1 border rounded-lg text-sm"
                                      id={`nilai-${sub.id}`}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Feedback"
                                      defaultValue={sub.feedback || ""}
                                      className="flex-1 px-3 py-1 border rounded-lg text-sm"
                                      id={`feedback-${sub.id}`}
                                    />
                                    <button
                                      onClick={() => {
                                        const nilai = parseFloat(
                                          (
                                            document.getElementById(
                                              `nilai-${sub.id}`
                                            ) as HTMLInputElement
                                          ).value
                                        );
                                        const feedback = (
                                          document.getElementById(
                                            `feedback-${sub.id}`
                                          ) as HTMLInputElement
                                        ).value;
                                        handleGradeSubmission(
                                          sub.id,
                                          nilai,
                                          feedback
                                        );
                                      }}
                                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                    >
                                      Simpan
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {submissions.length === 0 && (
                                <p className="text-slate-500 text-sm">
                                  Belum ada yang mengumpulkan.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== FORM MODALS ==================== */}

      {/* Form Buat Sesi Presensi */}
      {showSessionForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Buat Sesi Presensi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pertemuan Ke-
                </label>
                <input
                  type="number"
                  value={sessionForm.pertemuan}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      pertemuan: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={sessionForm.tanggal}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, tanggal: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    value={sessionForm.waktu_mulai}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        waktu_mulai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    value={sessionForm.waktu_selesai}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        waktu_selesai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSessionForm(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Buat Post */}
      {showPostForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Buat Materi / Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jenis
                </label>
                <select
                  value={postForm.jenis}
                  onChange={(e) =>
                    setPostForm({
                      ...postForm,
                      jenis: e.target.value as "materi" | "tugas",
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="materi">📖 Materi</option>
                  <option value="tugas">📝 Tugas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pertemuan Ke-
                </label>
                <input
                  type="number"
                  value={postForm.pertemuan}
                  onChange={(e) =>
                    setPostForm({
                      ...postForm,
                      pertemuan: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={postForm.judul}
                  onChange={(e) =>
                    setPostForm({ ...postForm, judul: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Judul materi/tugas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={postForm.deskripsi}
                  onChange={(e) =>
                    setPostForm({ ...postForm, deskripsi: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Deskripsi atau instruksi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Link (Google Drive, dll)
                </label>
                <input
                  type="url"
                  value={postForm.link}
                  onChange={(e) =>
                    setPostForm({ ...postForm, link: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              {postForm.jenis === "tugas" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={postForm.deadline}
                    onChange={(e) =>
                      setPostForm({ ...postForm, deadline: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Submit Tugas */}
      {showSubmitForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Kumpulkan Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jawaban (Teks)
                </label>
                <textarea
                  value={submitForm.jawaban_text}
                  onChange={(e) =>
                    setSubmitForm({
                      ...submitForm,
                      jawaban_text: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Tulis jawaban di sini..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Link File (Google Drive)
                </label>
                <input
                  type="url"
                  value={submitForm.jawaban_link}
                  onChange={(e) =>
                    setSubmitForm({
                      ...submitForm,
                      jawaban_link: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Upload file ke Google Drive lalu paste linknya di sini
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitForm(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitTugas}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
