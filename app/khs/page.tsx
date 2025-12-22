"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type GradeRow = {
  id?: any;
  kode?: string;
  mata_kuliah?: string;
  sks?: number;
  nilai?: string;
  semester?: number | string;
  tahun?: string;
  [key: string]: any;
};

const gradeValue = (g: string) => {
  if (!g) return 0;
  const s = g.toString().trim().toUpperCase();
  const map: Record<string, number> = {
    A: 4,
    "A-": 3.7,
    "B+": 3.3,
    B: 3,
    "B-": 2.7,
    "C+": 2.3,
    C: 2,
    D: 1,
    E: 0,
    F: 0,
  };
  return (map[s] !== undefined && map[s] !== null) ? map[s] : (parseFloat(s) || 0);
};

// safe null/undefined coalesce helper to avoid nullish operator (??) parser issues
const nv = (a: any, b: any) => (a !== undefined && a !== null) ? a : b;

export default function KHSPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [detectedKeys, setDetectedKeys] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    kode: "kode",
    mata_kuliah: "mata_kuliah",
    sks: "sks",
    nilai: "nilai",
    semester: "semester",
    tahun: "tahun",
  });

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await supabase.auth.getUser();
        const user = (userRes as any)?.data?.user;
        const candidateTables = [
          "student_grades",
          "khs",
          "grades",
          "nilai",
          "transcripts",
          "transkrip",
          "student_transcripts",
        ];

        let rows: any[] | null = null;
        for (const t of candidateTables) {
          try {
            // try matching common student link columns
            const res = await supabase
              .from(t)
              .select("*")
              .limit(1000);
            if (!res.error && res.data && (res.data as any[]).length > 0) {
              // filter client-side by user id/email if possible
              const data = res.data as any[];
              let filtered = data;
              if (user) {
                filtered = data.filter((r) => {
                  return (
                    r.user_id === user.id ||
                    r.student_id === user.id ||
                    r.student === user.id ||
                    r.email === user.email ||
                    r.user_email === user.email ||
                    r.nim === user.email // unlikely
                  );
                });
              }
                  if (filtered.length > 0) {
                    rows = filtered;
                    // capture detected keys from the first raw row
                    const keys = Object.keys((filtered[0] as any) || {});
                    setDetectedKeys(keys);
                    break;
                  }
            }
          } catch (e) {
            /* ignore table not found */
          }
        }

        if (!rows) {
          setError("Tidak menemukan data KHS di database (cek nama tabel / RLS).");
          setGrades([]);
        } else {
          // normalize rows using mapping (initial guesses may be present)
          const norm = rows.map((r) => {
            const raw = r;
            const get = (keys: string[]) => {
              for (const k of keys) if (raw[k] !== undefined && raw[k] !== null) return raw[k];
              return undefined;
            };
            return {
              id: nv(raw.id, nv(raw.grade_id, raw._id)),
              kode: nv(raw[mapping.kode], get(["kode", "code", "course_code", "course?.code"])),
              mata_kuliah: nv(raw[mapping.mata_kuliah], get(["mata_kuliah", "course_name", "nama_mk", "course?.name"])),
              sks: Number(nv(raw[mapping.sks], nv(raw.sks, nv(raw.credit, nv(raw.credits, 0))))),
              nilai: nv(raw[mapping.nilai], nv(raw.nilai, nv(raw.grade, nv(raw.score, raw.value)))),
              semester: nv(raw[mapping.semester], nv(raw.semester, nv(raw.sem, nv(raw.term, raw.period)))),
              tahun: nv(raw[mapping.tahun], nv(raw.tahun, nv(raw.academic_year, raw.year))),
              raw,
            } as GradeRow;
          });
          setGrades(norm);
        }
      } catch (err: any) {
        setError((err && (err.message || err.toString())) || String(err));
        setGrades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [supabase]);

  // group by semester value (stringified)
  const grouped: Record<string, GradeRow[]> = {};
  grades.forEach((g) => {
    const key = String(nv(nv(g.semester, g.tahun), "unknown"));
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(g);
  });

  const computeSemesterStats = (rows: GradeRow[]) => {
    let totalSks = 0;
    let totalMutu = 0;
    rows.forEach((r) => {
      const sks = Number(nv(r.sks, 0));
      const val = gradeValue(String(nv(r.nilai, "")));
      totalSks += sks;
      totalMutu += val * sks;
    });
    const ips = totalSks > 0 ? totalMutu / totalSks : 0;
    return { totalSks, ips };
  };

  // compute cumulative (IPK)
  const allSks = grades.reduce((s, r) => s + Number(nv(r.sks, 0)), 0);
  const allMutu = grades.reduce((m, r) => m + gradeValue(String(nv(r.nilai, ""))) * Number(nv(r.sks, 0)), 0);
  const ipk = allSks > 0 ? allMutu / allSks : 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kartu Hasil Studi</h1>
      {/* Quick mapping UI when detected keys are available */}
      {detectedKeys.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border">
          <p className="font-medium mb-2">Deteksi kolom otomatis — pilih mapping jika nama kolom berbeda:</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(mapping).map((field) => (
              <label key={field} className="text-sm">
                <div className="text-xs text-slate-600 mb-1">{field}</div>
                <select
                  value={mapping[field]}
                  onChange={(e) => setMapping((m) => ({ ...m, [field]: e.target.value }))}
                  className="w-full px-3 py-2 rounded border"
                >
                  <option value={mapping[field]}>{mapping[field]}</option>
                  {detectedKeys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="text-sm text-slate-600 mt-2">Setelah memilih, refresh halaman untuk menerapkan mapping.</p>
        </div>
      )}

      {loading ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">Memuat data KHS...</div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded-xl text-red-700">{error}</div>
      ) : grades.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-sm">Belum ada data KHS.</div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{nv(Object.keys(grouped).slice(-1)[0], "-")}</h2>
                  <p className="opacity-80">Ringkasan nilai</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">IPK: {ipk.toFixed(2)}</p>
                  <p className="font-bold">Total SKS: {allSks}</p>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(grouped)
            .sort()
            .map((sem) => {
              const rows = grouped[sem];
              const stats = computeSemesterStats(rows);
              return (
                <div key={sem} className="bg-white rounded-xl shadow-sm mb-6">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Semester {sem}</h3>
                      <p className="text-sm text-slate-600">{rows.length} mata kuliah</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">SKS: {stats.totalSks}</p>
                      <p className="text-sm font-semibold">IPS: {stats.ips.toFixed(2)}</p>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Kode</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Mata Kuliah</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">SKS</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Nilai</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Mutu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {rows.map((r) => (
                        <tr key={nv(r.id, r.kode)}>
                          <td className="p-4">{nv(r.kode, "-")}</td>
                          <td className="p-4">{nv(r.mata_kuliah, "-")}</td>
                          <td className="p-4">{nv(r.sks, 0)}</td>
                          <td className="p-4 font-bold text-slate-800">{nv(r.nilai, "-")}</td>
                          <td className="p-4">{(gradeValue(String(nv(r.nilai, ""))) * nv(r.sks, 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}