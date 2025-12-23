"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import "./globals.css";

interface DashboardStats {
  totalSKS: number;
  totalMataKuliah: number;
  ipk: number;
  totalKehadiran: number;
  persentaseKehadiran: number;
  tugasBelumDikumpulkan: number;
  tugasSudahDikumpulkan: number;
}

interface KelasHariIni {
  id: string;
  nama_mk: string;
  kode_mk: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string;
  dosen?: string;
}

interface TugasDeadline {
  id: string;
  judul: string;
  nama_mk: string;
  deadline: string;
  sudahDikumpulkan: boolean;
}

interface RecentActivity {
  id: string;
  type: "tugas" | "materi" | "presensi" | "nilai";
  title: string;
  subtitle: string;
  time: string;
  status?: "success" | "new" | "info" | "warning";
}

// Dosen Stats Interface
interface DosenStats {
  totalMataKuliah: number;
  totalMahasiswa: number;
  totalPresensiSession: number;
  totalTugas: number;
  tugasBelumDinilai: number;
}

// Kaprodi Stats Interface
interface KaprodiStats {
  totalMahasiswa: number;
  totalDosen: number;
  totalMataKuliah: number;
  krsPending: number;
  krsApproved: number;
  krsRejected: number;
}

interface KRSPending {
  id: string;
  mahasiswa_name: string;
  nim: string;
  created_at: string;
  total_sks: number;
}

interface DosenKelas {
  id: string;
  nama_mk: string;
  kode_mk: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string;
  jumlah_mahasiswa: number;
}

interface RecentPost {
  id: string;
  judul: string;
  jenis: string;
  nama_mk: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalSKS: 0,
    totalMataKuliah: 0,
    ipk: 0,
    totalKehadiran: 0,
    persentaseKehadiran: 0,
    tugasBelumDikumpulkan: 0,
    tugasSudahDikumpulkan: 0,
  });

  // Data lists
  const [kelasHariIni, setKelasHariIni] = useState<KelasHariIni[]>([]);
  const [tugasDeadline, setTugasDeadline] = useState<TugasDeadline[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [krsStatus, setKrsStatus] = useState<string | null>(null);

  // Dosen specific states
  const [dosenStats, setDosenStats] = useState<DosenStats>({
    totalMataKuliah: 0,
    totalMahasiswa: 0,
    totalPresensiSession: 0,
    totalTugas: 0,
    tugasBelumDinilai: 0,
  });
  const [dosenKelasHariIni, setDosenKelasHariIni] = useState<DosenKelas[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  // Kaprodi specific states
  const [kaprodiStats, setKaprodiStats] = useState<KaprodiStats>({
    totalMahasiswa: 0,
    totalDosen: 0,
    totalMataKuliah: 0,
    krsPending: 0,
    krsApproved: 0,
    krsRejected: 0,
  });
  const [krsPendingList, setKrsPendingList] = useState<KRSPending[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem("user_role");
    const userEmail = localStorage.getItem("user_email");
    const storedUserId = localStorage.getItem("user_id");

    if (!userRole) {
      router.push("/login");
      return;
    }

    setRole(userRole);
    setUserId(storedUserId || "");
    setUserName(userEmail?.split("@")[0] || "User");

    // Fetch dashboard data
    if (storedUserId && userRole === "student") {
      fetchDashboardData(storedUserId);
    } else if (storedUserId && userRole === "dosen") {
      fetchDosenDashboardData(storedUserId);
    } else if (storedUserId && userRole === "kaprodi") {
      fetchKaprodiDashboardData(storedUserId);
    } else {
      setLoading(false);
    }
  }, [router]);

  const fetchDashboardData = async (uid: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMahasiswaStats(uid),
        fetchKelasHariIni(uid),
        fetchTugasDeadline(uid),
        fetchRecentActivities(uid),
        fetchKRSStatus(uid),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats for Mahasiswa
  const fetchMahasiswaStats = async (uid: string) => {
    try {
      // Get enrolled courses (matakuliah_diambil)
      const { data: enrolled } = await supabase
        .from("matakuliah_diambil")
        .select(
          `
          *,
          matakuliah:matakuliah_id (id, kode_mk, nama_mk, sks)
        `
        )
        .eq("mahasiswa_id", uid);

      const totalSKS =
        enrolled?.reduce((sum, e) => sum + (e.matakuliah?.sks || 0), 0) || 0;
      const totalMK = enrolled?.length || 0;

      // Calculate IPK from nilai_angka
      const nilaiList =
        enrolled
          ?.filter((e) => e.nilai_angka != null)
          .map((e) => e.nilai_angka) || [];
      const ipk =
        nilaiList.length > 0
          ? nilaiList.reduce((sum, n) => sum + n, 0) / nilaiList.length
          : 0;

      // Get attendance stats
      const { data: presensi } = await supabase
        .from("presensi")
        .select("status")
        .eq("mahasiswa_id", uid);

      const totalPresensi = presensi?.length || 0;
      const hadir = presensi?.filter((p) => p.status === "hadir").length || 0;
      const persentaseKehadiran =
        totalPresensi > 0 ? Math.round((hadir / totalPresensi) * 100) : 100;

      // Get tugas stats
      const mkIds = enrolled?.map((e) => e.matakuliah_id).filter(Boolean) || [];

      let tugasBelum = 0;
      let tugasSudah = 0;

      if (mkIds.length > 0) {
        const { data: tugasList } = await supabase
          .from("post")
          .select("id")
          .eq("jenis", "tugas")
          .in("matakuliah_id", mkIds);

        const tugasIds = tugasList?.map((t) => t.id) || [];

        if (tugasIds.length > 0) {
          const { data: submissions } = await supabase
            .from("tugas_submission")
            .select("post_id")
            .eq("mahasiswa_id", uid)
            .in("post_id", tugasIds);

          tugasSudah = submissions?.length || 0;
          tugasBelum = tugasIds.length - tugasSudah;
        }
      }

      setStats({
        totalSKS,
        totalMataKuliah: totalMK,
        ipk: parseFloat(ipk.toFixed(2)),
        totalKehadiran: hadir,
        persentaseKehadiran,
        tugasBelumDikumpulkan: tugasBelum,
        tugasSudahDikumpulkan: tugasSudah,
      });
    } catch (error) {
      console.error("Error fetching mahasiswa stats:", error);
    }
  };

  // Fetch classes for today
  const fetchKelasHariIni = async (uid: string) => {
    try {
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const today = days[new Date().getDay()];

      // Get enrolled courses
      const { data: enrolled } = await supabase
        .from("matakuliah_diambil")
        .select("matakuliah_id")
        .eq("mahasiswa_id", uid);

      const enrolledIds = enrolled?.map((e) => e.matakuliah_id) || [];

      if (enrolledIds.length === 0) {
        setKelasHariIni([]);
        return;
      }

      const { data } = await supabase
        .from("matakuliah")
        .select(
          `
          id,
          kode_mk,
          nama_mk,
          jam_mulai,
          jam_selesai,
          ruangan,
          hari,
          profiles:dosen_id (username)
        `
        )
        .eq("hari", today)
        .in("id", enrolledIds)
        .order("jam_mulai", { ascending: true });

      setKelasHariIni(
        (data || []).map((mk) => ({
          id: mk.id.toString(),
          nama_mk: mk.nama_mk || "",
          kode_mk: mk.kode_mk || "",
          jam_mulai: mk.jam_mulai || "",
          jam_selesai: mk.jam_selesai || "",
          ruangan: mk.ruangan || "-",
          dosen: (mk.profiles as any)?.username || "-",
        }))
      );
    } catch (error) {
      console.error("Error fetching kelas hari ini:", error);
    }
  };

  // Fetch upcoming tugas deadlines
  const fetchTugasDeadline = async (uid: string) => {
    try {
      // Get enrolled courses
      const { data: enrolled } = await supabase
        .from("matakuliah_diambil")
        .select("matakuliah_id")
        .eq("mahasiswa_id", uid);

      const mkIds = enrolled?.map((e) => e.matakuliah_id).filter(Boolean) || [];

      if (mkIds.length === 0) {
        setTugasDeadline([]);
        return;
      }

      // Get tugas with deadlines
      const { data: tugasList } = await supabase
        .from("post")
        .select(
          `
          id,
          judul,
          deadline,
          matakuliah:matakuliah_id (nama_mk)
        `
        )
        .eq("jenis", "tugas")
        .in("matakuliah_id", mkIds)
        .gte("deadline", new Date().toISOString())
        .order("deadline", { ascending: true })
        .limit(5);

      // Check which ones are already submitted
      const tugasIds = tugasList?.map((t) => t.id) || [];

      if (tugasIds.length > 0) {
        const { data: submissions } = await supabase
          .from("tugas_submission")
          .select("post_id")
          .eq("mahasiswa_id", uid)
          .in("post_id", tugasIds);

        const submittedIds = submissions?.map((s) => s.post_id) || [];

        setTugasDeadline(
          (tugasList || []).map((t) => ({
            id: t.id,
            judul: t.judul,
            nama_mk: (t.matakuliah as any)?.nama_mk || "",
            deadline: t.deadline,
            sudahDikumpulkan: submittedIds.includes(t.id),
          }))
        );
      } else {
        setTugasDeadline([]);
      }
    } catch (error) {
      console.error("Error fetching tugas deadline:", error);
    }
  };

  // Fetch KRS status
  const fetchKRSStatus = async (uid: string) => {
    try {
      const { data } = await supabase
        .from("krs_pengajuan")
        .select("status")
        .eq("mahasiswa_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setKrsStatus(data?.status || null);
    } catch (error) {
      // No KRS found
      setKrsStatus(null);
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async (uid: string) => {
    const activities: RecentActivity[] = [];

    try {
      // Get recent submissions
      const { data: submissions } = await supabase
        .from("tugas_submission")
        .select(
          `
          id,
          submitted_at,
          post:post_id (judul)
        `
        )
        .eq("mahasiswa_id", uid)
        .order("submitted_at", { ascending: false })
        .limit(3);

      submissions?.forEach((s) => {
        activities.push({
          id: s.id,
          type: "tugas",
          title: `Tugas "${(s.post as any)?.judul || "Unknown"}" dikumpulkan`,
          subtitle: formatTimeAgo(s.submitted_at),
          time: s.submitted_at,
          status: "success",
        });
      });

      // Get recent presensi
      const { data: presensi } = await supabase
        .from("presensi")
        .select(
          `
          id,
          status,
          created_at,
          presensi_session:presensi_session_id (
            pertemuan,
            matakuliah:matakuliah_id (nama_mk)
          )
        `
        )
        .eq("mahasiswa_id", uid)
        .order("created_at", { ascending: false })
        .limit(3);

      presensi?.forEach((p) => {
        const session = p.presensi_session as any;
        activities.push({
          id: p.id,
          type: "presensi",
          title: `Presensi ${session?.matakuliah?.nama_mk || ""} - Pertemuan ${
            session?.pertemuan || ""
          }`,
          subtitle: formatTimeAgo(p.created_at),
          time: p.created_at,
          status: p.status === "hadir" ? "success" : "warning",
        });
      });

      // Sort by time
      activities.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  // ============ DOSEN DASHBOARD FUNCTIONS ============
  const fetchDosenDashboardData = async (uid: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDosenStats(uid),
        fetchDosenKelasHariIni(uid),
        fetchRecentPosts(uid),
        fetchDosenActivities(uid),
      ]);
    } catch (error) {
      console.error("Error fetching dosen dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDosenStats = async (uid: string) => {
    try {
      // Get courses taught by this dosen
      const { data: courses } = await supabase
        .from("matakuliah")
        .select("id")
        .eq("dosen_id", uid);

      const courseIds = courses?.map((c) => c.id) || [];
      const totalMK = courseIds.length;

      let totalMahasiswa = 0;
      let totalPresensiSession = 0;
      let totalTugas = 0;
      let tugasBelumDinilai = 0;

      if (courseIds.length > 0) {
        // Get total enrolled students
        const { data: enrollments } = await supabase
          .from("matakuliah_diambil")
          .select("mahasiswa_id")
          .in("matakuliah_id", courseIds);

        const uniqueStudents = new Set(
          enrollments?.map((e) => e.mahasiswa_id) || []
        );
        totalMahasiswa = uniqueStudents.size;

        // Get total presensi sessions
        const { data: sessions } = await supabase
          .from("presensi_session")
          .select("id")
          .in("matakuliah_id", courseIds);

        totalPresensiSession = sessions?.length || 0;

        // Get tugas stats
        const { data: tugasList } = await supabase
          .from("post")
          .select("id")
          .eq("jenis", "tugas")
          .in("matakuliah_id", courseIds);

        totalTugas = tugasList?.length || 0;

        if (tugasList && tugasList.length > 0) {
          const tugasIds = tugasList.map((t) => t.id);

          // Get submissions without nilai
          const { data: ungraded } = await supabase
            .from("tugas_submission")
            .select("id")
            .in("post_id", tugasIds)
            .is("nilai", null);

          tugasBelumDinilai = ungraded?.length || 0;
        }
      }

      setDosenStats({
        totalMataKuliah: totalMK,
        totalMahasiswa,
        totalPresensiSession,
        totalTugas,
        tugasBelumDinilai,
      });
    } catch (error) {
      console.error("Error fetching dosen stats:", error);
    }
  };

  const fetchDosenKelasHariIni = async (uid: string) => {
    try {
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const today = days[new Date().getDay()];

      const { data } = await supabase
        .from("matakuliah")
        .select(
          `
          id,
          kode_mk,
          nama_mk,
          jam_mulai,
          jam_selesai,
          ruangan,
          hari
        `
        )
        .eq("dosen_id", uid)
        .eq("hari", today)
        .order("jam_mulai", { ascending: true });

      if (data && data.length > 0) {
        // Get student count for each class
        const courseIds = data.map((d) => d.id);
        const { data: enrollments } = await supabase
          .from("matakuliah_diambil")
          .select("matakuliah_id")
          .in("matakuliah_id", courseIds);

        const countMap: Record<string, number> = {};
        enrollments?.forEach((e) => {
          countMap[e.matakuliah_id] = (countMap[e.matakuliah_id] || 0) + 1;
        });

        setDosenKelasHariIni(
          data.map((mk) => ({
            id: mk.id.toString(),
            nama_mk: mk.nama_mk || "",
            kode_mk: mk.kode_mk || "",
            jam_mulai: mk.jam_mulai || "",
            jam_selesai: mk.jam_selesai || "",
            ruangan: mk.ruangan || "-",
            jumlah_mahasiswa: countMap[mk.id] || 0,
          }))
        );
      } else {
        setDosenKelasHariIni([]);
      }
    } catch (error) {
      console.error("Error fetching dosen kelas hari ini:", error);
    }
  };

  const fetchRecentPosts = async (uid: string) => {
    try {
      const { data } = await supabase
        .from("post")
        .select(
          `
          id,
          judul,
          jenis,
          created_at,
          matakuliah:matakuliah_id (nama_mk)
        `
        )
        .eq("author_id", uid)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentPosts(
        (data || []).map((p) => ({
          id: p.id,
          judul: p.judul,
          jenis: p.jenis,
          nama_mk: (p.matakuliah as any)?.nama_mk || "",
          created_at: p.created_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };

  const fetchDosenActivities = async (uid: string) => {
    const activities: RecentActivity[] = [];

    try {
      // Get courses
      const { data: courses } = await supabase
        .from("matakuliah")
        .select("id")
        .eq("dosen_id", uid);

      const courseIds = courses?.map((c) => c.id) || [];

      if (courseIds.length > 0) {
        // Get recent tugas submissions to dosen's courses
        const { data: tugasList } = await supabase
          .from("post")
          .select("id, judul")
          .eq("jenis", "tugas")
          .in("matakuliah_id", courseIds);

        const tugasIds = tugasList?.map((t) => t.id) || [];
        const tugasMap = new Map(tugasList?.map((t) => [t.id, t.judul]) || []);

        if (tugasIds.length > 0) {
          const { data: submissions } = await supabase
            .from("tugas_submission")
            .select(
              `
              id,
              submitted_at,
              post_id,
              profiles:mahasiswa_id (username)
            `
            )
            .in("post_id", tugasIds)
            .order("submitted_at", { ascending: false })
            .limit(5);

          submissions?.forEach((s) => {
            activities.push({
              id: s.id,
              type: "tugas",
              title: `${
                (s.profiles as any)?.username || "Mahasiswa"
              } mengumpulkan tugas`,
              subtitle: `${
                tugasMap.get(s.post_id) || "Tugas"
              } • ${formatTimeAgo(s.submitted_at)}`,
              time: s.submitted_at,
              status: "new",
            });
          });
        }

        // Get recent presensi sessions created
        const { data: sessions } = await supabase
          .from("presensi_session")
          .select(
            `
            id,
            pertemuan,
            created_at,
            matakuliah:matakuliah_id (nama_mk)
          `
          )
          .in("matakuliah_id", courseIds)
          .order("created_at", { ascending: false })
          .limit(3);

        sessions?.forEach((s) => {
          activities.push({
            id: s.id,
            type: "presensi",
            title: `Presensi Pertemuan ${s.pertemuan}`,
            subtitle: `${
              (s.matakuliah as any)?.nama_mk || ""
            } • ${formatTimeAgo(s.created_at)}`,
            time: s.created_at,
            status: "info",
          });
        });
      }

      activities.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dosen activities:", error);
    }
  };

  // ============ KAPRODI DASHBOARD FUNCTIONS ============
  const fetchKaprodiDashboardData = async (uid: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchKaprodiStats(),
        fetchKRSPendingList(),
        fetchRecentUsersKaprodi(),
      ]);
    } catch (error) {
      console.error("Error fetching kaprodi dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKaprodiStats = async () => {
    try {
      // Get total mahasiswa
      const { data: mahasiswa } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "student");

      const totalMahasiswa = mahasiswa?.length || 0;

      // Get total dosen
      const { data: dosen } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "dosen");

      const totalDosen = dosen?.length || 0;

      // Get total matakuliah
      const { data: matakuliah } = await supabase
        .from("matakuliah")
        .select("id");

      const totalMataKuliah = matakuliah?.length || 0;

      // Get KRS stats
      const { data: krsData } = await supabase
        .from("krs_pengajuan")
        .select("status");

      const krsPending =
        krsData?.filter((k) => k.status === "pending").length || 0;
      const krsApproved =
        krsData?.filter((k) => k.status === "approved").length || 0;
      const krsRejected =
        krsData?.filter((k) => k.status === "rejected").length || 0;

      setKaprodiStats({
        totalMahasiswa,
        totalDosen,
        totalMataKuliah,
        krsPending,
        krsApproved,
        krsRejected,
      });
    } catch (error) {
      console.error("Error fetching kaprodi stats:", error);
    }
  };

  const fetchKRSPendingList = async () => {
    try {
      const { data } = await supabase
        .from("krs_pengajuan")
        .select(
          `
          id,
          created_at,
          total_sks,
          profiles:mahasiswa_id (username, nim)
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      setKrsPendingList(
        (data || []).map((k) => ({
          id: k.id,
          mahasiswa_name: (k.profiles as any)?.username || "Unknown",
          nim: (k.profiles as any)?.nim?.toString() || "-",
          created_at: k.created_at,
          total_sks: k.total_sks || 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching KRS pending list:", error);
    }
  };

  const fetchRecentUsersKaprodi = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, role, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentUsers(data || []);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  const formatTime = (time: string) => {
    if (!time) return "-";
    return time.substring(0, 5);
  };

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMs < 0) return "Lewat deadline";
    if (diffHours < 24) return `${diffHours} jam lagi`;
    if (diffDays === 1) return "Besok";
    if (diffDays < 7) return `${diffDays} hari lagi`;
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  const getPredikat = (ipk: number) => {
    if (ipk >= 3.5) return "Cum Laude";
    if (ipk >= 3.0) return "Sangat Memuaskan";
    if (ipk >= 2.5) return "Memuaskan";
    if (ipk >= 2.0) return "Cukup";
    return "Kurang";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "tugas":
        return "📝";
      case "materi":
        return "📖";
      case "presensi":
        return "✅";
      case "nilai":
        return "📊";
      default:
        return "📌";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "new":
        return "bg-[#fdf2f4] text-[#7a1d38]";
      case "warning":
        return "bg-amber-100 text-amber-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "success":
        return "Sukses";
      case "new":
        return "Baru";
      case "warning":
        return "Perhatian";
      case "info":
        return "Info";
      default:
        return "";
    }
  };

  const getKRSStatusBadge = () => {
    switch (krsStatus) {
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Disetujui",
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          label: "Menunggu",
        };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Belum Ajukan",
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#7a1d38] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // ============ DOSEN DASHBOARD ============
  if (role === "dosen") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👨‍🏫</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Selamat datang,</p>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {userName}
                  </h1>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fdf2f4] text-[#7a1d38] border border-[#f9d0d9]">
                  Dosen
                </span>
              </div>
            </div>
            <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Hari ini
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </p>
              <p className="text-sm text-[#7a1d38] font-medium mt-1">
                Semester Ganjil 2024/2025
              </p>
            </div>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Mata Kuliah */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Mata Kuliah Diampu
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dosenStats.totalMataKuliah}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">📚</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Mata kuliah semester ini
            </p>
          </div>

          {/* Total Mahasiswa */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Total Mahasiswa
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dosenStats.totalMahasiswa}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Mahasiswa terdaftar di kelas Anda
            </p>
          </div>

          {/* Presensi Sessions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Sesi Presensi
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dosenStats.totalPresensiSession}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Presensi yang telah dibuat
            </p>
          </div>

          {/* Tugas */}
          <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  Tugas
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {dosenStats.totalTugas}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">📝</span>
              </div>
            </div>
            <p className="text-xs text-white/80 mt-4">
              {dosenStats.tugasBelumDinilai > 0 ? (
                <span>
                  ⚠️ {dosenStats.tugasBelumDinilai} tugas belum dinilai
                </span>
              ) : (
                <span>✓ Semua tugas sudah dinilai</span>
              )}
            </p>
          </div>
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jadwal Mengajar Hari Ini */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                    📅
                  </span>
                  Jadwal Mengajar Hari Ini
                </h2>
                <Link
                  href="/list-kelas"
                  className="text-sm text-[#7a1d38] hover:underline font-medium"
                >
                  Lihat Semua
                </Link>
              </div>

              {dosenKelasHariIni.length > 0 ? (
                <div className="space-y-3">
                  {dosenKelasHariIni.map((kelas, idx) => (
                    <Link
                      href={`/kelas/${kelas.id}`}
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors cursor-pointer"
                    >
                      <div className="w-16 text-center">
                        <p className="text-lg font-bold text-[#7a1d38]">
                          {formatTime(kelas.jam_mulai)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(kelas.jam_selesai)}
                        </p>
                      </div>
                      <div className="w-0.5 h-12 bg-[#7a1d38]/20 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {kelas.nama_mk}
                        </p>
                        <p className="text-sm text-gray-500">
                          {kelas.kode_mk} • {kelas.ruangan}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        {kelas.jumlah_mahasiswa} mahasiswa
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🎉</span>
                  <p>Tidak ada jadwal mengajar hari ini</p>
                </div>
              )}
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                    📋
                  </span>
                  Aktivitas Terbaru
                </h2>
              </div>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors"
                    >
                      <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span>{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.subtitle}
                        </p>
                      </div>
                      {activity.status && (
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusBadge(
                            activity.status
                          )}`}
                        >
                          {getStatusLabel(activity.status)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">📭</span>
                  <p>Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                      📄
                    </span>
                    Postingan Terbaru
                  </h2>
                </div>
                <div className="space-y-3">
                  {recentPosts.map((post, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          post.jenis === "tugas"
                            ? "bg-amber-100"
                            : post.jenis === "materi"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <span>
                          {post.jenis === "tugas"
                            ? "📝"
                            : post.jenis === "materi"
                            ? "📖"
                            : "📢"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {post.judul}
                        </p>
                        <p className="text-sm text-gray-500">
                          {post.nama_mk} • {formatTimeAgo(post.created_at)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                          post.jenis === "tugas"
                            ? "bg-amber-100 text-amber-700"
                            : post.jenis === "materi"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {post.jenis}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                  🚀
                </span>
                Akses Cepat
              </h2>
              <div className="space-y-2">
                <Link
                  href="/list-kelas"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">📅</span>
                  <span className="flex-1">Kelas Saya</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/manage-user"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">👥</span>
                  <span className="flex-1">Daftar Mahasiswa</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/profil"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">👤</span>
                  <span className="flex-1">Profil Saya</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">💡 Tips</h3>
              <p className="text-white/80 text-sm">
                {dosenStats.tugasBelumDinilai > 0
                  ? `Ada ${dosenStats.tugasBelumDinilai} tugas yang belum dinilai. Segera berikan penilaian untuk mahasiswa.`
                  : dosenKelasHariIni.length > 0
                  ? `Hari ini Anda memiliki ${dosenKelasHariIni.length} kelas. Jangan lupa buka presensi!`
                  : "Gunakan fitur presensi untuk memudahkan pencatatan kehadiran mahasiswa."}
              </p>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </span>
                Status Sistem
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Server</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Database</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Sync</span>
                  <span className="text-gray-600">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ KAPRODI DASHBOARD ============
  if (role === "kaprodi") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👔</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Selamat datang,</p>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {userName}
                  </h1>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fdf2f4] text-[#7a1d38] border border-[#f9d0d9]">
                  Ketua Program Studi
                </span>
              </div>
            </div>
            <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Hari ini
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </p>
              <p className="text-sm text-[#7a1d38] font-medium mt-1">
                Semester Ganjil 2024/2025
              </p>
            </div>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Mahasiswa */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Total Mahasiswa
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {kaprodiStats.totalMahasiswa}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">👨‍🎓</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Mahasiswa aktif terdaftar
            </p>
          </div>

          {/* Total Dosen */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Total Dosen
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {kaprodiStats.totalDosen}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">👨‍🏫</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Dosen pengajar</p>
          </div>

          {/* Total Mata Kuliah */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  Mata Kuliah
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {kaprodiStats.totalMataKuliah}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">📚</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Mata kuliah tersedia</p>
          </div>

          {/* KRS Pending */}
          <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  KRS Pending
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {kaprodiStats.krsPending}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">📋</span>
              </div>
            </div>
            <p className="text-xs text-white/80 mt-4">
              {kaprodiStats.krsPending > 0 ? (
                <span>⚠️ Menunggu persetujuan</span>
              ) : (
                <span>✓ Semua KRS sudah diproses</span>
              )}
            </p>
          </div>
        </div>

        {/* KRS Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">
                {kaprodiStats.krsApproved}
              </p>
              <p className="text-sm text-green-600">KRS Disetujui</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">
                {kaprodiStats.krsPending}
              </p>
              <p className="text-sm text-amber-600">KRS Menunggu</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">❌</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">
                {kaprodiStats.krsRejected}
              </p>
              <p className="text-sm text-red-600">KRS Ditolak</p>
            </div>
          </div>
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* KRS Pending List */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                    📋
                  </span>
                  KRS Menunggu Persetujuan
                </h2>
                <Link
                  href="/krs"
                  className="text-sm text-[#7a1d38] hover:underline font-medium"
                >
                  Lihat Semua
                </Link>
              </div>

              {krsPendingList.length > 0 ? (
                <div className="space-y-3">
                  {krsPendingList.map((krs, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <span>📄</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {krs.mahasiswa_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          NIM: {krs.nim} • {krs.total_sks} SKS
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(krs.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">✅</span>
                  <p>Tidak ada KRS yang menunggu persetujuan</p>
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                    👥
                  </span>
                  Pengguna Terbaru
                </h2>
                <Link
                  href="/manage-user"
                  className="text-sm text-[#7a1d38] hover:underline font-medium"
                >
                  Kelola User
                </Link>
              </div>
              {recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          user.role === "student"
                            ? "bg-blue-100"
                            : user.role === "dosen"
                            ? "bg-green-100"
                            : "bg-purple-100"
                        }`}
                      >
                        <span>
                          {user.role === "student"
                            ? "👨‍🎓"
                            : user.role === "dosen"
                            ? "👨‍🏫"
                            : "👔"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {user.username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(user.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">👥</span>
                  <p>Belum ada data pengguna</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                  🚀
                </span>
                Akses Cepat
              </h2>
              <div className="space-y-2">
                <Link
                  href="/krs"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">📋</span>
                  <span className="flex-1">Kelola KRS</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/manage-user"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">👥</span>
                  <span className="flex-1">Kelola Pengguna</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/list-kelas"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">📚</span>
                  <span className="flex-1">Daftar Kelas</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">⚙️</span>
                  <span className="flex-1">Pengaturan</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/profil"
                  className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
                >
                  <span className="text-lg">👤</span>
                  <span className="flex-1">Profil Saya</span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">💡 Tips</h3>
              <p className="text-white/80 text-sm">
                {kaprodiStats.krsPending > 0
                  ? `Ada ${kaprodiStats.krsPending} KRS yang menunggu persetujuan. Segera review untuk kelancaran akademik mahasiswa.`
                  : "Pantau terus perkembangan akademik mahasiswa dan dosen untuk memastikan kualitas pembelajaran."}
              </p>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </span>
                Status Sistem
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Server</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Database</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Sync</span>
                  <span className="text-gray-600">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ STUDENT DASHBOARD (Default) ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Selamat datang,</p>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {userName}
                </h1>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fdf2f4] text-[#7a1d38] border border-[#f9d0d9]">
                Mahasiswa
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  getKRSStatusBadge().bg
                } ${getKRSStatusBadge().text}`}
              >
                KRS: {getKRSStatusBadge().label}
              </span>
            </div>
          </div>
          <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Hari ini
            </p>
            <p className="text-xl font-semibold text-gray-800">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </p>
            <p className="text-sm text-[#7a1d38] font-medium mt-1">
              Semester Ganjil 2024/2025
            </p>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total SKS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Total SKS
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalSKS}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-[#7a1d38] h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min((stats.totalSKS / 24) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalMataKuliah} Mata Kuliah
            </p>
          </div>
        </div>

        {/* Kehadiran */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Kehadiran
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.persentaseKehadiran}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  stats.persentaseKehadiran >= 80
                    ? "bg-green-500"
                    : stats.persentaseKehadiran >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${stats.persentaseKehadiran}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalKehadiran} kehadiran tercatat
            </p>
          </div>
        </div>

        {/* Tugas */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-[#7a1d38]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Tugas
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.tugasSudahDikumpulkan}/
                {stats.tugasSudahDikumpulkan + stats.tugasBelumDikumpulkan}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#fdf2f4] to-[#fce7ea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">📝</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {stats.tugasBelumDikumpulkan > 0 ? (
              <span className="text-amber-600">
                ⚠️ {stats.tugasBelumDikumpulkan} belum dikumpulkan
              </span>
            ) : stats.tugasSudahDikumpulkan > 0 ? (
              <span className="text-green-600">✓ Semua tugas selesai!</span>
            ) : (
              <span>Tidak ada tugas</span>
            )}
          </p>
        </div>

        {/* IPK */}
        <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                IPK
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.ipk.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">⭐</span>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-4">
            Predikat: {getPredikat(stats.ipk)}
          </p>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jadwal Hari Ini */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                  📅
                </span>
                Jadwal Hari Ini
              </h2>
              <Link
                href="/list-kelas"
                className="text-sm text-[#7a1d38] hover:underline font-medium"
              >
                Lihat Semua
              </Link>
            </div>

            {kelasHariIni.length > 0 ? (
              <div className="space-y-3">
                {kelasHariIni.map((kelas, idx) => (
                  <Link
                    href={`/kelas/${kelas.id}`}
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors cursor-pointer"
                  >
                    <div className="w-16 text-center">
                      <p className="text-lg font-bold text-[#7a1d38]">
                        {formatTime(kelas.jam_mulai)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(kelas.jam_selesai)}
                      </p>
                    </div>
                    <div className="w-0.5 h-12 bg-[#7a1d38]/20 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {kelas.nama_mk}
                      </p>
                      <p className="text-sm text-gray-500">
                        {kelas.kode_mk} • {kelas.ruangan}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      {kelas.dosen}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">🎉</span>
                <p>Tidak ada kelas hari ini</p>
              </div>
            )}
          </div>

          {/* Deadline Tugas */}
          {tugasDeadline.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                    ⏰
                  </span>
                  Deadline Tugas
                </h2>
              </div>
              <div className="space-y-3">
                {tugasDeadline.map((tugas, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tugas.sudahDikumpulkan ? "bg-green-100" : "bg-amber-100"
                      }`}
                    >
                      <span>{tugas.sudahDikumpulkan ? "✅" : "📝"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tugas.judul}</p>
                      <p className="text-sm text-gray-500">{tugas.nama_mk}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        tugas.sudahDikumpulkan
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {tugas.sudahDikumpulkan
                        ? "Sudah dikumpulkan"
                        : formatDeadline(tugas.deadline)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                  📋
                </span>
                Aktivitas Terbaru
              </h2>
            </div>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#fdf2f4] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[#fdf2f4] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span>{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.subtitle}
                      </p>
                    </div>
                    {activity.status && (
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusBadge(
                          activity.status
                        )}`}
                      >
                        {getStatusLabel(activity.status)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📭</span>
                <p>Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#fdf2f4] rounded-lg flex items-center justify-center">
                🚀
              </span>
              Akses Cepat
            </h2>
            <div className="space-y-2">
              <Link
                href="/list-kelas"
                className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
              >
                <span className="text-lg">📅</span>
                <span className="flex-1">Jadwal Kelas</span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/krs"
                className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
              >
                <span className="text-lg">📋</span>
                <span className="flex-1">KRS Saya</span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/khs"
                className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
              >
                <span className="text-lg">📊</span>
                <span className="flex-1">KHS & Nilai</span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/profil"
                className="flex items-center gap-3 w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-[#fdf2f4] text-gray-700 hover:text-[#7a1d38] rounded-xl transition-all font-medium group"
              >
                <span className="text-lg">👤</span>
                <span className="flex-1">Profil Saya</span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-[#7a1d38] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-[#7a1d38] to-[#5c1529] rounded-2xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-2">💡 Tips</h3>
            <p className="text-white/80 text-sm">
              {stats.tugasBelumDikumpulkan > 0
                ? `Kamu punya ${stats.tugasBelumDikumpulkan} tugas yang belum dikumpulkan. Segera kerjakan sebelum deadline!`
                : stats.persentaseKehadiran < 80
                ? "Tingkatkan kehadiranmu! Minimal 80% untuk bisa mengikuti ujian."
                : "Pertahankan performa belajarmu! Jangan lupa istirahat yang cukup."}
            </p>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </span>
              Status Sistem
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Server</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Sync</span>
                <span className="text-gray-600">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
