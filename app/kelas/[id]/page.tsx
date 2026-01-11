"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

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
export default function KelasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  // Extract matakuliah_id from URL (format: mk-{id})
  const matakuliahId = parseInt(
    (params.id as string)?.replace("mk-", "") || "0"
  );

  // State
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [matakuliah, setMatakuliah] = useState<MataKuliah | null>(null);
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

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

  // ==================== HELPER FUNCTIONS ====================
  // Tentukan apakah presensi session harus aktif berdasarkan waktu
  const isSessionActive = (session: PresensiSession): boolean => {
    const now = new Date();
    const sessionDate = new Date(session.tanggal);
    const [startHour, startMin] = session.waktu_mulai.split(":").map(Number);
    const [endHour, endMin] = session.waktu_selesai.split(":").map(Number);

    // Set waktu mulai dan 15 menit setelahnya
    const startTime = new Date(sessionDate);
    startTime.setHours(startHour, startMin, 0, 0);

    const autoCloseTime = new Date(startTime);
    autoCloseTime.setMinutes(autoCloseTime.getMinutes() + 15);

    // Presensi aktif jika waktu sekarang berada dalam range start time + 15 menit
    return now >= startTime && now <= autoCloseTime;
  };

  // Tentukan apakah presensi session sudah berakhir
  const isSessionClosed = (session: PresensiSession): boolean => {
    const now = new Date();
    const sessionDate = new Date(session.tanggal);
    const [startHour, startMin] = session.waktu_mulai.split(":").map(Number);

    const startTime = new Date(sessionDate);
    startTime.setHours(startHour, startMin, 0, 0);

    const autoCloseTime = new Date(startTime);
    autoCloseTime.setMinutes(autoCloseTime.getMinutes() + 15);

    return now > autoCloseTime;
  };

  // ==================== INIT ====================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userRole = localStorage.getItem("user_role") || "mahasiswa";
      setRole(userRole.toLowerCase());

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUserId(authData.user.id);
      }

      // Fetch matakuliah data
      await fetchMatakuliah();
      await fetchPresensiSessions();
      await fetchPosts();

      setLoading(false);
    };
    init();
  }, [matakuliahId]);

  // Monitor status presensi setiap detik
  useEffect(() => {
    if (presensiSessions.length === 0) return;

    const interval = setInterval(() => {
      setPresensiSessions((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          is_active: isSessionActive(session),
        }))
      );

      // Update selected session jika ada
      if (selectedSession) {
        setSelectedSession((prev) =>
          prev ? { ...prev, is_active: isSessionActive(prev) } : null
        );
      }
    }, 1000); // Update setiap 1 detik

    return () => clearInterval(interval);
  }, [presensiSessions, selectedSession]);

  // ==================== FETCH FUNCTIONS ====================
  const fetchMatakuliah = async () => {
    const { data, error } = await supabase
      .from("matakuliah")
      .select(`*, profiles:dosen_id (username)`)
      .eq("id", matakuliahId)
      .single();

    if (data) setMatakuliah(data);
    if (error) console.error("Error fetching matakuliah:", error);
  };

  const fetchPresensiSessions = async () => {
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
      .select(`*, profiles!presensi_mahasiswa_id_fkey (username, nim)`)
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

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("post")
      .select(`*, profiles!post_created_by_fkey (username)`)
      .eq("matakuliah_id", matakuliahId)
      .order("pertemuan", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchSubmissions = async (postId: string) => {
    const { data } = await supabase
      .from("tugas_submission")
      .select(`*, profiles!tugas_submission_mahasiswa_id_fkey (username, nim)`)
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
  const handleCreateSession = async () => {
    const { error } = await supabase.from("presensi_session").insert({
      matakuliah_id: matakuliahId,
      pertemuan: sessionForm.pertemuan,
      tanggal: sessionForm.tanggal,
      waktu_mulai: sessionForm.waktu_mulai,
      waktu_selesai: sessionForm.waktu_selesai,
      is_active: false,
      created_by: userId,
    });
    if (!error) {
      await fetchPresensiSessions();
      setShowSessionForm(false);
      setSessionForm({
        pertemuan: presensiSessions.length + 2,
        tanggal: new Date().toISOString().split("T")[0],
        waktu_mulai: "08:00",
        waktu_selesai: "10:00",
      });
    }
  };

  const handleSelectSession = async (session: PresensiSession) => {
    setSelectedSession(session);
    if (role === "mahasiswa") {
      await fetchMyPresensi(session.id, userId);
    } else {
      await fetchPresensiList(session.id);
    }
  };

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

  const handleEditPresensi = async (presensiId: string, status: string) => {
    await supabase.from("presensi").update({ status }).eq("id", presensiId);
    if (selectedSession) await fetchPresensiList(selectedSession.id);
  };

  const handleCreatePost = async () => {
    const { error } = await supabase.from("post").insert({
      matakuliah_id: matakuliahId,
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
      await fetchPosts();
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

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    // Delete submissions first if it's a tugas
    if (postToDelete.jenis === "tugas") {
      await supabase
        .from("tugas_submission")
        .delete()
        .eq("post_id", postToDelete.id);
    }

    // Delete the post
    const { error } = await supabase
      .from("post")
      .delete()
      .eq("id", postToDelete.id);

    if (!error) {
      await fetchPosts();
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      // Clear selected post if it was deleted
      if (selectedPost?.id === postToDelete.id) {
        setSelectedPost(null);
      }
    } else {
      alert("Gagal menghapus post: " + error.message);
    }
  };

  const confirmDeletePost = (post: Post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#7a1d38] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  if (!matakuliah) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-gray-600 text-lg mb-4">Kelas tidak ditemukan.</p>
          <button
            onClick={() => router.push("/list-kelas")}
            className="px-6 py-3 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md"
          >
            ← Kembali ke Jadwal
          </button>
        </div>
      </div>
    );
  }

  const jam =
    matakuliah.jam_mulai && matakuliah.jam_selesai
      ? `${matakuliah.jam_mulai} - ${matakuliah.jam_selesai}`
      : "Belum Diatur";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7a1d38] to-[#5c1529] px-8 py-6 text-white">
        <button
          onClick={() => router.push("/list-kelas")}
          className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Jadwal
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
                {matakuliah.kode_mk}
              </span>
              <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
                {matakuliah.sks} SKS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {matakuliah.nama_mk}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 mt-2 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                  👤
                </span>
                {matakuliah.profiles?.username || "Dosen"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                  📅
                </span>
                {matakuliah.hari || "Belum Diatur"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                  🕐
                </span>
                {jam}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">
                  📍
                </span>
                {matakuliah.ruangan || "TBA"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setActiveTab("presensi")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "presensi"
                ? "bg-white text-[#7a1d38] shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            ✅ Presensi
          </button>
          <button
            onClick={() => setActiveTab("materi")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "materi"
                ? "bg-white text-[#7a1d38] shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            📚 Materi & Tugas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* ========== TAB PRESENSI ========== */}
        {activeTab === "presensi" && (
          <div className="space-y-6">
            {/* Dosen: Tombol Buat Sesi */}
            {role !== "mahasiswa" && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Sesi Presensi
                </h2>
                <button
                  onClick={() => setShowSessionForm(true)}
                  className="bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white px-5 py-2.5 rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] flex items-center gap-2 shadow-md transition-all"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Buat Sesi Presensi
                </button>
              </div>
            )}

            {/* Daftar Sesi */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {presensiSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSession?.id === session.id
                      ? "border-[#7a1d38] bg-[#fdf2f4] shadow-md"
                      : "border-gray-200 bg-white hover:border-[#7a1d38]/40 hover:shadow"
                  }`}
                >
                  <p className="font-bold text-gray-900">
                    Pertemuan {session.pertemuan}
                  </p>
                  <p className="text-sm text-gray-500">{session.tanggal}</p>
                  <p className="text-xs text-gray-400">
                    {session.waktu_mulai} - {session.waktu_selesai}
                  </p>
                  {session.is_active && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      🟢 Aktif
                    </span>
                  )}
                </div>
              ))}
              {presensiSessions.length === 0 && (
                <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
                  Belum ada sesi presensi.
                </div>
              )}
            </div>

            {/* Detail Sesi */}
            {selectedSession && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      Presensi Pertemuan {selectedSession.pertemuan}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {selectedSession.tanggal} • {selectedSession.waktu_mulai}{" "}
                      - {selectedSession.waktu_selesai}
                    </p>
                  </div>
                  <div className="text-right">
                    {isSessionActive(selectedSession) ? (
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium text-sm">
                        🟢 Presensi Aktif
                      </div>
                    ) : isSessionClosed(selectedSession) ? (
                      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium text-sm">
                        🔒 Presensi Ditutup
                      </div>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-medium text-sm">
                        ⏳ Menunggu Waktu Mulai
                      </div>
                    )}
                  </div>
                </div>

                {/* Mahasiswa: Pilih Status */}
                {role === "mahasiswa" && (
                  <div>
                    {!isSessionActive(selectedSession) && !isSessionClosed(selectedSession) ? (
                      <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-100">
                        <span className="text-4xl block mb-2">⏳</span>
                        <p className="text-yellow-700 font-medium">
                          Presensi akan dibuka otomatis pada pukul {selectedSession.waktu_mulai}
                        </p>
                        <p className="text-yellow-600 text-sm mt-2">
                          Jangan lupa untuk presensi, karena akan ditutup setelah 15 menit dari awal dibuka.
                        </p>
                      </div>
                    ) : isSessionClosed(selectedSession) ? (
                      <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                        <span className="text-4xl block mb-2">🔒</span>
                        <p className="text-red-600 font-medium">
                          Presensi sudah ditutup.
                        </p>
                        {myPresensi ? (
                          <p className="text-red-500 text-sm mt-2">
                            ✅ Anda sudah presensi: {myPresensi.status.toUpperCase()}
                          </p>
                        ) : (
                          <p className="text-red-500 text-sm mt-2">
                            Anda tidak presensi untuk pertemuan ini.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100">
                          <p className="text-green-700 font-medium text-center">
                            🟢 Presensi Aktif - Silakan pilih status kehadiran Anda
                          </p>
                        </div>
                        <p className="mb-4 text-gray-600 font-medium">
                          Pilih status kehadiran Anda:
                        </p>
                        <div className="flex gap-4 flex-wrap">
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleMahasiswaPresensi(opt.value)}
                              className={`px-6 py-4 rounded-xl font-medium transition flex items-center gap-2 ${
                                myPresensi?.status === opt.value
                                  ? opt.color +
                                    " ring-2 ring-offset-2 ring-[#7a1d38] shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <span className="text-xl">{opt.icon}</span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        {myPresensi && (
                          <p className="mt-4 text-sm text-gray-500 bg-gray-50 inline-block px-4 py-2 rounded-lg">
                            ✅ Tercatat:{" "}
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
                      <thead className="bg-[#fdf2f4] rounded-t-xl">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#7a1d38] rounded-tl-xl">
                            No
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#7a1d38]">
                            NIM
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#7a1d38]">
                            Nama
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-[#7a1d38] rounded-tr-xl">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {presensiList.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 text-gray-600 font-mono">
                              {p.profiles?.nim || "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-medium">
                              {p.profiles?.username || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <select
                                value={p.status}
                                onChange={(e) =>
                                  handleEditPresensi(p.id, e.target.value)
                                }
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 ${
                                  STATUS_OPTIONS.find(
                                    (s) => s.value === p.status
                                  )?.color
                                }`}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
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
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              Belum ada data presensi mahasiswa.
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daftar Post */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Daftar Materi & Tugas
                </h2>
                {role !== "mahasiswa" && (
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white p-2.5 rounded-xl hover:from-[#5c1529] hover:to-[#7a1d38] shadow-md transition-all"
                    title="Tambah Materi/Tugas"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative group ${
                      selectedPost?.id === post.id
                        ? "border-[#7a1d38] bg-[#fdf2f4] shadow-md"
                        : "border-gray-200 bg-white hover:border-[#7a1d38]/40 hover:shadow"
                    }`}
                  >
                    <div onClick={() => handleSelectPost(post)}>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            post.jenis === "tugas"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-[#fdf2f4] text-[#7a1d38]"
                          }`}
                        >
                          {post.jenis === "tugas" ? "📝 Tugas" : "📖 Materi"}
                        </span>
                        <span className="text-gray-400 text-xs">
                          P{post.pertemuan}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 line-clamp-1">
                        {post.judul}
                      </h4>
                      {post.jenis === "tugas" && post.deadline && (
                        <p className="text-xs text-red-500 mt-1">
                          ⏰ {new Date(post.deadline).toLocaleDateString("id-ID")}
                        </p>
                      )}
                    </div>
                    {role !== "mahasiswa" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeletePost(post);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center text-gray-500 border-2 border-dashed border-gray-200">
                    Belum ada materi atau tugas.
                  </div>
                )}
              </div>
            </div>

            {/* Detail Post */}
            <div className="lg:col-span-2">
              {selectedPost ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        selectedPost.jenis === "tugas"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-[#fdf2f4] text-[#7a1d38]"
                      }`}
                    >
                      {selectedPost.jenis === "tugas"
                        ? "📝 Tugas"
                        : "📖 Materi"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Pertemuan {selectedPost.pertemuan}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedPost.judul}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap mb-4 leading-relaxed">
                    {selectedPost.deskripsi}
                  </p>

                  {selectedPost.link && (
                    <a
                      href={selectedPost.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#fdf2f4] text-[#7a1d38] px-4 py-2 rounded-lg hover:bg-[#fce7ea] transition mb-4"
                    >
                      🔗 Buka Link Materi/File
                    </a>
                  )}

                  {selectedPost.jenis === "tugas" && selectedPost.deadline && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                      <p className="text-red-600 font-medium">
                        ⏰ Deadline:{" "}
                        {new Date(selectedPost.deadline).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  )}

                  {/* Mahasiswa: Submit Tugas */}
                  {role === "mahasiswa" && selectedPost.jenis === "tugas" && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">
                        📤 Pengumpulan Tugas
                      </h4>
                      {mySubmission ? (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="font-medium text-green-600 mb-3">
                            ✅ Tugas Sudah Dikumpulkan
                          </p>
                          {mySubmission.jawaban_text && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-500">Jawaban:</p>
                              <p className="text-gray-700">
                                {mySubmission.jawaban_text}
                              </p>
                            </div>
                          )}
                          {mySubmission.jawaban_link && (
                            <a
                              href={mySubmission.jawaban_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#7a1d38] hover:underline"
                            >
                              🔗 Lihat File
                            </a>
                          )}
                          {mySubmission.nilai !== null && (
                            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                              <p className="font-bold text-green-700 text-lg">
                                Nilai: {mySubmission.nilai}
                              </p>
                              {mySubmission.feedback && (
                                <p className="text-sm text-green-600 mt-1">
                                  💬 {mySubmission.feedback}
                                </p>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setSubmitForm({
                                jawaban_text: mySubmission.jawaban_text || "",
                                jawaban_link: mySubmission.jawaban_link || "",
                              });
                              setShowSubmitForm(true);
                            }}
                            className="mt-4 text-[#7a1d38] hover:underline text-sm font-medium"
                          >
                            ✏️ Edit Jawaban
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowSubmitForm(true)}
                          className="bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white px-6 py-3 rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md"
                        >
                          📤 Kumpulkan Tugas
                        </button>
                      )}
                    </div>
                  )}

                  {/* Dosen: Lihat Submissions */}
                  {role !== "mahasiswa" && selectedPost.jenis === "tugas" && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4">
                        📋 Jawaban Mahasiswa ({submissions.length})
                      </h4>
                      <div className="space-y-4">
                        {submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-[#fdf2f4] p-4 rounded-xl"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {sub.profiles?.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                  NIM: {sub.profiles?.nim}
                                </p>
                              </div>
                              <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg">
                                {new Date(sub.submitted_at).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                            {sub.jawaban_text && (
                              <p className="text-sm text-gray-600 mb-2 bg-white p-3 rounded-lg">
                                {sub.jawaban_text}
                              </p>
                            )}
                            {sub.jawaban_link && (
                              <a
                                href={sub.jawaban_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#7a1d38] hover:underline inline-block mb-3"
                              >
                                🔗 Lihat File
                              </a>
                            )}
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f9d0d9]">
                              <input
                                type="number"
                                placeholder="Nilai"
                                defaultValue={sub.nilai || ""}
                                min="0"
                                max="100"
                                className="w-20 px-3 py-2 border rounded-lg text-sm"
                                id={`nilai-${sub.id}`}
                              />
                              <input
                                type="text"
                                placeholder="Feedback (opsional)"
                                defaultValue={sub.feedback || ""}
                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
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
                                className="px-4 py-2 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-lg text-sm font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all"
                              >
                                💾 Simpan
                              </button>
                            </div>
                          </div>
                        ))}
                        {submissions.length === 0 && (
                          <p className="text-gray-500 text-center py-8 bg-[#fdf2f4] rounded-xl">
                            Belum ada yang mengumpulkan tugas.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <span className="text-5xl block mb-4">📚</span>
                  <p className="text-gray-500">
                    Pilih materi atau tugas untuk melihat detail.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== FORM MODALS ==================== */}

      {/* Form Buat Sesi Presensi */}
      {showSessionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Buat Sesi Presensi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={sessionForm.tanggal}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, tanggal: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowSessionForm(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSession}
                className="px-5 py-2.5 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Buat Post */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Buat Materi / Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                >
                  <option value="materi">📖 Materi</option>
                  <option value="tugas">📝 Tugas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={postForm.judul}
                  onChange={(e) =>
                    setPostForm({ ...postForm, judul: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  placeholder="Judul materi/tugas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={postForm.deskripsi}
                  onChange={(e) =>
                    setPostForm({ ...postForm, deskripsi: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  rows={4}
                  placeholder="Deskripsi atau instruksi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Google Drive, dll)
                </label>
                <input
                  type="url"
                  value={postForm.link}
                  onChange={(e) =>
                    setPostForm({ ...postForm, link: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              {postForm.jenis === "tugas" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={postForm.deadline}
                    onChange={(e) =>
                      setPostForm({ ...postForm, deadline: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowPostForm(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePost}
                className="px-5 py-2.5 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Submit Tugas */}
      {showSubmitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Kumpulkan Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  rows={4}
                  placeholder="Tulis jawaban di sini..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7a1d38] focus:border-transparent transition-all"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload file ke Google Drive lalu paste linknya di sini
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitForm(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitTugas}
                className="px-5 py-2.5 bg-gradient-to-r from-[#7a1d38] to-[#9e2a4a] text-white rounded-xl font-medium hover:from-[#5c1529] hover:to-[#7a1d38] transition-all shadow-md"
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {showDeleteConfirm && postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Hapus {postToDelete.jenis === "tugas" ? "Tugas" : "Materi"}?
                </h3>
                <p className="text-sm text-gray-500">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    postToDelete.jenis === "tugas"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[#fdf2f4] text-[#7a1d38]"
                  }`}
                >
                  {postToDelete.jenis === "tugas" ? "📝 Tugas" : "📖 Materi"}
                </span>
                <span className="text-gray-400 text-xs">P{postToDelete.pertemuan}</span>
              </div>
              <p className="font-semibold text-gray-900">{postToDelete.judul}</p>
              {postToDelete.jenis === "tugas" && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Semua submission mahasiswa akan ikut terhapus
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPostToDelete(null);
                }}
                className="flex-1 px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-md"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
