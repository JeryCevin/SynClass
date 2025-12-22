# 🎓 SynClass

**Sistem Informasi Akademik Terintegrasi**

SynClass adalah aplikasi web modern berbasis Next.js yang dirancang untuk mengelola kegiatan akademik perguruan tinggi secara efisien. Aplikasi ini menyediakan antarmuka yang intuitif untuk mahasiswa, dosen, dan kaprodi dalam mengelola data akademik, kelas, nilai, dan informasi pengguna.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Peran Pengguna](#-peran-pengguna)
- [API dan Database](#-api-dan-database)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi

- **Login Aman** - Sistem login terintegrasi dengan Supabase Auth
- **Role-Based Access Control** - Tiga level akses: Kaprodi, Dosen, dan Mahasiswa
- **Session Management** - Pengelolaan sesi pengguna yang aman
- **Logout** - Fitur keluar yang membersihkan sesi dengan aman

### 🏠 Dashboard

- **Tampilan Ringkasan** - Informasi status, total SKS, jumlah kelas, dan IPK
- **Aktivitas Terbaru** - Menampilkan aktivitas akademik terkini
- **Akses Cepat** - Navigasi cepat ke fitur-fitur utama
- **Tampilan Tanggal** - Menampilkan tanggal hari ini

### 👤 Profil Pengguna

- **Informasi Profil** - Menampilkan data nama, NIM/NIP, jurusan, angkatan, dan fakultas
- **Integrasi Database** - Data profil diambil langsung dari Supabase
- **Ubah Password** - Fitur untuk mengubah password akun
- **Tampilan Responsif** - Desain yang menyesuaikan berbagai ukuran layar

### 📚 List Kelas

- **Daftar Kelas** - Menampilkan semua kelas yang diikuti
- **Informasi Lengkap** - Kode mata kuliah, jadwal, dan nama dosen
- **Akses Materi** - Tombol akses ke materi pembelajaran
- **Presensi** - Fitur untuk melakukan presensi kelas

### 📄 Kartu Rencana Studi (KRS)

Fitur KRS memiliki **dua tampilan berbeda** berdasarkan role pengguna:

#### 👨‍🎓 Tampilan Mahasiswa

- **Daftar Mata Kuliah Tersedia** - Menampilkan mata kuliah yang belum pernah diambil
- **Pengelompokan Semester** - Mata kuliah dikelompokkan berdasarkan semester
- **Pemilihan Interaktif** - Checkbox untuk memilih mata kuliah yang diinginkan
- **Kalkulasi SKS Otomatis** - Total SKS dihitung secara real-time (maks. 24 SKS)
- **Status Pengajuan** - Menampilkan status (pending/approved/rejected)
- **Edit Pengajuan** - Dapat mengubah pengajuan selama belum disetujui
- **Catatan Kaprodi** - Melihat feedback dari Kaprodi jika ada

#### 👔 Tampilan Kaprodi

- **Dashboard Summary** - Statistik total, pending, approved, rejected
- **Daftar Pengajuan** - List semua pengajuan KRS mahasiswa
- **Detail Review** - Melihat detail mata kuliah yang diajukan
- **Approve/Reject** - Menyetujui atau menolak pengajuan
- **Catatan** - Memberikan catatan/feedback ke mahasiswa
- **Auto-Record** - Mata kuliah otomatis tercatat saat disetujui

### 📊 Kartu Hasil Studi (KHS)

- **Nilai Semester** - Menampilkan nilai per mata kuliah
- **Indeks Prestasi** - Perhitungan IPS (Indeks Prestasi Semester)
- **Detail Nilai** - Kode, nama mata kuliah, SKS, nilai huruf, dan mutu
- **Riwayat Akademik** - Informasi semester dan tahun ajaran

### ⚙️ Pengaturan (Settings)

#### 👥 Manajemen User

- **Pembagian Role** - Tampilan terpisah untuk Mahasiswa, Dosen, dan Kaprodi
- **Summary Cards** - Statistik jumlah pengguna per kategori
- **CRUD User** - Tambah, edit, dan hapus pengguna
- **Informasi Lengkap** - Nama, NIM/NIDN, Fakultas, Program Studi, dan Role
- **Modal Form** - Form interaktif untuk tambah/edit pengguna

#### 📚 Manajemen Mata Kuliah

- **CRUD Lengkap** - Tambah, baca, ubah, hapus mata kuliah
- **Pengelompokan Semester** - Mata kuliah dikelompokkan berdasarkan semester
- **Pencarian** - Fitur pencarian berdasarkan kode atau nama mata kuliah
- **Statistik** - Total mata kuliah, total SKS, jumlah semester
- **Warna Dinamis** - Setiap semester memiliki warna gradient berbeda
- **Integrasi Supabase** - Data tersimpan di tabel `matakuliah`

### 🎨 Antarmuka Pengguna

- **Sidebar Responsif** - Sidebar yang dapat di-collapse/expand
- **Menu Dinamis** - Menu yang muncul sesuai dengan role pengguna
- **Desain Modern** - Tampilan menggunakan Tailwind CSS dengan gradient dan shadow
- **Hover Effects** - Animasi interaktif pada tombol dan kartu
- **Loading States** - Indikator loading saat memuat data
- **Error Handling** - Pesan error yang informatif

---

## 🛠 Teknologi yang Digunakan

| Teknologi        | Versi  | Keterangan                             |
| ---------------- | ------ | -------------------------------------- |
| **Next.js**      | 16.1.0 | Framework React untuk production       |
| **React**        | 19.2.3 | Library UI component-based             |
| **TypeScript**   | 5.x    | Superset JavaScript dengan type safety |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework            |
| **Supabase**     | 2.89.0 | Backend-as-a-Service (Auth & Database) |
| **PostCSS**      | 8.5.6  | CSS processor                          |
| **ESLint**       | 9.x    | Linting dan code quality               |

---

## 📁 Struktur Proyek

```
SynClass/
├── app/                          # App Router (Next.js 13+)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout dengan Sidebar
│   ├── page.tsx                 # Dashboard (halaman utama)
│   ├── login/
│   │   └── page.tsx             # Halaman login
│   ├── profil/
│   │   └── page.tsx             # Halaman profil pengguna
│   ├── list-kelas/
│   │   └── page.tsx             # Daftar kelas
│   ├── krs/
│   │   └── page.tsx             # Kartu Rencana Studi
│   ├── khs/
│   │   └── page.tsx             # Kartu Hasil Studi
│   ├── manage-user/
│   │   └── page.tsx             # Manajemen user (Kaprodi only)
│   └── settings/
│       └── page.tsx             # Pengaturan sistem
├── components/
│   └── Sidebar.tsx              # Komponen navigasi sidebar
├── utils/
│   └── supabase/
│       └── client.ts            # Supabase client configuration
├── public/                       # Static assets
├── package.json                 # Dependencies dan scripts
├── tailwind.config.ts           # Konfigurasi Tailwind CSS
├── tsconfig.json                # Konfigurasi TypeScript
├── next.config.ts               # Konfigurasi Next.js
└── README.md                    # Dokumentasi proyek
```

---

## 🚀 Instalasi

### Prasyarat

Pastikan sistem Anda telah terinstal:

- **Node.js** versi 18.x atau lebih baru
- **npm**, **yarn**, **pnpm**, atau **bun**
- Akun **Supabase** (gratis di [supabase.com](https://supabase.com))

### Langkah Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/username/synclass.git
   cd synclass
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup Environment Variables**

   Buat file `.env.local` di root proyek:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

## ⚙️ Konfigurasi

### Konfigurasi Supabase

1. Buat proyek baru di [Supabase Dashboard](https://app.supabase.com)

2. **Buat Tabel `profiles`**

   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT,
     username TEXT,
     full_name TEXT,
     role TEXT DEFAULT 'mahasiswa',
     nomor_induk TEXT,
     nidn TEXT,
     jurusan TEXT,
     fakultas TEXT,
     angkatan TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Buat Tabel `matakuliah`**

   ```sql
   CREATE TABLE matakuliah (
     id SERIAL PRIMARY KEY,
     kode_mk TEXT NOT NULL,
     nama_mk TEXT NOT NULL,
     sks INTEGER NOT NULL,
     semester INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Setup Row Level Security (RLS)**

   Aktifkan RLS dan buat policy sesuai kebutuhan untuk mengamankan data.

---

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 📖 Panduan Penggunaan

### Login ke Sistem

1. Akses halaman login di `/login`
2. Masukkan email dan password yang terdaftar di Supabase Auth
3. Sistem akan mendeteksi role berdasarkan email:
   - Email mengandung "admin" atau "kaprodi" → Role **Kaprodi**
   - Email mengandung "dosen" → Role **Dosen**
   - Email lainnya → Role **Mahasiswa**

### Navigasi Aplikasi

- Gunakan **Sidebar** di sebelah kiri untuk berpindah halaman
- Klik tombol **◀/▶** untuk memperkecil/memperbesar sidebar
- Menu yang tampil disesuaikan dengan role pengguna

### Manajemen Mata Kuliah (Settings)

1. Masuk ke menu **Pengaturan**
2. Pilih tab **Mata Kuliah**
3. Klik **Tambah Mata Kuliah** untuk menambah data baru
4. Isi form: Kode MK, Nama MK, SKS, dan Semester
5. Data akan tersimpan ke database Supabase

### Pengajuan KRS (Mahasiswa)

1. Login sebagai **Mahasiswa**
2. Buka menu **KRS** di sidebar
3. Lihat daftar mata kuliah yang tersedia (dikelompokkan per semester)
4. Klik pada mata kuliah untuk memilih/membatalkan
5. Perhatikan **Total SKS** di sidebar kanan (maksimal 24 SKS)
6. Klik tombol **Ajukan KRS** untuk mengirim pengajuan
7. Tunggu persetujuan dari Kaprodi
8. Cek status pengajuan di bagian atas halaman:
   - 🟡 **Pending** - Menunggu persetujuan
   - 🟢 **Approved** - Disetujui (tidak dapat diubah)
   - 🔴 **Rejected** - Ditolak (dapat mengajukan ulang)

### Persetujuan KRS (Kaprodi)

1. Login sebagai **Kaprodi**
2. Buka menu **KRS** di sidebar
3. Lihat **Dashboard Summary** untuk statistik pengajuan
4. Pilih pengajuan dari daftar di sebelah kiri
5. Review detail pengajuan di panel kanan:
   - Nama dan jurusan mahasiswa
   - Daftar mata kuliah yang diajukan
   - Total SKS
6. (Opsional) Tambahkan catatan untuk mahasiswa
7. Klik **Setujui** atau **Tolak**
8. Jika disetujui, mata kuliah otomatis tercatat ke riwayat mahasiswa

### Alur Kerja KRS

```
┌─────────────────────────────────────────────────────────────────┐
│                         ALUR KRS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  MAHASISWA   │    │   KAPRODI    │    │   SISTEM     │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         │ 1. Pilih MK       │                   │               │
│         ├──────────────────►│                   │               │
│         │                   │                   │               │
│         │ 2. Ajukan KRS     │                   │               │
│         ├──────────────────►│                   │               │
│         │                   │                   │               │
│         │    [PENDING]      │ 3. Review         │               │
│         │◄──────────────────┤    Pengajuan      │               │
│         │                   │                   │               │
│         │                   │ 4. Approve/Reject │               │
│         │                   ├──────────────────►│               │
│         │                   │                   │               │
│         │  [APPROVED]       │                   │ 5. Simpan ke  │
│         │◄──────────────────┤◄──────────────────┤    Riwayat    │
│         │                   │                   │               │
│         │  [REJECTED]       │                   │               │
│         │◄──────────────────┤                   │               │
│         │                   │                   │               │
│         │ 6. Edit &         │                   │               │
│         │    Ajukan Ulang   │                   │               │
│         ├──────────────────►│                   │               │
│         │                   │                   │               │
└─────────┴───────────────────┴───────────────────┴───────────────┘
```

### Aturan Bisnis KRS

| Aturan                   | Keterangan                                 |
| ------------------------ | ------------------------------------------ |
| **Maksimal SKS**         | 24 SKS per semester                        |
| **Mata Kuliah Tersedia** | Hanya yang belum pernah diambil            |
| **Edit Pengajuan**       | Hanya saat status pending atau rejected    |
| **Pengajuan Disetujui**  | Tidak dapat diubah, MK tercatat di riwayat |
| **Semester Aktif**       | Pengajuan hanya untuk semester berjalan    |

---

## 👥 Peran Pengguna

| Role          | Akses Menu                                          | Deskripsi                                             |
| ------------- | --------------------------------------------------- | ----------------------------------------------------- |
| **Kaprodi**   | Semua menu                                          | Administrator dengan akses penuh termasuk manage user |
| **Dosen**     | Dashboard, Profil, List Kelas, KRS, KHS, Pengaturan | Pengajar dengan akses ke fitur akademik               |
| **Mahasiswa** | Dashboard, Profil, List Kelas, KRS, KHS, Pengaturan | Peserta didik dengan akses standar                    |

---

## 🗄️ API dan Database

### Tabel Database

| Tabel                | Deskripsi                                                |
| -------------------- | -------------------------------------------------------- |
| `profiles`           | Data profil pengguna (nama, email, role, NIM/NIDN, dll.) |
| `matakuliah`         | Data mata kuliah (kode, nama, SKS, semester)             |
| `krs_pengajuan`      | Header pengajuan KRS (mahasiswa, semester, status)       |
| `krs_detail`         | Detail mata kuliah dalam pengajuan KRS                   |
| `matakuliah_diambil` | Riwayat mata kuliah yang sudah diambil/disetujui         |

### Schema Tabel KRS

```sql
-- Tabel pengajuan KRS (header)
CREATE TABLE krs_pengajuan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mahasiswa_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  catatan TEXT,
  total_sks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel detail mata kuliah dalam pengajuan
CREATE TABLE krs_detail (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  krs_pengajuan_id UUID REFERENCES krs_pengajuan(id) ON DELETE CASCADE,
  matakuliah_id INTEGER REFERENCES matakuliah(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel riwayat mata kuliah yang sudah diambil
CREATE TABLE matakuliah_diambil (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mahasiswa_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matakuliah_id INTEGER REFERENCES matakuliah(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  nilai TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mahasiswa_id, matakuliah_id)
);

-- Index untuk performa
CREATE INDEX idx_krs_pengajuan_mahasiswa ON krs_pengajuan(mahasiswa_id);
CREATE INDEX idx_krs_pengajuan_status ON krs_pengajuan(status);
CREATE INDEX idx_krs_detail_pengajuan ON krs_detail(krs_pengajuan_id);
CREATE INDEX idx_matakuliah_diambil_mahasiswa ON matakuliah_diambil(mahasiswa_id);
```

### Supabase Client

File konfigurasi Supabase client terletak di:

```
utils/supabase/client.ts
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/FiturBaru`)
3. Commit perubahan (`git commit -m 'Menambah FiturBaru'`)
4. Push ke branch (`git push origin fitur/FiturBaru`)
5. Buat Pull Request

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

<div align="center">

**SynClass** - Sistem Informasi Akademik Modern

Dibuat dengan ❤️ menggunakan Next.js dan Supabase

</div>
