# 🎓 SynClass

**Sistem Informasi Akademik Terintegrasi**

SynClass adalah aplikasi web modern berbasis Next.js yang dirancang untuk mengelola kegiatan akademik perguruan tinggi secara efisien. Aplikasi ini menyediakan antarmuka yang intuitif untuk mahasiswa, dosen, dan kaprodi dalam mengelola data akademik, kelas, nilai, dan informasi pengguna.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Peran Pengguna](#-peran-pengguna)
- [Alur Kerja Aplikasi](#-alur-kerja-aplikasi)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi](#-instalasi)
- [Konfigurasi Database](#-konfigurasi-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Panduan Penggunaan](#-panduan-penggunaan)

---

## ✨ Fitur Utama

### 🏠 Dashboard Dinamis

SynClass memiliki dashboard yang berbeda untuk setiap role pengguna dengan data yang terupdate real-time dari database.

#### 📊 Dashboard Mahasiswa

Menampilkan ringkasan akademik dan aktivitas harian mahasiswa.

| Fitur | Deskripsi | Keterangan |
| :---: | :---: | :---: |
| **Total SKS** | Jumlah SKS yang diambil | Berdasarkan data KRS yang approved |
| **Kehadiran** | Persentase kehadiran | Dihitung otomatis dari presensi |
| **Tugas** | Status pengumpulan tugas | Jumlah yang sudah & belum dikumpulkan |
| **IPK** | Indeks Prestasi Kumulatif | Dihitung dari semua nilai mata kuliah |
| **Jadwal Hari Ini** | Kelas yang harus diikuti | Real-time sesuai tanggal hari ini |
| **Deadline Tugas** | Tugas yang akan deadline | Sorted by deadline date |
| **Aktivitas Terbaru** | Riwayat presensi & submission | Timeline dari aktivitas terkini |
| **Status KRS** | Status pengajuan KRS | 🟡 Pending / 🟢 Approved / 🔴 Rejected |

---

#### 👨‍🏫 Dashboard Dosen

Menampilkan manajemen kelas dan penilaian mahasiswa.

| Fitur | Deskripsi | Keterangan |
| :---: | :---: | :---: |
| **Mata Kuliah** | Jumlah kelas yang diampu | Per semester aktif |
| **Total Mahasiswa** | Jumlah siswa di semua kelas | Dari matakuliah_diambil |
| **Sesi Presensi** | Jumlah session presensi dibuat | Tracking kehadiran mahasiswa |
| **Tugas** | Jumlah tugas yang diberikan | Info belum/sudah dinilai |
| **Jadwal Mengajar** | Kelas hari ini dengan jumlah siswa | Dengan info ruang & waktu |
| **Aktivitas Terbaru** | Submission tugas mahasiswa | Notifikasi new submissions |
| **Postingan Terbaru** | Materi, tugas, pengumuman | Yang baru dibuat/diupdate |

---

#### 👑 Dashboard Kaprodi

Menampilkan overview akademik dan manajemen program studi.

| Fitur | Deskripsi | Keterangan |
| :---: | :---: | :---: |
| **Total Mahasiswa** | Jumlah mahasiswa aktif | Dari role 'student' |
| **Total Dosen** | Jumlah dosen di program studi | Dari role 'dosen' |
| **Mata Kuliah** | Total mata kuliah tersedia | Database matakuliah |
| **KRS Pending** | Pengajuan KRS menunggu | Status = 'pending' |
| **KRS Summary** | Breakdown KRS status | Approved + Pending + Rejected |
| **KRS Pending List** | Daftar pengajuan yg belum review | Detail & action buttons |
| **Pengguna Terbaru** | User yang baru terdaftar | Last 5 users |

---

### 🔐 Autentikasi & Keamanan

Sistem keamanan berlapis untuk melindungi data akademik:

```
┌────────────────────────────────────────┐
│      LAPISAN KEAMANAN SYNCLASS        │
├────────────────────────────────────────┤
│                                        │
│ 1️⃣  Supabase Auth                      │
│     └─ JWT Token                      │
│     └─ Secure Session                 │
│     └─ Email Verification             │
│                                        │
│ 2️⃣  Role-Based Access Control (RBAC)  │
│     └─ Student / Dosen / Kaprodi     │
│     └─ Menu visibility per role       │
│     └─ Feature unlock per role        │
│                                        │
│ 3️⃣  Row Level Security (RLS)           │
│     └─ Database-level policies        │
│     └─ Data isolation per user        │
│     └─ Prevent unauthorized access    │
│                                        │
│ 4️⃣  Admin API (Server-side only)       │
│     └─ SERVICE_ROLE_KEY in .env       │
│     └─ User creation & management     │
│     └─ Never exposed to client        │
│                                        │
│ 5️⃣  Password Management                │
│     └─ Hashed by Supabase             │
│     └─ Reset via email                │
│     └─ Never stored in plaintext      │
│                                        │
└────────────────────────────────────────┘
```

**Fitur Keamanan:**
- ✅ **Login Terintegrasi** - Supabase Auth dengan session management
- ✅ **Token Refresh** - JWT otomatis di-refresh sebelum expired
- ✅ **Role-Based Access** - Kontrol akses berdasarkan peran
- ✅ **Admin API** - Operasi sensitive hanya via server
- ✅ **Logout Aman** - Pembersihan session & localStorage
- ✅ **Email Verification** - Validasi email saat registrasi

---

### 📚 Manajemen Akademik

#### Kartu Rencana Studi (KRS)

Mahasiswa memilih mata kuliah yang ingin diambil, kemudian kaprodi menyetujui atau menolak.

**Mahasiswa:**
- Pilih mata kuliah sesuai kurikulum
- Maksimum 24 SKS per semester
- Ajukan KRS dan tunggu persetujuan
- Bisa edit & ajukan ulang jika ditolak

**Kaprodi:**
- Review pengajuan dari mahasiswa
- Lihat detail & validasi SKS
- Approve atau reject dengan catatan
- Print/export untuk dokumentasi

---

#### Kartu Hasil Studi (KHS)

Riwayat nilai akademik dengan perhitungan IPS dan IPK otomatis.

**Fitur:**
- 📄 Nilai per mata kuliah dengan grade (A-E)
- 📊 Perhitungan IPS (semester) otomatis
- 📊 Perhitungan IPK (kumulatif) otomatis
- 📈 Trend akademik per semester
- 🔒 Hanya dapat dilihat, tidak dapat diubah

---

#### List Kelas

Daftar kelas yang diikuti mahasiswa atau diampu dosen.

**Informasi:**
- 🏫 Nama & kode mata kuliah
- 👨‍🏫 Nama dosen pengampu
- 📅 Jadwal (hari, jam, ruangan)
- 👥 Jumlah peserta
- 📍 Lokasi kelas

---

### ⚙️ Pengaturan Sistem

#### Manajemen User (Kaprodi Only)

Admin panel untuk CRUD user dengan form lengkap.

**Fitur:**
- ➕ **Create User** - Form lengkap dengan validasi
- 👁️ **View User** - Daftar user dengan filter
- ✏️ **Edit User** - Update data user existing
- 🗑️ **Delete User** - Hapus user dari sistem
- 🔍 **Search & Filter** - Cari berdasarkan role/nama

**Form Fields:**
```
┌─────────────────────────────────┐
│    CREATE/EDIT USER FORM        │
├─────────────────────────────────┤
│ Email*              [___________]│
│ Password*           [___________]│
│ Username*           [___________]│
│ Role*               [Dropdown  ]│ (student/dosen/kaprodi)
│ NIM/NIDN*           [___________]│
│ Nama Lengkap        [___________]│
│ Jurusan             [___________]│
│ Fakultas            [___________]│
│ Angkatan            [___________]│
│                                 │
│ [Cancel]          [Save User]  │
└─────────────────────────────────┘
```

---

#### Manajemen Mata Kuliah

CRUD mata kuliah untuk mengatur kurikulum.

**Fitur:**
- ➕ **Create** - Tambah mata kuliah baru
- 👁️ **View** - Lihat daftar lengkap
- ✏️ **Edit** - Update info mata kuliah
- 🗑️ **Delete** - Hapus mata kuliah
- 📊 **Filter** - Berdasarkan semester

**Data Mata Kuliah:**
```
Kode MK:   PROG101
Nama:      Pemrograman Dasar
SKS:       3
Semester:  1
Dosen:     Dr. Budi Santoso
Jadwal:    Senin 09:00-11:30
Ruangan:   Ruang 101
```



---

## 🏗 Arsitektur Sistem

Aplikasi SynClass menggunakan arsitektur modern client-server dengan pembagian tanggung jawab yang jelas:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                       │
│                    ┌─────────────────────────────┐                  │
│                    │      Next.js Frontend       │                  │
│                    │      (React 19 + TS)        │                  │
│                    │    Tailwind CSS 4.x          │                  │
│                    └────────────┬────────────────┘                  │
│                                 │                                    │
│                    ┌────────────▼───────────────┐                   │
│                    │  Supabase Client Library   │                   │
│                    │   (Auth + Database Sync)   │                   │
│                    └────────────┬───────────────┘                   │
│                                 │                                    │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
                         HTTPS/WebSocket
                                  │
┌─────────────────────────────────▼────────────────────────────────────┐
│                      SERVER LAYER (Supabase Cloud)                   │
│                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Authentication     │  │   PostgreSQL        │                   │
│  │  (JWT + Session)    │  │   Database          │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                  │                                    │
│                   ┌──────────────┼──────────────┐                   │
│                   │              │              │                   │
│        ┌──────────▼──────┐  ┌────▼──────┐  ┌───▼────────────┐      │
│        │ profiles        │  │matakuliah │  │krs_pengajuan   │      │
│        │ (User Data)     │  │(Courses)  │  │(KRS Requests)  │      │
│        └─────────────────┘  └───────────┘  └────────────────┘      │
│                                                                       │
│   ┌──────────────┐  ┌─────────────┐  ┌──────────────┐               │
│   │presensi_     │  │post         │  │tugas_        │               │
│   │session       │  │(Materials)  │  │submission    │               │
│   │(Attendance)  │  └─────────────┘  │(Assignments) │               │
│   └──────────────┘                    └──────────────┘               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Penjelasan Alur:**
1. **Client** → User berinteraksi dengan UI Next.js
2. **Supabase Client** → Mengirim request ke backend (Auth & Database)
3. **Server** → Memproses request, validasi, dan mengelola data
4. **Database** → Menyimpan semua data dengan keamanan RLS



---

## 👥 Peran Pengguna

SynClass mendukung 3 peran utama dengan hak akses dan fitur yang berbeda:

### Hierarki Peran

```
                    📊 KAPRODI (Ketua Program Studi)
                            👑
                    ┌───────────────────┐
                    │                   │
              👨‍🏫 DOSEN          🎓 MAHASISWA
              Pengajar           Pelajar
```

**Keterangan:**
- **KAPRODI** (👑) - Level tertinggi, mengatur seluruh program studi
- **DOSEN** (👨‍🏫) - Mengelola kelas dan penilaian mahasiswa
- **MAHASISWA** (🎓) - Mengikuti kelas dan menyelesaikan tugas

### Hak Akses per Peran

| Menu              | Mahasiswa | Dosen |        Kaprodi        |
| :---------------- | :-------: | :---: | :-------------------: |
| **Dashboard**     |     ✅    |  ✅   |          ✅           |
| **Profil**        |     ✅    |  ✅   |          ✅           |
| **List Kelas**    |     ✅    |  ✅   |          ✅           |
| **Detail Kelas**  |     ✅    |  ✅   |          ✅           |
| **KRS (Ajukan)**  |     ✅    |  ❌   |          ❌           |
| **KRS (Approve)** |     ❌    |  ❌   |          ✅           |
| **KHS**           |     ✅    |  ✅   |          ✅           |
| **Pengaturan**    |     ✅    |  ✅   |          ✅           |
| **Manage User**   |     ❌    |  ❌   |          ✅ (Admin)   |

### Fitur per Peran

**👨‍🎓 MAHASISWA:**
- Ajukan KRS (Kartu Rencana Studi)
- Lihat jadwal kelas
- Presensi online
- Kumpul tugas
- Lihat nilai (KHS)

**👨‍🏫 DOSEN:**
- Buat jadwal kelas
- Kelola presensi
- Buat dan nilai tugas
- Upload materi
- Lihat daftar mahasiswa

**👑 KAPRODI:**
- Approve/reject KRS
- Manage user (create/edit/delete)
- Lihat statistik akademik
- Monitor semua aktivitas



---

## 🔄 Alur Kerja Aplikasi

### 1️⃣ Alur Login & Autentikasi

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PROSES LOGIN                                │
└─────────────────────────────────────────────────────────────────────┘

      User              UI Login         Supabase Auth         Database
       👤               📱 Page             🔐 Server             🗄️
       │                │                   │                     │
       │ 1. Input email │                   │                     │
       │ & password     │                   │                     │
       │───────────────►│                   │                     │
       │                │                   │                     │
       │                │ 2. signInWithPassword()                 │
       │                ├──────────────────►│                     │
       │                │                   │ 3. Validasi         │
       │                │                   ├────────────────────►│
       │                │                   │                     │
       │                │                   │◄────────────────────┤
       │                │ 4. Return JWT & User ID                │
       │                │◄──────────────────┤                     │
       │                │                   │                     │
       │                │ 5. Fetch profile data                   │
       │                ├──────────────────►│                     │
       │                │                   │ 6. Get role         │
       │                │                   ├────────────────────►│
       │                │                   │                     │
       │                │ 7. Return role & profile                │
       │                │◄──────────────────────────────────────►│
       │                │                   │                     │
       │ 8. Save to localStorage:          │                     │
       │ • user_id                         │                     │
       │ • user_role                       │                     │
       │ • user_email                      │                     │
       │◄──────────────┤                   │                     │
       │                │                   │                     │
       │ 9. Redirect    │                   │                     │
       │ to Dashboard   │                   │                     │
       │◄──────────────┤                   │                     │
       │                │                   │                     │

✅ Keamanan:
  • JWT token disimpan di secure cookie
  • User ID tersimpan di localStorage
  • Role divalidasi di server
```

**Detail Setiap Langkah:**

| Langkah | Proses | Hasil |
| :-----: | :----: | :---: |
| 1-2 | User input → signIn() | Validasi kredensial |
| 3-4 | Server validasi → JWT token | Auth session aktif |
| 5-7 | Fetch role dari profiles | Hak akses ditentukan |
| 8 | Save ke localStorage | Session persisten |
| 9 | Redirect ke dashboard | Login selesai ✅ |

---

### 2️⃣ Alur Pengajuan KRS (Kartu Rencana Studi)

```
┌──────────────────────────────────────────────────────────────────────┐
│                      PROSES PENGAJUAN KRS                            │
└──────────────────────────────────────────────────────────────────────┘

FASE 1: PENGAJUAN OLEH MAHASISWA
─────────────────────────────────

   Mahasiswa          KRS Page         Database          Kaprodi
      🎓                📋              🗄️               👑
      │                 │                │                │
      │ 1. Buka         │                │                │
      │ halaman KRS     │                │                │
      ├────────────────►│                │                │
      │                 │ 2. Load MK     │                │
      │                 ├───────────────►│                │
      │                 │◄───────────────┤                │
      │                 │  (24 SKS max)  │                │
      │                 │                │                │
      │ 3. Pilih MK     │                │                │
      │ (misalnya       │                │                │
      │  12 SKS)        │                │                │
      │                 │                │                │
      │ 4. Klik Ajukan  │                │                │
      ├────────────────►│                │                │
      │                 │ 5. Create KRS  │                │
      │                 ├───────────────►│                │
      │                 │                │ 6. Save        │
      │                 │                ├────────────────►│ (notify)
      │                 │◄───────────────┤                │
      │                 │                │                │
      │ STATUS: PENDING │                │                │
      │ (Kuning 🟡)     │                │                │
      │◄────────────────┤                │                │
      │                 │                │                │


FASE 2: REVIEW OLEH KAPRODI
─────────────────────────────

      Mahasiswa        Kaprodi Dashboard  Database
         🎓              👑                 🗄️
      (Menunggu)        │                  │
                        │ 1. Lihat daftar  │
                        │ KRS pending      │
                        ├────────────────►│
                        │◄────────────────┤
                        │
                        │ 2. Pilih & review detail
                        │
                        │ 3. Buat keputusan
                        │ (Approve/Reject)
                        │


FASE 3: KEPUTUSAN
──────────────────

   Jika DISETUJUI (🟢)          Jika DITOLAK (🔴)
   ─────────────────            ────────────────

   • Simpan ke                  • Mahasiswa bisa
     matakuliah_diambil           edit & ajukan
   • Update KRS status            ulang
   • Sertifikat KRS             • Update KRS
     diberikan                    status = rejected

   Mahasiswa bisa               Mahasiswa bisa
   mulai kelas ✅              mengajukan KRS
                               baru ↻


Status Progress:
┌──────────────────────────────────────────────┐
│ Pengajuan → Pending → Review → APPROVED ✅   │
│            (Kuning 🟡) (Kuning) (Hijau 🟢)  │
│                  ↓                            │
│               REJECTED 🔴                     │
│               (Coba lagi)                     │
└──────────────────────────────────────────────┘
```

**Timeline KRS:**

| Fase | Actor | Aksi | Status |
| :---: | :---: | :---: | :---: |
| 1 | Mahasiswa | Pilih MK & ajukan | 🟡 Pending |
| 2 | Kaprodi | Review & evaluasi | 🟡 Review |
| 3a | Kaprodi | Approve | 🟢 Approved |
| 3b | Kaprodi | Reject | 🔴 Rejected |
| 4a | System | Daftar ke kelas | ✅ Aktif |
| 4b | Mahasiswa | Ajukan ulang | ↻ Ulang |

---

### 3️⃣ Alur Presensi Kelas (Otomatis)

```
┌──────────────────────────────────────────────────────────────────────┐
│                  PROSES PRESENSI OTOMATIS                            │
└──────────────────────────────────────────────────────────────────────┘

TIMELINE:
─────────

 Waktu             Dosen Action          Sistem Action        Mahasiswa
  │                                                              │
  │ 13:55                                                        │
  │ (5 menit                                                    │
  │  sebelum                                                    │
  │  mulai)       STOP: Masih bisa presensi manual              │
  │                                                              │
  │ 14:00          ┌─────────────────┐                          │
  │ ✅ JAM         │ AUTO-OPEN       │   Presensi terbuka    Bisa input
  │ MULAI         │ Presensi session│   otomatis             kode ✅
  │               │ terbuka         │                         │
  │               └─────────────────┘                          │
  │                │                                            │
  │ 14:01-14:14    │ Dosen bisa lihat│   Realtime presensi   Mahasiswa
  │ ⏱️ JENDELA    │ siapa yg sudah │   list diupdate         lanjut input
  │ 15 MENIT      │ presensi        │   setiap ada submission│
  │               │                │                         │
  │ 14:15          │ (Auto-close)    │   Presensi ditutup   Tidak bisa
  │ ❌ JAM        │ Harus dosen     │   otomatis             input lagi
  │ SELESAI       │ buka manual     │                         ❌
  │               │ jika diperlukan│                         │


Alur Teknis:
────────────

START → Check time
        │
        ├─ Waktu START_TIME ≤ sekarang ≤ START_TIME + 15min?
        │
        ├─ YES → PRESENSI AKTIF ✅
        │        (User bisa input kode)
        │
        └─ NO → PRESENSI DITUTUP ❌
                (User tidak bisa presensi)


Status Presensi:
┌──────────────────────────────┐
│ HADIR ✅    → Timely           │
│ IZIN  ⏹️    → Approved absence │
│ SAKIT 🏥    → Medical excuse    │
│ ALFA  ❌    → No show           │
└──────────────────────────────┘
```

**Fitur Presensi:**

- ✅ **Auto-open** pada jam mulai kelas
- ✅ **Auto-close** setelah 15 menit
- ✅ **QR Code / Kode dinamis** untuk validasi
- ✅ **Real-time tracking** siapa saja yg sudah presensi
- ✅ **Manual override** jika ada kendala teknis
- ✅ **Rekap otomatis** untuk perhitungan nilai

---

### 4️⃣ Alur Manage User (Admin - Kaprodi)

```
┌──────────────────────────────────────────────────────────────────────┐
│                 PROSES CREATE USER (KAPRODI ONLY)                    │
└──────────────────────────────────────────────────────────────────────┘

      Kaprodi UI       API Route (Server)   Supabase Admin    Database
         👑              📡                   🔐               🗄️
         │               │                    │                │
         │ 1. Fill form: │                    │                │
         │ - email       │                    │                │
         │ - password    │                    │                │
         │ - role        │                    │                │
         │ - username    │                    │                │
         │ - nim/nidn    │                    │                │
         │ - jurusan     │                    │                │
         │               │                    │                │
         │ 2. POST       │                    │                │
         │ /api/admin/   │                    │                │
         │ create-user   │                    │                │
         ├──────────────►│                    │                │
         │               │ 3. Use SERVICE    │                │
         │               │ ROLE KEY to       │                │
         │               │ initialize client │                │
         │               ├───────────────────►│                │
         │               │                    │                │
         │               │ 4. auth.admin.     │                │
         │               │ createUser()       │                │
         │               ├───────────────────►│                │
         │               │                    │ 5. Create user │
         │               │                    ├───────────────►│
         │               │                    │                │
         │               │ 6. Return user_id  │                │
         │               │◄───────────────────┤                │
         │               │                    │                │
         │               │ 7. Insert profile  │                │
         │               │ data               │                │
         │               ├───────────────────►│                │
         │               │                    │ 8. Save profile│
         │               │                    ├───────────────►│
         │               │                    │                │
         │ 9. Success    │ 10. Return response│                │
         │ Notification  │◄────────────────────────────────────┤
         │◄──────────────┤                    │                │
         │               │                    │                │
         │ ✅ User       │                    │                │
         │ Created       │                    │                │
         │ Ready to use  │                    │                │
         │               │                    │                │

Data yang disimpan:
──────────────────

auth.users (Supabase Auth):
├─ id (UUID)
├─ email
├─ password_hash
└─ created_at

profiles (Database):
├─ id (FK: auth.users.id)
├─ email
├─ username
├─ role (student/dosen/kaprodi)
├─ nim/nidn
├─ jurusan
├─ fakultas
├─ angkatan
└─ created_at

✅ Keamanan:
  • SERVICE_ROLE_KEY hanya di server-side
  • Tidak pernah expose ke client/frontend
  • Password di-hash otomatis oleh Supabase
  • User bisa reset password via email
```



---

## 🛠 Teknologi yang Digunakan

SynClass dibangun dengan teknologi modern dan terpercaya:

### Stack Utama

| Teknologi | Versi | Peran | Dokumentasi |
| :---: | :---: | :---: | :---: |
| **Next.js** | 16.1.0 | Framework React dengan App Router | [nextjs.org](https://nextjs.org) |
| **React** | 19.x | Library UI component-based | [react.dev](https://react.dev) |
| **TypeScript** | 5.x | Type safety untuk JavaScript | [typescriptlang.org](https://www.typescriptlang.org) |
| **Tailwind CSS** | 4.x | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com) |
| **Supabase** | 2.89.0 | Backend-as-a-Service (Auth + PostgreSQL) | [supabase.com](https://supabase.com) |

### Database (PostgreSQL)

- **Engine**: PostgreSQL (via Supabase)
- **Connection**: Secure HTTPS
- **Features**: RLS (Row Level Security), Real-time updates, Backups
- **Relationships**: Foreign keys dengan CASCADE delete
- **Indexes**: Untuk optimasi performa query

### Styling & UI

- **Framework**: Tailwind CSS 4.x (utility-first)
- **Responsiveness**: Mobile-first, breakpoints: sm/md/lg/xl/2xl
- **Components**: Custom React components with Tailwind classes
- **Icons**: SVG icons (Heroicons style)

---

### Warna Tema

Palet warna profesional untuk kemudahan identifikasi:

| Elemen | Warna | Hex Code | Penggunaan |
| :---: | :---: | :---: | :---: |
| **Primary** | Maroon | `#7a1d38` | Header, buttons, badges |
| **Primary Dark** | Dark Maroon | `#5c1529` | Hover states, accents |
| **Primary Light** | Rose | `#fdf2f4` | Backgrounds, light elements |
| **Border** | Light Rose | `#f9d0d9` | Borders, dividers |
| **Success** | Green | `#16a34a` | Status approved, positive |
| **Warning** | Amber | `#ea8c00` | Status pending, caution |
| **Error** | Red | `#dc2626` | Status rejected, negative |



---

## 📁 Struktur Proyek

```
SynClass/
├── app/                          # App Router (Next.js)
│   ├── api/
│   │   └── admin/
│   │       └── create-user/
│   │           └── route.ts     # Admin API untuk create user
│   ├── globals.css              # Global styles (Tailwind)
│   ├── layout.tsx               # Root layout dengan Sidebar
│   ├── page.tsx                 # Dashboard (role-based)
│   ├── login/
│   │   └── page.tsx             # Halaman login
│   ├── profil/
│   │   └── page.tsx             # Halaman profil
│   ├── list-kelas/
│   │   └── page.tsx             # Daftar kelas
│   ├── kelas/
│   │   └── [id]/
│   │       └── page.tsx         # Detail kelas
│   ├── krs/
│   │   └── page.tsx             # KRS (mahasiswa & kaprodi)
│   ├── khs/
│   │   └── page.tsx             # Kartu Hasil Studi
│   └── settings/
│       └── page.tsx             # Pengaturan & Manage User
├── components/
│   └── Sidebar.tsx              # Navigasi sidebar
├── utils/
│   └── supabase/
│       └── client.ts            # Supabase client
├── public/                       # Static assets
├── .env.local                   # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Instalasi & Setup

### Prasyarat

Pastikan sudah terinstal:
- **Node.js** v18.x atau lebih baru
- **npm** v9.x atau **yarn** / **pnpm** / **bun**
- **Git** untuk version control
- Akun **Supabase** gratis ([supabase.com](https://supabase.com))

### Step 1: Clone Repository

```bash
git clone https://github.com/username/synclass.git
cd synclass
```

### Step 2: Install Dependencies

```bash
npm install
# atau menggunakan yarn
yarn install
```

### Step 3: Setup Environment Variables

Buat file `.env.local` di root project:

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan kredensial Supabase Anda:

```env
# Supabase Configuration (Public - safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here

# Supabase Admin (Private - server-side only!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Cara mendapatkan kredensial:**
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Settings** → **API**
4. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **PENTING**: `SUPABASE_SERVICE_ROLE_KEY` hanya untuk server-side! Jangan pernah expose ke client/frontend.

### Step 4: Setup Database

Buat tabel PostgreSQL di Supabase:

```bash
# SQL query untuk create tabel (lihat bagian Database Schema di bawah)
# Copy-paste semua SQL ke Supabase SQL Editor
```

Atau gunakan migration file jika ada.

### Step 5: Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

**Output yang diharapkan:**
```
  ▲ Next.js 16.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

---

## 🏃 Quick Start Guide

### Untuk Development

```bash
# 1. Install & setup (first time only)
npm install

# 2. Buat .env.local dengan kredensial Supabase

# 3. Run dev server
npm run dev

# 4. Buka http://localhost:3000
```

### Untuk Production

```bash
# 1. Build
npm run build

# 2. Start production server
npm run start

# 3. Deploy ke platform pilihan (Vercel, Railway, dsb)
```

### Testing & Linting

```bash
# Run linter
npm run lint

# Build check
npm run build

# Format code (optional)
npm run format
```



---

## 🗄 Konfigurasi Database

### Overview Database

```
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE POSTGRESQL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Authentication Layer (auth.users)                              │
│  └─ Email & Password hashing                                   │
│  └─ JWT token generation                                       │
│  └─ Session management                                         │
│                                                                 │
│  Core Tables:                                                   │
│  ├─ profiles          (User data linked to auth.users)         │
│  ├─ matakuliah        (Course catalog)                         │
│  ├─ kelas             (Class sessions)                         │
│  └─ matakuliah_diambil (Student enrollment history)            │
│                                                                 │
│  Academic Tables:                                               │
│  ├─ presensi_session  (Attendance sessions)                    │
│  ├─ presensi          (Individual attendance records)          │
│  ├─ post              (Course materials/assignments)           │
│  └─ tugas_submission  (Assignment submissions)                 │
│                                                                 │
│  KRS Management:                                                │
│  ├─ krs_pengajuan     (KRS requests)                           │
│  └─ krs_detail        (KRS details with courses)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tabel Database & Schema

#### 1. **profiles** - Data Pengguna
Linked ke `auth.users` untuk single source of truth authentication.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'dosen', 'kaprodi')),
  nim BIGINT UNIQUE,              -- Nomor Induk Mahasiswa (students)
  nidn TEXT UNIQUE,               -- Nomor Induk Dosen Nasional (dosen)
  nama_lengkap TEXT,              -- Full name
  jurusan TEXT,                   -- Major/Department
  fakultas TEXT,                  -- Faculty
  angkatan TEXT,                  -- Academic year (e.g., "2022")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes untuk performa
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);
CREATE UNIQUE INDEX idx_profiles_username ON profiles(username);
CREATE UNIQUE INDEX idx_profiles_nim ON profiles(nim) WHERE nim IS NOT NULL;
```

**Penjelasan Fields:**
- `id`: UUID dari auth.users (foreign key)
- `role`: Batasan hanya 3 nilai (student/dosen/kaprodi)
- `nim`: Hanya untuk mahasiswa, optional
- `nidn`: Hanya untuk dosen, optional

---

#### 2. **matakuliah** - Daftar Mata Kuliah
Katalog semua mata kuliah yang tersedia.

```sql
CREATE TABLE matakuliah (
  id SERIAL PRIMARY KEY,
  kode_mk TEXT NOT NULL UNIQUE,      -- Course code (e.g., "PROG101")
  nama_mk TEXT NOT NULL,              -- Course name
  sks INTEGER NOT NULL CHECK (sks > 0),  -- Credit hours (1-4)
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),  -- Semester
  dosen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matakuliah_dosen ON matakuliah(dosen_id);
CREATE INDEX idx_matakuliah_semester ON matakuliah(semester);
```

---

#### 3. **matakuliah_diambil** - Riwayat Nilai
Mencatat mata kuliah apa saja yang diambil mahasiswa dan nilainya.

```sql
CREATE TABLE matakuliah_diambil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mahasiswa_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matakuliah_id INTEGER NOT NULL REFERENCES matakuliah(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,            -- Which semester taken
  nilai_angka DECIMAL(3,2),          -- Numeric grade (0.0-4.0)
  nilai_huruf TEXT,                  -- Letter grade (A-E)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(mahasiswa_id, matakuliah_id)
);

CREATE INDEX idx_matakuliah_diambil_mahasiswa ON matakuliah_diambil(mahasiswa_id);
```

---

#### 4. **krs_pengajuan** - Pengajuan KRS
Request dari mahasiswa untuk daftar mata kuliah semester berikutnya.

```sql
CREATE TABLE krs_pengajuan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mahasiswa_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,            -- Target semester (e.g., "2024-1")
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  catatan TEXT,                      -- Notes from kaprodi
  total_sks INTEGER DEFAULT 0,       -- Total SKS requested
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_krs_pengajuan_mahasiswa ON krs_pengajuan(mahasiswa_id);
CREATE INDEX idx_krs_pengajuan_status ON krs_pengajuan(status);
```

---

#### 5. **krs_detail** - Detail KRS
Mata kuliah yang dipilih dalam setiap pengajuan KRS.

```sql
CREATE TABLE krs_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  krs_pengajuan_id UUID NOT NULL REFERENCES krs_pengajuan(id) ON DELETE CASCADE,
  matakuliah_id INTEGER NOT NULL REFERENCES matakuliah(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_krs_detail_krs ON krs_detail(krs_pengajuan_id);
```

---

#### 6. **presensi_session** - Sesi Presensi
Setiap pertemuan kelas memiliki sesi presensi.

```sql
CREATE TABLE presensi_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matakuliah_id INTEGER NOT NULL REFERENCES matakuliah(id) ON DELETE CASCADE,
  pertemuan INTEGER NOT NULL,        -- Meeting number (1, 2, 3, ...)
  start_time TIMESTAMP,              -- When attendance opens
  end_time TIMESTAMP,                -- When attendance closes
  kode_presensi TEXT,                -- QR code or unique code
  is_open BOOLEAN DEFAULT FALSE,     -- Current status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(matakuliah_id, pertemuan)
);

CREATE INDEX idx_presensi_session_mk ON presensi_session(matakuliah_id);
```

---

#### 7. **presensi** - Rekam Presensi Individual
Data presensi setiap mahasiswa per sesi.

```sql
CREATE TABLE presensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presensi_session_id UUID NOT NULL REFERENCES presensi_session(id) ON DELETE CASCADE,
  mahasiswa_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'hadir' CHECK (status IN ('hadir', 'izin', 'sakit', 'alpha')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(presensi_session_id, mahasiswa_id)
);

CREATE INDEX idx_presensi_mahasiswa ON presensi(mahasiswa_id);
CREATE INDEX idx_presensi_session ON presensi(presensi_session_id);
```

---

#### 8. **post** - Materi, Tugas, Pengumuman
Content yang diunggah dosen di setiap kelas.

```sql
CREATE TABLE post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matakuliah_id INTEGER NOT NULL REFERENCES matakuliah(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  judul TEXT NOT NULL,               -- Title
  konten TEXT,                       -- Content (markdown supported)
  jenis TEXT NOT NULL CHECK (jenis IN ('materi', 'tugas', 'pengumuman')),
  deadline TIMESTAMP WITH TIME ZONE, -- For assignments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_post_matakuliah ON post(matakuliah_id);
CREATE INDEX idx_post_created_by ON post(created_by);
CREATE INDEX idx_post_deadline ON post(deadline) WHERE jenis = 'tugas';
```

---

#### 9. **tugas_submission** - Pengumpulan Tugas
Submission mahasiswa untuk setiap tugas.

```sql
CREATE TABLE tugas_submission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES post(id) ON DELETE CASCADE,
  mahasiswa_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT,                     -- Link to submitted file
  catatan TEXT,                      -- Student notes
  nilai DECIMAL(5,2),                -- Grade (0-100)
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(post_id, mahasiswa_id)
);

CREATE INDEX idx_tugas_submission_post ON tugas_submission(post_id);
CREATE INDEX idx_tugas_submission_mahasiswa ON tugas_submission(mahasiswa_id);
```

---

### Row Level Security (RLS)

RLS memastikan data hanya bisa diakses oleh user yang berhak:

```sql
-- Enable RLS untuk semua tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matakuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE krs_pengajuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE presensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE post ENABLE ROW LEVEL SECURITY;
ALTER TABLE tugas_submission ENABLE ROW LEVEL SECURITY;

-- Contoh: Mahasiswa hanya bisa lihat data dirinya sendiri
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Contoh: Semua user authenticated bisa baca mata kuliah
CREATE POLICY "Anyone authenticated can read courses"
  ON matakuliah
  FOR SELECT
  TO authenticated
  USING (true);

-- Contoh: Mahasiswa hanya bisa lihat KRS miliknya
CREATE POLICY "Students can only see own KRS"
  ON krs_pengajuan
  FOR SELECT
  USING (auth.uid() = mahasiswa_id OR 
         (SELECT role FROM profiles WHERE id = auth.uid()) = 'kaprodi');
```

---

### Database Relationships

```
auth.users (Supabase built-in)
    │
    │ (1:1)
    ▼
profiles (User data)
    │
    ├─ (1:Many) → matakuliah_diambil (Enrollment history)
    ├─ (1:Many) → krs_pengajuan (KRS requests)
    ├─ (1:Many) → presensi (Attendance)
    ├─ (1:Many) → tugas_submission (Assignment submissions)
    └─ (1:Many) → post (As creator)

matakuliah (Courses)
    │
    ├─ (1:Many) → matakuliah_diambil
    ├─ (1:Many) → presensi_session
    ├─ (1:Many) → post
    └─ (Many:1) → profiles (Dosen)

presensi_session (Attendance sessions)
    │
    └─ (1:Many) → presensi

post (Materials/Assignments)
    │
    └─ (1:Many) → tugas_submission

krs_pengajuan (KRS requests)
    │
    └─ (1:Many) → krs_detail

krs_detail
    │
    └─ (Many:1) → matakuliah
```



---

## 🏃 Menjalankan Aplikasi

### Mode Development

Untuk development dengan hot-reload:

```bash
npm run dev
```

**Features:**
- ✅ Hot module replacement
- ✅ Fast refresh
- ✅ Source maps untuk debugging
- ✅ Error overlay dengan detail

Akses di [http://localhost:3000](http://localhost:3000)

### Mode Production

Build dan run untuk production:

```bash
# Build
npm run build

# Start server
npm run start
```

**Environment**: Production mode dengan optimization maksimal

### Linting & Code Quality

```bash
# Check code quality
npm run lint

# Build check (catch errors)
npm run build
```



---

## 📖 Panduan Penggunaan

### Login

**Langkah:**
1. Akses halaman login di `/login`
2. Masukkan email & password
3. Klik tombol "Login"
4. Sistem akan validasi kredensial ke Supabase Auth
5. Jika berhasil, redirect otomatis ke dashboard sesuai role

**Troubleshooting:**
- ❌ Email tidak terdaftar? Hubungi Kaprodi untuk dibuat akun
- ❌ Password salah? Gunakan "Lupa Password" untuk reset
- ❌ Error 400/500? Clear cache browser dan coba lagi

---

### Pengajuan KRS (Mahasiswa)

**Alur Pengajuan:**

1. **Buka halaman KRS** (Menu → KRS)
   - Lihat daftar mata kuliah yang tersedia
   - Filter berdasarkan semester
   
2. **Pilih Mata Kuliah**
   - Checkbox untuk select
   - Info: Kode MK, Nama, SKS, Dosen, Jadwal
   - Max 24 SKS per semester
   - Validasi otomatis mencegah exceed

3. **Review Pilihan**
   - Total SKS akan ditampilkan
   - Detail setiap MK bisa dilihat
   - Bisa remove MK sebelum submit

4. **Klik "Ajukan KRS"**
   - Konfirmasi dialog
   - Submit ke database
   - Status berubah ke **🟡 PENDING**

5. **Tunggu Persetujuan**
   - Kaprodi akan review
   - Notifikasi via sistem
   - Status bisa dilihat di Dashboard

6. **Hasil Approval:**
   - 🟢 **APPROVED** → MK tercatat di riwayat, bisa mulai kelas
   - 🔴 **REJECTED** → Bisa edit & ajukan ulang

---

### Persetujuan KRS (Kaprodi)

**Langkah Review:**

1. **Buka Menu KRS**
   - Lihat tab "Pending Approvals"
   - Daftar pengajuan dari mahasiswa

2. **Pilih Pengajuan untuk Review**
   - Klik kartu pengajuan
   - Lihat detail:
     - Nama mahasiswa
     - Mata kuliah yang dipilih
     - Total SKS
     - Tanggal pengajuan

3. **Validasi**
   - Cek total SKS (max 24)
   - Cek prasyarat MK (jika ada)
   - Cek duplikasi dengan semester sebelumnya

4. **Buat Keputusan**
   - **Approve** → Klik tombol "Setujui"
   - **Reject** → Klik tombol "Tolak" + input catatan

5. **Save & Notify**
   - Status update otomatis
   - Mahasiswa notified
   - Data tercatat di system

---

### Presensi Kelas (Student & Dosen)

#### Untuk Mahasiswa:

**Sebelum presensi dimulai (< 15 menit sebelum jam kelas):**
- Presensi belum terbuka
- Status: ❌ Presensi Ditutup

**Saat presensi aktif (0-15 menit setelah jam mulai):**
1. Buka halaman detail kelas
2. Klik tombol "Input Presensi"
3. Masukkan kode yang diberikan dosen
4. Klik "Konfirmasi"
5. Status berubah: ✅ **HADIR**

**Setelah jam presensi tutup (> 15 menit):**
- Presensi auto-closed
- Harus minta dosen untuk manual open ulang
- Status: ❌ Tidak Bisa Presensi

#### Untuk Dosen:

**Buka Presensi (otomatis pada jam mulai):**
1. Buka halaman detail kelas
2. Presensi session sudah aktif otomatis
3. Atau buka manual jika diperlukan

**Monitor Presensi:**
- Lihat realtime siapa saja yang sudah presensi
- Export daftar hadir
- Manual adjustment jika ada kendala

**Tutup Presensi (otomatis setelah 15 menit):**
- Presensi auto-closed
- Atau close manual jika ingin lebih cepat

**Recap Kehadiran:**
- Lihat persentase kehadiran per mahasiswa
- Daftar yang belum presensi
- Eksport untuk dokumentasi

---

### Manage User (Kaprodi)

**Akses:**
- Menu → Pengaturan → Manage User
- Hanya untuk role Kaprodi

**Create User Baru:**

1. Klik tombol "Tambah User"
2. Fill form lengkap:
   - Email (unique)
   - Password (min 8 char)
   - Username (unique)
   - Role (dropdown: student/dosen/kaprodi)
   - NIM/NIDN
   - Nama Lengkap
   - Jurusan/Fakultas
   - Angkatan

3. Klik "Simpan User"
4. Konfirmasi
5. User account created & siap digunakan

**View User List:**
- Daftar semua user di system
- Filter by role
- Search by nama/email
- Pagination untuk performance

**Edit User:**
- Klik user dari list
- Update data
- Klik "Simpan Perubahan"
- Notifikasi perubahan (optional)

**Delete User:**
- ⚠️ Hati-hati: Operasi ini permanent
- Data user terhapus dari system
- History data tetap tersimpan (optional soft delete)
- Konfirmasi double-check

---

### Fitur Lainnya

**Lihat Profil:**
- Menu → Profil
- Edit data personal
- Change password
- Lihat history login

**List Kelas:**
- Menu → List Kelas
- Mahasiswa: Kelas yang diikuti
- Dosen: Kelas yang diampu
- Filter & search
- Klik untuk detail

**KHS (Kartu Hasil Studi):**
- Menu → KHS
- Lihat nilai per semester
- Grade breakdown
- IPS & IPK
- Export ke PDF

**Pengaturan:**
- Menu → Pengaturan
- Theme color (future)
- Notification preferences
- Privacy settings



---

## 📊 Status Badge KRS

| Status      | Warna  | Keterangan                        |
| ----------- | ------ | --------------------------------- |
| 🟡 Pending  | Kuning | Menunggu review Kaprodi           |
| 🟢 Approved | Hijau  | Disetujui, MK tercatat di riwayat |
| 🔴 Rejected | Merah  | Ditolak, dapat mengajukan ulang   |

---

## � Troubleshooting & FAQ

### ❌ Error Umum & Solusi

**Q: Error "Email not found" saat login**
- **Penyebab**: Email belum terdaftar di system
- **Solusi**: Hubungi Kaprodi untuk membuat akun baru

**Q: Error "Invalid password"**
- **Penyebab**: Password salah
- **Solusi**: Klik "Lupa Password" untuk reset via email (dalam 30 menit)

**Q: Presensi tidak bisa dibuka**
- **Penyebab**: Diluar jam presensi (window 15 menit) atau session sudah ditutup
- **Solusi**: Hubungi dosen untuk manual open session kembali

**Q: KRS tidak bisa diajukan**
- **Penyebab**: Total SKS > 24, atau sudah ada KRS pending/approved
- **Solusi**: Remove beberapa MK atau tunggu keputusan KRS sebelumnya

**Q: Data user tidak muncul di Manage User**
- **Penyebab**: User terhapus, filter tidak sesuai, atau belum refresh
- **Solusi**: Clear cache browser, cek filter yang aktif, atau reload page

**Q: Database Error "RLS Policy Violation"**
- **Penyebab**: Login dengan role yang tidak punya akses data
- **Solusi**: Logout dan login dengan role yang benar, hubungi admin jika masalah role

**Q: Notifikasi tidak masuk**
- **Penyebab**: Notification disabled di Settings, browser belum allow permission, atau email di spam
- **Solusi**: Aktifkan di Settings, cek spam folder, atau allow browser permission

**Q: Connection timeout saat fetch data**
- **Penyebab**: Koneksi internet lemah atau server Supabase down
- **Solusi**: Check internet connection, retry dalam beberapa menit, atau buka https://status.supabase.com

---

### ❓ Pertanyaan Umum

**Q: Berapa SKS maksimal yang bisa diambil per semester?**
A: 24 SKS. Sistem validasi otomatis mencegah exceed limit.

**Q: Bisa edit KRS setelah diapprove?**
A: Tidak. Harus hubungi Kaprodi untuk revisi atau persetujuan khusus.

**Q: Apa itu presensi "15 menit window"?**
A: Presensi dibuka otomatis saat jam kelas mulai, dan ditutup otomatis 15 menit setelahnya. Designed untuk disiplin.

**Q: Bagaimana jika lupa kode presensi?**
A: Tanya ke dosen atau tunggu dosen generate kode baru. Biasanya diberikan di awal kelas.

**Q: Apakah bisa ganti password?**
A: Ya, Menu → Profil → Change Password. Email verification akan dikirim untuk keamanan.

**Q: Bagaimana kalau butuh reset akun?**
A: Hubungi Kaprodi/Admin. Bisa soft reset (clear history) atau hard reset (delete & recreate).

**Q: Data apa saja yang ter-backup otomatis?**
A: Semua data ter-backup di Supabase dengan replication & PITR (Point-in-Time Recovery) hingga 7 hari.

**Q: Apakah aplikasi support offline mode?**
A: Tidak saat ini. Butuh internet untuk connect ke server.

**Q: Bagaimana cara export data?**
A: KHS bisa export ke PDF. Data lain bisa request ke admin untuk extract dari database.

---

## 🔒 Keamanan

- **Authentication**: Supabase Auth dengan JWT
- **Authorization**: Role-based access control
- **Admin API**: Service role key untuk operasi admin
- **RLS**: Row Level Security di PostgreSQL
- **Environment**: Secrets di `.env.local`

---

<div align="center">

**SynClass** - Sistem Informasi Akademik Modern

Dibuat dengan ❤️ menggunakan Next.js dan Supabase

Tema: **Maroon** 🟤

</div>

---

## 🚀 Pengembangan Lanjutan

### Fitur yang Akan Datang (Roadmap)

- 📱 **Mobile App** untuk presensi dengan biometric fingerprint
- 📧 **Email Digest** notifikasi weekly dengan summary
- 📊 **Advanced Analytics** untuk insights akademik
- 🔔 **Real-time Push Notification** via WebSocket
- 🗂️ **Document Management** untuk upload assignment & materi
- 🤖 **AI Grade Prediction** dengan machine learning
- 🌍 **Multi-language Support** (Indonesian, English, Mandarin)
- 📅 **Academic Calendar Integration** dengan holiday sync
- 📈 **Performance Analytics** untuk dosen & mahasiswa
- 🎓 **Diploma Generation** otomatis saat lulus

---

## 🤝 Berkontribusi

Tertarik berkontribusi ke SynClass? Silakan ikuti langkah ini:

1. **Fork repository** ini
2. **Buat branch baru** untuk feature Anda:
   ```bash
   git checkout -b feature/DescriptiveFeatureName
   ```
3. **Commit changes** dengan pesan yang jelas:
   ```bash
   git commit -m 'Add: Deskripsi fitur yang ditambahkan'
   ```
4. **Push ke branch**:
   ```bash
   git push origin feature/DescriptiveFeatureName
   ```
5. **Buat Pull Request** dengan deskripsi detail

### Coding Standards

- Gunakan **TypeScript** untuk type safety
- Ikuti **ESLint** config (run `npm run lint`)
- Tambah **comments** untuk logic yang kompleks
- Buat **unit tests** untuk fitur baru (future)
- Update **README.md** jika ada perubahan API

---

## 📝 Lisensi

MIT License - Bebas digunakan, dimodifikasi, dan didistribusikan dengan leluasa.

---

## 📞 Support & Kontak

Butuh bantuan atau ingin berbagi feedback?

- 📧 **Email**: laurentiusdika28@gmail.com
- 🐛 **Report Bug**: Buka Issue di GitHub
- 💡 **Request Feature**: Buka Discussion di GitHub

---

## 🙏 Terima Kasih

Terima kasih kepada:
- ✨ **Supabase** - Backend infrastructure & database
- ⚡ **Next.js** - React framework
- 🎨 **Tailwind CSS** - CSS framework
- 📦 **TypeScript** - Type safety
- 🚀 Semua kontributor dan pengguna SynClass!

---

<div align="center">

### 🏆 SynClass - Sistem Informasi Akademik Modern

**"Excellence in Academic Management"**

Dibuat dengan ❤️ untuk **Keunggulan Akademik**

**Last Updated**: 2024 | **Version**: 1.0.0 | **Status**: Active Development 🚀

</div>
