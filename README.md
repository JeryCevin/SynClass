# � SynClass - Sistem Informasi Akademik Modern

<div align="center">

**Web Service RESTful untuk Manajemen Akademik Perguruan Tinggi**  
**📘 Dokumentasi Lengkap - Semua dalam 1 File**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 📖 Tentang Project

**SynClass** adalah platform **Web Service** modern yang menyediakan backend lengkap untuk sistem informasi akademik. Dibangun dengan arsitektur **RESTful API**, SynClass mendukung **multi-platform client** (Web & Mobile) dengan keamanan berlapis menggunakan **JWT Authentication** dan **Row Level Security (RLS)**.

### 🎯 Apa yang Membuat SynClass Unik?

| Feature | Description |
|---------|-------------|
| ✅ **Complete Web Service** | RESTful API dengan 18+ endpoints untuk mobile integration |
| ✅ **Stateless & Scalable** | JWT-based auth, serverless deployment ready |
| ✅ **Multi-Role System** | Mahasiswa, Dosen, Kaprodi dengan RBAC |
| ✅ **Database Security** | PostgreSQL dengan Row Level Security policies |
| ✅ **Production Ready** | Deploy ke Vercel dalam menit, auto-scaling |
| ✅ **Developer Friendly** | Comprehensive docs, Postman collection, code examples |

---

## 📋 Daftar Isi Lengkap

> **💡 TIP:** Klik link dibawah untuk langsung ke bagian yang Anda butuhkan!  
> **📄 Total:** 3400+ baris dokumentasi lengkap dalam 1 file

### 🚀 PART 1: GETTING STARTED
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)  
- [Deploy ke Vercel](#deploy-ke-vercel)

### 🏗️ PART 2: ARSITEKTUR & KONSEP SISTEM
- [Diagram Arsitektur Lengkap](#diagram-arsitektur-lengkap)
- [Layer-by-Layer Explanation](#layer-by-layer-explanation)
- [Data Flow: Login hingga Mendapatkan Data](#data-flow-login-hingga-mendapatkan-data)
- [Security Layers](#security-layers)
- [Database Schema & ERD](#database-schema)
- [API Design Pattern](#api-design-pattern)
- [Kesimpulan Arsitektur](#kesimpulan)

### 📱 PART 3: MOBILE INTEGRATION GUIDE
- [Quick Start Mobile](#quick-start)
- [Authentication Flow](#authentication-flow)
- [API Endpoints Reference](#api-endpoints-reference)
  - [Student Endpoints](#student-endpoints)
  - [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
- [Flutter Integration](#flutter-integration)
  - [Setup Dependencies](#setup-dependencies)
  - [API Service Class](#1-api-service-class)
  - [Auth Service](#2-auth-service)
  - [Student Service](#3-student-service)
  - [Example UI](#4-example-usage-in-ui)
- [React Native Integration](#react-native-integration)
  - [Setup Dependencies](#setup-dependencies-1)
  - [API Service](#1-api-service)
  - [Auth Service](#2-auth-service-1)
  - [Student Service](#3-student-service-1)
  - [Example Components](#4-example-usage-in-components)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Testing dengan Postman](#testing-dengan-postman)

### ❓ PART 4: FAQ & TROUBLESHOOTING  
- [FAQ - Pertanyaan Umum](#faq---pertanyaan-umum)
  - [Konsep Dasar](#-konsep-dasar)
  - [Authentication & Security](#-authentication--security)
  - [Mobile Integration](#-mobile-integration)
  - [Database](#-database)
  - [Deployment](#-deployment)
- [Troubleshooting](#troubleshooting---pemecahan-masalah)
  - [Development Issues](#-development-issues)
  - [Authentication Issues](#-authentication-issues)
  - [Mobile Integration Issues](#-mobile-integration-issues)
  - [Database Issues](#-database-issues)
  - [Deployment Issues](#-deployment-issues)
- [Best Practices](#best-practices-1)
  - [Security](#-security)
  - [Mobile Development](#-mobile-development)
  - [Code Quality](#-code-quality)
- [Performance Tips](#performance-tips)

---

# 🚀 PART 1: GETTING STARTED

## Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih baru
- **npm/yarn/pnpm/bun**
- Akun **Supabase** gratis ([sign up](https://supabase.com))
- **Git**

### Installation

```bash
# Clone repository
git clone https://github.com/username/synclass.git
cd synclass

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials Anda

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> 📌 **Cara mendapatkan keys:** Login ke [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

---

## Deploy ke Vercel

### Step-by-Step

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import ke Vercel:**
   - Login ke [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Set Environment Variables:**
   - Di Vercel Dashboard → Settings → Environment Variables
   - Add semua vars dari `.env.local`

4. **Deploy:**
   - Click "Deploy"
   - Tunggu build selesai (~2 menit)
   - Your app live di `https://your-app.vercel.app`

### Auto-Deploy

Setiap `git push` ke branch `main` akan otomatis trigger deployment baru!

---

# 🏗️ PART 2: ARSITEKTUR & KONSEP SISTEM

> **Panduan lengkap untuk memahami arsitektur, konsep, dan teknologi yang digunakan di SynClass**

---

## Diagram Arsitektur Lengkap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT LAYER (Cloud)                            │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                        VERCEL HOSTING                              │     │
│  │  • Serverless Functions                                            │     │
│  │  • Edge Network (CDN)                                               │     │
│  │  • Auto-scaling                                                     │     │
│  │  • HTTPS/SSL by default                                             │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Multi-Platform)                      │
│                                                                             │
│  ┌──────────────────────────┐            ┌───────────────────────────┐      │
│  │   WEB APPLICATION        │            │    MOBILE APPLICATION     │      │
│  │   (Browser-based)        │            │    (Flutter/React Native) │      │
│  ├──────────────────────────┤            ├───────────────────────────┤      │
│  │ • Next.js Frontend       │            │ • REST API Client         │      │
│  │ • React 19 Components    │            │ • HTTP/HTTPS Requests     │      │
│  │ • Tailwind CSS           │            │ • JWT Token Storage       │      │
│  │ • Supabase Client        │            │ • Secure Storage          │      │
│  │ • Server Components      │            │ • JSON Parser             │      │
│  └───────────┬──────────────┘            └─────────┬─────────────────┘      │
│              │                                     │                        │
│              │  HTTP/HTTPS                         │  HTTP/HTTPS            │
│              │  (Supabase SDK)                     │  (REST API)            │
│              │                                     │                        │
└──────────────┼─────────────────────────────────────┼────────────────────────┘
               │                                     │
               ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER (Backend)                         │
│                            Next.js API Routes                               │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                      PUBLIC ENDPOINTS                              │     │
│  │  (Tidak perlu authentication)                                      │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │  POST /api/mobile/auth/login       → Login mahasiswa/dosen        │     │
│  │  POST /api/mobile/auth/refresh     → Refresh access token         │     │
│  │  POST /api/mobile/auth/logout      → Logout user                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    PROTECTED ENDPOINTS                             │     │
│  │  (Wajib JWT Token + Role Student)                                  │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │  GET  /api/mobile/student/profile         → User profile          │     │
│  │  PUT  /api/mobile/student/profile         → Update profile        │     │
│  │  GET  /api/mobile/student/classes         → Enrolled classes      │     │
│  │  GET  /api/mobile/student/classes/:id     → Class detail          │     │
│  │  GET  /api/mobile/student/krs             → KRS data              │     │
│  │  POST /api/mobile/student/krs             → Submit KRS            │     │
│  │  GET  /api/mobile/student/grades          → Grades & transcript   │     │
│  │  GET  /api/mobile/student/attendance      → Attendance records    │     │
│  │  GET  /api/mobile/student/assignments     → Assignment list       │     │
│  │  POST /api/mobile/student/assignments/:id/submit → Submit tugas   │     │
│  │  GET  /api/mobile/student/materials       → Learning materials    │     │
│  │  GET  /api/mobile/student/matakuliah      → Available courses     │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                      ADMIN ENDPOINTS                               │     │
│  │  (Wajib SERVICE_ROLE_KEY - Server-side only)                       │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │  POST /api/admin/create-user       → Create user baru             │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                   MIDDLEWARE LAYER                                 │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │  1. verifyToken()         → Extract & verify JWT                  │     │
│  │  2. checkStudentRole()    → Verify role = 'student'               │     │
│  │  3. errorResponse()       → Standardize error format              │     │
│  │  4. successResponse()     → Standardize success format            │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                             HTTPS/WebSocket
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Supabase Cloud)                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │                   AUTHENTICATION SERVICE                          │      │
│  ├───────────────────────────────────────────────────────────────────┤      │
│  │  • JWT Token Generation (HS256)                                   │      │
│  │  • Token Validation & Refresh                                     │      │
│  │  • Password Hashing (bcrypt)                                      │      │
│  │  • Session Management                                             │      │
│  │  • Email Verification                                             │      │
│  │                                                                   │      │
│  │  Tables:                                                          │      │
│  │  ├─ auth.users (user credentials - managed by Supabase)          │      │
│  │  └─ auth.sessions (active sessions)                              │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │                   POSTGRESQL DATABASE                             │      │
│  │                   (Relational Database)                           │      │
│  ├───────────────────────────────────────────────────────────────────┤      │
│  │                                                                   │      │
│  │  ┌─────────────────────────────────────────────────────────┐      │      │
│  │  │  USER & PROFILE TABLES                                  │      │      │
│  │  ├─────────────────────────────────────────────────────────┤      │      │
│  │  │  • profiles (extended user data)                        │      │      │
│  │  │    ├─ id (FK → auth.users)                              │      │      │
│  │  │    ├─ username, email, nim, nidn                        │      │      │
│  │  │    ├─ role (student/dosen/kaprodi)                      │      │      │
│  │  │    ├─ jurusan, fakultas, angkatan                       │      │      │
│  │  │    └─ RLS: User hanya akses data sendiri               │      │      │
│  │  └─────────────────────────────────────────────────────────┘      │      │
│  │                                                                   │      │
│  │  ┌─────────────────────────────────────────────────────────┐      │      │
│  │  │  ACADEMIC TABLES                                        │      │      │
│  │  ├─────────────────────────────────────────────────────────┤      │      │
│  │  │  • matakuliah (courses)                                 │      │      │
│  │  │    ├─ nama_mk, kode_mk, sks                             │      │      │
│  │  │    ├─ dosen_id (FK → profiles)                          │      │      │
│  │  │    ├─ hari, jam_mulai, jam_selesai, ruang              │      │      │
│  │  │    └─ RLS: Public read for authenticated users         │      │      │
│  │  │                                                         │      │      │
│  │  │  • krs_pengajuan (student enrollment)                  │      │      │
│  │  │    ├─ mahasiswa_id (FK → profiles)                      │      │      │
│  │  │    ├─ matakuliah_id (FK → matakuliah)                   │      │      │
│  │  │    ├─ status (pending/approved/rejected)               │      │      │
│  │  │    ├─ semester, tahun_ajaran                           │      │      │
│  │  │    └─ RLS: Students see own, Kaprodi see all          │      │      │
│  │  │                                                         │      │      │
│  │  │  • nilai (grades)                                       │      │      │
│  │  │    ├─ mahasiswa_id (FK → profiles)                      │      │      │
│  │  │    ├─ matakuliah_id (FK → matakuliah)                   │      │      │
│  │  │    ├─ nilai_angka, nilai_huruf, semester              │      │      │
│  │  │    └─ RLS: Students see own grades only               │      │      │
│  │  │                                                         │      │      │
│  │  │  • presensi_session (attendance sessions)              │      │      │
│  │  │    ├─ matakuliah_id (FK → matakuliah)                   │      │      │
│  │  │    ├─ tanggal, pertemuan_ke, qr_code                  │      │      │
│  │  │    └─ RLS: Dosen manage, Students read                │      │      │
│  │  │                                                         │      │      │
│  │  │  • presensi_mahasiswa (student attendance)             │      │      │
│  │  │    ├─ session_id (FK → presensi_session)               │      │      │
│  │  │    ├─ mahasiswa_id (FK → profiles)                      │      │      │
│  │  │    ├─ status (hadir/izin/sakit/alpha)                 │      │      │
│  │  │    └─ RLS: Students see own, Dosen see class          │      │      │
│  │  └─────────────────────────────────────────────────────────┘      │      │
│  │                                                                   │      │
│  │  ┌─────────────────────────────────────────────────────────┐      │      │
│  │  │  LEARNING MANAGEMENT TABLES                             │      │      │
│  │  ├─────────────────────────────────────────────────────────┤      │      │
│  │  │  • post (materials, assignments, announcements)         │      │      │
│  │  │    ├─ matakuliah_id (FK → matakuliah)                   │      │      │
│  │  │    ├─ author_id (FK → profiles - dosen)                 │      │      │
│  │  │    ├─ jenis_post (materi/tugas/pengumuman)             │      │      │
│  │  │    ├─ judul, konten, file_url                          │      │      │
│  │  │    ├─ deadline (untuk tugas)                           │      │      │
│  │  │    └─ RLS: Students read, Dosen CRUD                   │      │      │
│  │  │                                                         │      │      │
│  │  │  • tugas_submission (assignment submissions)           │      │      │
│  │  │    ├─ post_id (FK → post)                               │      │      │
│  │  │    ├─ mahasiswa_id (FK → profiles)                      │      │      │
│  │  │    ├─ jawaban, file_url                                │      │      │
│  │  │    ├─ submitted_at, nilai                              │      │      │
│  │  │    └─ RLS: Students submit own, Dosen grade            │      │      │
│  │  └─────────────────────────────────────────────────────────┘      │      │
│  │                                                                   │      │
│  │  ┌─────────────────────────────────────────────────────────┐      │      │
│  │  │  ROW LEVEL SECURITY (RLS) POLICIES                      │      │      │
│  │  ├─────────────────────────────────────────────────────────┤      │      │
│  │  │  Semua tabel di atas memiliki RLS policies:             │      │      │
│  │  │  • ENABLE ROW LEVEL SECURITY                            │      │      │
│  │  │  • CREATE POLICY untuk SELECT, INSERT, UPDATE, DELETE   │      │      │
│  │  │  • Berdasarkan auth.uid() dan role                      │      │      │
│  │  │  • Automatic data filtering per user                    │      │      │
│  │  └─────────────────────────────────────────────────────────┘      │      │
│  │                                                                   │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │                      STORAGE SERVICE                              │      │
│  ├───────────────────────────────────────────────────────────────────┤      │
│  │  • File Upload/Download (images, PDFs, documents)                 │      │
│  │  • CDN Integration                                                │      │
│  │  • Access Control (RLS for buckets)                               │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Explanation

### 1. **Deployment Layer (Vercel)**

**Fungsi:** Hosting aplikasi di cloud dengan serverless architecture

**Komponen:**
- **Serverless Functions** - API routes di-deploy sebagai functions
- **Edge Network** - CDN untuk static assets
- **Auto-scaling** - Otomatis scale sesuai traffic
- **HTTPS/SSL** - Enkripsi koneksi by default

**Keuntungan:**
- ✅ Zero configuration deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables management
- ✅ Git integration (auto-deploy on push)

---

### 2. **Client Layer (Multi-Platform)**

**A. Web Application (Next.js Frontend)**

```
User mengakses: https://synclass.vercel.app
       ↓
Next.js Server Components render HTML
       ↓
Kirim ke browser
       ↓
React hydration (interactivity)
       ↓
Supabase Client connect ke database
```

**Fitur:**
- Server-side rendering (SSR)
- Client-side navigation
- Supabase realtime subscriptions
- Automatic code splitting

**B. Mobile Application (Flutter/React Native)**

```
User buka app
       ↓
Load dari secure storage: access_token
       ↓
HTTP request ke API dengan Bearer token
       ↓
Parse JSON response
       ↓
Display data
```

**Fitur:**
- REST API integration
- Secure token storage
- Offline capability (cache)
- Push notifications (future)

---

### 3. **Application Layer (Next.js Backend)**

**Architecture Pattern:** Model-View-Controller (MVC)

```
Request → Middleware → Controller → Model → Database
                          ↓
                      Response
```

#### **Middleware Functions** (`app/api/mobile/lib/auth.ts`):

```typescript
// 1. Token Verification
export async function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return errorResponse('Missing token', 'NO_TOKEN', 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error) {
    return errorResponse('Invalid token', 'INVALID_TOKEN', 401);
  }
  
  return { success: true, userId: user.id, userEmail: user.email };
}

// 2. Role Verification
export async function checkStudentRole(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (profile.role !== 'student') {
    return errorResponse('Access denied', 'INVALID_ROLE', 403);
  }
  
  return { success: true };
}

// 3. Standard Response Helpers
export function successResponse(data: any, message = 'Success', status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function errorResponse(error: string, code: string, status = 400) {
  return NextResponse.json({ success: false, error, code }, { status });
}
```

#### **Controller Example** (`app/api/mobile/student/profile/route.ts`):

```typescript
export async function GET(request: NextRequest) {
  // 1. Verify JWT Token
  const tokenResult = await verifyToken(request);
  if (!tokenResult.success) {
    return errorResponse('Unauthorized', 'NO_TOKEN', 401);
  }
  
  // 2. Check Role
  const roleResult = await checkStudentRole(tokenResult.userId!);
  if (!roleResult.success) {
    return errorResponse('Access denied', 'INVALID_ROLE', 403);
  }
  
  // 3. Query Database (with RLS auto-filter)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', tokenResult.userId)
    .single();
  
  if (error) {
    return errorResponse('Profile not found', 'NOT_FOUND', 404);
  }
  
  // 4. Return Success Response
  return successResponse(profile);
}
```

---

### 4. **Data Layer (Supabase)**

#### **A. Authentication Service**

**Flow:**
```
1. User kirim email + password
       ↓
2. Supabase verify credentials di auth.users
       ↓
3. Generate JWT Token:
   {
     sub: user_id,
     role: 'authenticated',
     iat: issued_at,
     exp: expiry (now + 1h)
   }
       ↓
4. Sign dengan secret_key (HS256)
       ↓
5. Return { access_token, refresh_token }
```

**Token Storage:**
- **Server:** Refresh token di database
- **Client:** Access & refresh token di secure storage

#### **B. PostgreSQL Database**

**Relationship Diagram:**

```
auth.users
    │
    │ 1:1
    ▼
profiles (extended user data)
    │
    ├──── 1:N ───► krs_pengajuan (student enrollments)
    │                  │
    │                  │ N:1
    │                  ▼
    │             matakuliah (courses)
    │                  │
    │                  ├──── 1:N ───► post (materials/assignments)
    │                  │                  │
    │                  │                  │ 1:N
    │                  │                  ▼
    │                  │              tugas_submission
    │                  │
    │                  └──── 1:N ───► presensi_session
    │                                     │
    │                                     │ 1:N
    │                                     ▼
    ├──── 1:N ───► nilai (grades)   presensi_mahasiswa
    │
    └──── 1:N ───► tugas_submission
```

---

## Data Flow: Login hingga Mendapatkan Data

### **Complete Flow Diagram:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DATA FLOW: LOGIN TO GET PROFILE                         │
└─────────────────────────────────────────────────────────────────────────────┘

Mobile App              Next.js API           Supabase Auth       PostgreSQL
   📱                      🖥️                     🔐                 🗄️
   │                       │                      │                  │
   │ 1. POST /auth/login   │                      │                  │
   │ {                     │                      │                  │
   │   email: "student@",  │                      │                  │
   │   password: "12345"   │                      │                  │
   │ }                     │                      │                  │
   ├──────────────────────►│                      │                  │
   │                       │ 2. signInWithPassword│                  │
   │                       ├─────────────────────►│                  │
   │                       │                      │ 3. Verify        │
   │                       │                      │ credentials      │
   │                       │                      ├─────────────────►│
   │                       │                      │                  │
   │                       │                      │ 4. auth.users    │
   │                       │                      │ WHERE email=     │
   │                       │                      │ bcrypt.compare   │
   │                       │                      │◄─────────────────┤
   │                       │                      │ User found! ✓    │
   │                       │                      │                  │
   │                       │ 5. Generate JWT      │                  │
   │                       │ {                    │                  │
   │                       │   sub: user_id,      │                  │
   │                       │   role: student,     │                  │
   │                       │   exp: now+1h        │                  │
   │                       │ }                    │                  │
   │                       │ + Sign(secret_key)   │                  │
   │                       │◄─────────────────────┤                  │
   │                       │                      │                  │
   │                       │ 6. Get profile data  │                  │
   │                       ├──────────────────────┼─────────────────►│
   │                       │                      │ SELECT * FROM    │
   │                       │                      │ profiles         │
   │                       │                      │ WHERE id=user_id │
   │                       │◄─────────────────────┼──────────────────┤
   │                       │                      │                  │
   │ 7. Response:          │                      │                  │
   │ {                     │                      │                  │
   │   success: true,      │                      │                  │
   │   data: {             │                      │                  │
   │     user: {           │                      │                  │
   │       id, email,      │                      │                  │
   │       role, ...       │                      │                  │
   │     },                │                      │                  │
   │     session: {        │                      │                  │
   │       access_token,   │                      │                  │
   │       refresh_token   │                      │                  │
   │     }                 │                      │                  │
   │   }                   │                      │                  │
   │ }                     │                      │                  │
   │◄──────────────────────┤                      │                  │
   │                       │                      │                  │
   │ 8. Save tokens to     │                      │                  │
   │ secure storage:       │                      │                  │
   │ FlutterSecureStorage  │                      │                  │
   │                       │                      │                  │
   ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   │                                                                  │
   │ 9. GET /student/profile                                          │
   │ Header:               │                      │                  │
   │ Authorization:        │                      │                  │
   │ Bearer eyJhbGci...    │                      │                  │
   ├──────────────────────►│                      │                  │
   │                       │ 10. Extract token    │                  │
   │                       │ from header          │                  │
   │                       │                      │                  │
   │                       │ 11. Verify signature │                  │
   │                       ├─────────────────────►│                  │
   │                       │ supabase.auth        │                  │
   │                       │ .getUser(token)      │                  │
   │                       │                      │ 12. Validate     │
   │                       │                      │ signature with   │
   │                       │                      │ secret_key       │
   │                       │◄─────────────────────┤ ✓ Valid!         │
   │                       │ {                    │                  │
   │                       │   user: {            │                  │
   │                       │     id, email, ...   │                  │
   │                       │   }                  │                  │
   │                       │ }                    │                  │
   │                       │                      │                  │
   │                       │ 13. Check role       │                  │
   │                       ├──────────────────────┼─────────────────►│
   │                       │                      │ SELECT role FROM │
   │                       │                      │ profiles         │
   │                       │                      │ WHERE id=user_id │
   │                       │◄─────────────────────┼──────────────────┤
   │                       │ role = 'student' ✓   │                  │
   │                       │                      │                  │
   │                       │ 14. Query profile    │                  │
   │                       ├──────────────────────┼─────────────────►│
   │                       │ (RLS active!)        │ SELECT * FROM    │
   │                       │                      │ profiles         │
   │                       │                      │ WHERE id=user_id │
   │                       │                      │                  │
   │                       │                      │ RLS Policy:      │
   │                       │                      │ auth.uid()=id ✓  │
   │                       │◄─────────────────────┼──────────────────┤
   │                       │                      │                  │
   │ 15. Response:         │                      │                  │
   │ {                     │                      │                  │
   │   success: true,      │                      │                  │
   │   data: {             │                      │                  │
   │     id, username,     │                      │                  │
   │     email, nim,       │                      │                  │
   │     jurusan, ...      │                      │                  │
   │   }                   │                      │                  │
   │ }                     │                      │                  │
   │◄──────────────────────┤                      │                  │
   │                       │                      │                  │
   │ 16. Display profile   │                      │                  │
   │ di UI mobile app      │                      │                  │
   │                       │                      │                  │
```

---

## Security Layers

SynClass memiliki **6 lapisan keamanan** yang bekerja secara berurutan:

```
┌─────────────────────────────────────────────────────────────┐
│              6 LAPISAN KEAMANAN SYNCLASS                    │
└─────────────────────────────────────────────────────────────┘

REQUEST dari client
       │
       ▼
┌──────────────────────────────────────────────┐
│ Layer 1: HTTPS/TLS Encryption                │
│ • Semua traffic terenkripsi                  │
│ • Man-in-the-middle attack prevention        │
│ • Certificate validation                     │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ Layer 2: JWT Token Validation                │
│ • Extract token dari header                  │
│ • Verify signature dengan secret_key         │
│ • Check expiry time                          │
│ • Decode payload (user_id, role)             │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ Layer 3: Role-Based Access Control (RBAC)    │
│ • Check user.role === 'student'              │
│ • Endpoint /student/* hanya untuk student    │
│ • Endpoint /dosen/* hanya untuk dosen        │
│ • Endpoint /admin/* hanya untuk admin        │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ Layer 4: Row Level Security (RLS)            │
│ • Database-level filtering                   │
│ • auth.uid() = user_id check                 │
│ • Automatic per-row permissions              │
│ • Cannot be bypassed from client             │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ Layer 5: Business Logic Validation           │
│ • Input validation (email format, etc)       │
│ • Business rules (max 24 SKS, etc)           │
│ • Data integrity checks                      │
│ • Prevent invalid operations                 │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ Layer 6: Database Constraints                │
│ • Foreign key constraints                    │
│ • NOT NULL constraints                       │
│ • UNIQUE constraints                         │
│ • Check constraints                          │
└──────────────────┬───────────────────────────┘
                   ▼
            PROCESS REQUEST
                   │
                   ▼
            RETURN RESPONSE
```

### **Public vs Protected Endpoints**

```
┌──────────────────────────────────────────────────────────────┐
│                  ENDPOINT CLASSIFICATION                     │
└──────────────────────────────────────────────────────────────┘

PUBLIC ENDPOINTS (No Authentication Required)
├─ POST /api/mobile/auth/login       ← Anyone can access
├─ POST /api/mobile/auth/refresh     ← Refresh token only
└─ POST /api/mobile/auth/logout      ← Cleanup session

PROTECTED ENDPOINTS (JWT Token Required + Role Check)
├─ Student Endpoints (role = 'student')
│  ├─ GET  /api/mobile/student/profile
│  ├─ PUT  /api/mobile/student/profile
│  ├─ GET  /api/mobile/student/classes
│  ├─ GET  /api/mobile/student/krs
│  ├─ POST /api/mobile/student/krs
│  ├─ GET  /api/mobile/student/grades
│  ├─ GET  /api/mobile/student/attendance
│  ├─ GET  /api/mobile/student/assignments
│  ├─ POST /api/mobile/student/assignments/:id/submit
│  ├─ GET  /api/mobile/student/materials
│  └─ GET  /api/mobile/student/matakuliah
│
├─ Dosen Endpoints (role = 'dosen') [Future]
│  ├─ GET  /api/mobile/dosen/classes
│  ├─ GET  /api/mobile/dosen/students
│  └─ POST /api/mobile/dosen/attendance/create
│
└─ Admin Endpoints (SERVICE_ROLE_KEY required)
   └─ POST /api/admin/create-user
```

---

## Database Schema

### **Entity Relationship Diagram (ERD):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA (ERD)                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   auth.users     │ (Managed by Supabase)
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ encrypted_pass   │
│ email_confirmed  │
│ created_at       │
└────────┬─────────┘
         │ 1:1
         │
         ▼
┌─────────────────────────────┐
│   profiles                  │ (Extended user data)
├─────────────────────────────┤
│ id (PK, FK→auth.users)      │
│ username                    │
│ email                       │
│ role (student/dosen/kaprodi)│
│ nim (for students)          │
│ nidn (for lecturers)        │
│ nama_lengkap                │
│ jurusan                     │
│ fakultas                    │
│ angkatan                    │
│ created_at                  │
│ updated_at                  │
└──────┬──────────────────────┘
       │
       ├─────────────── 1:N ──────────────►┌─────────────────────────────┐
       │                                   │  krs_pengajuan              │
       │                                   ├─────────────────────────────┤
       │                                   │ id (PK)                     │
       │                                   │ mahasiswa_id (FK→profiles)  │
       │                                   │ matakuliah_id (FK→matakuliah)│
       │                                   │ semester                    │
       │                                   │ tahun_ajaran                │
       │                                   │ status (pending/approved)   │
       │                                   │ catatan                     │
       │                                   │ created_at                  │
       │                                   └──────────┬──────────────────┘
       │                                              │ N:1
       ├─────────────── 1:N ─────────────►┌───────────▼──────────────────┐
       │                                  │  matakuliah                  │
       │                                  ├──────────────────────────────┤
       │                                  │ id (PK)                      │
       │                                  │ kode_mk (UNIQUE)             │
       │                                  │ nama_mk                      │
       │                                  │ sks                          │
       │                                  │ semester                     │
       │                                  │ dosen_id (FK→profiles)       │
       │                                  │ hari (enum)                  │
       │                                  │ jam_mulai (time)             │
       │                                  │ jam_selesai (time)           │
       │                                  │ ruang                        │
       │                                  │ kuota                        │
       │                                  │ created_at                   │
       │                                  └──────┬──────────────────┬────┘
       │                                         │ 1:N              │ 1:N
       │                                         ▼                  ▼
       │                                  ┌─────────────────┐  ┌──────────────────┐
       │                                  │ post            │  │ presensi_session │
       │                                  ├─────────────────┤  ├──────────────────┤
       │                                  │ id (PK)         │  │ id (PK)          │
       ├──────────────────────────────────┤ matakuliah_id   │  │ matakuliah_id    │
       │ (author)                         │ author_id (FK)  │  │ tanggal          │
       │ 1:N                              │ jenis_post      │  │ pertemuan_ke     │
       │                                  │ judul           │  │ qr_code          │
       │                                  │ konten          │  │ created_at       │
       │                                  │ file_url        │  └──────┬───────────┘
       │                                  │ deadline        │         │ 1:N
       │                                  │ created_at      │         ▼
       │                                  └──────┬──────────┘  ┌──────────────────────┐
       │                                         │ 1:N         │ presensi_mahasiswa   │
       │                                         ▼             ├──────────────────────┤
       ├──────────────────────┐         ┌─────────────────────┤ id (PK)              │
       │ 1:N                  │         │ tugas_submission    │ session_id (FK)      │
       │                      ▼         ├─────────────────────┤ mahasiswa_id (FK)    │
       │              ┌──────────────────┤ id (PK)             │ status (hadir/alpha) │
       │              │ nilai            │ post_id (FK→post)   │ timestamp            │
       │              ├──────────────────┤ mahasiswa_id (FK)   └──────────────────────┘
       │              │ id (PK)          │ jawaban             │
       └──────────────┤ mahasiswa_id (FK)│ file_url            │
                      │ matakuliah_id    │ nilai               │
                      │ semester         │ feedback            │
                      │ nilai_angka      │ submitted_at        │
                      │ nilai_huruf      └─────────────────────┘
                      │ ips              │
                      │ created_at       │
                      └──────────────────┘
```

### **Foreign Key Relationships:**

| Table | Foreign Key | References | On Delete |
|-------|-------------|------------|-----------|
| `profiles` | `id` | `auth.users.id` | CASCADE |
| `krs_pengajuan` | `mahasiswa_id` | `profiles.id` | CASCADE |
| `krs_pengajuan` | `matakuliah_id` | `matakuliah.id` | CASCADE |
| `nilai` | `mahasiswa_id` | `profiles.id` | CASCADE |
| `nilai` | `matakuliah_id` | `matakuliah.id` | CASCADE |
| `post` | `matakuliah_id` | `matakuliah.id` | CASCADE |
| `post` | `author_id` | `profiles.id` | SET NULL |
| `tugas_submission` | `post_id` | `post.id` | CASCADE |
| `tugas_submission` | `mahasiswa_id` | `profiles.id` | CASCADE |
| `presensi_session` | `matakuliah_id` | `matakuliah.id` | CASCADE |
| `presensi_mahasiswa` | `session_id` | `presensi_session.id` | CASCADE |
| `presensi_mahasiswa` | `mahasiswa_id` | `profiles.id` | CASCADE |
| `matakuliah` | `dosen_id` | `profiles.id` | SET NULL |

**ON DELETE CASCADE:** Jika parent dihapus, child juga terhapus
**ON DELETE SET NULL:** Jika parent dihapus, FK di child jadi NULL

---

## API Design Pattern

SynClass mengikuti **RESTful API Design Best Practices:**

### **1. Resource-Based URLs**

```
✅ GOOD:
GET    /api/mobile/student/profile         → Resource: profile
GET    /api/mobile/student/classes         → Resource: classes (collection)
GET    /api/mobile/student/classes/:id     → Resource: specific class
POST   /api/mobile/student/krs             → Create KRS
DELETE /api/mobile/student/krs/:id         → Delete specific KRS

❌ BAD:
GET  /api/getStudentProfile
GET  /api/getAllClassesForCurrentStudent
POST /api/createNewKRS
POST /api/deleteKRSById
```

### **2. HTTP Status Codes**

| Code | Meaning | Use Case |
|------|---------|----------|
| **200** | OK | Success (GET, PUT, PATCH) |
| **201** | Created | Resource created (POST) |
| **204** | No Content | Success but no body (DELETE) |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | Valid token, wrong role |
| **404** | Not Found | Resource doesn't exist |
| **500** | Internal Server Error | Server error |

### **3. Standard Response Format**

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Actual data here
  },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE_UPPERCASE"
}
```

### **4. API Versioning (Future)**

```
/api/v1/mobile/student/profile
/api/v2/mobile/student/profile  ← New version with breaking changes
```

### **5. Pagination (for large datasets)**

```
GET /api/mobile/student/classes?page=1&limit=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Kesimpulan

SynClass dibangun dengan **modern web architecture** yang:

✅ **Scalable** - Serverless di Vercel, auto-scale
✅ **Secure** - 6 lapisan keamanan (HTTPS, JWT, RBAC, RLS, etc)
✅ **Maintainable** - Clean code, separation of concerns
✅ **Performant** - RLS di database, CDN, caching
✅ **Multi-platform** - Web + Mobile API
✅ **Developer-friendly** - RESTful API, standard format, documentation

**Tech Stack Summary:**
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT Token (Supabase Auth)
- **Security:** RLS, RBAC, HTTPS
- **Deployment:** Vercel (serverless)
- **API:** RESTful, JSON

---

# 📱 MOBILE INTEGRATION GUIDE


- [Flutter Integration](#flutter-integration)
- [React Native Integration](#react-native-integration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Testing dengan Postman](#testing-dengan-postman)

---

## Quick Start

### Base URL

```
Development: http://localhost:3000/api/mobile
Production:  https://your-app.vercel.app/api/mobile
```

### Authentication

Semua endpoint (kecuali `/auth/*`) memerlukan **JWT Token** di header:

```
Authorization: Bearer <your_access_token>
```

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Authentication Flow

### 1. Login

**Mendapatkan Access Token & Refresh Token**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@mail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "student@mail.com",
      "role": "student",
      "username": "budi_santoso",
      "nim": "2021001",
      "jurusan": "Teknik Informatika"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 3600,
      "token_type": "bearer"
    }
  },
  "message": "Login successful"
}
```

**Simpan Tokens:**
- `access_token` → Untuk semua API request (valid 1 jam)
- `refresh_token` → Untuk perpanjang session (valid 30 hari)

---

### 2. Refresh Token

**Perpanjang Access Token tanpa Login Ulang**

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // New token
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Updated
    "expires_in": 3600
  }
}
```

**Kapan refresh?**
- Access token expired (401 error)
- Atau refresh otomatis setiap 50 menit

---

### 3. Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Action:**
- Hapus tokens dari secure storage
- Redirect ke login screen

---

## API Endpoints Reference

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **GET** | `/student/profile` | Get user profile | ✅ |
| **PUT** | `/student/profile` | Update profile | ✅ |
| **GET** | `/student/classes` | Get enrolled classes | ✅ |
| **GET** | `/student/classes/:id` | Get class detail | ✅ |
| **GET** | `/student/krs` | Get KRS data | ✅ |
| **POST** | `/student/krs` | Submit KRS | ✅ |
| **GET** | `/student/grades` | Get grades & transcript | ✅ |
| **GET** | `/student/attendance` | Get attendance records | ✅ |
| **GET** | `/student/assignments` | Get assignments list | ✅ |
| **POST** | `/student/assignments/:id/submit` | Submit assignment | ✅ |
| **GET** | `/student/materials` | Get learning materials | ✅ |
| **GET** | `/student/matakuliah` | Get available courses | ✅ |

---

### Detailed Endpoint Documentation

#### **GET /student/profile**

Get current user profile

**Request:**
```http
GET /student/profile
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "budi_santoso",
    "email": "budi@student.com",
    "role": "student",
    "nim": "2021001",
    "nama_lengkap": "Budi Santoso",
    "jurusan": "Teknik Informatika",
    "fakultas": "Teknik",
    "angkatan": "2021",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### **PUT /student/profile**

Update user profile

**Request:**
```http
PUT /student/profile
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "username": "budi_updated",
  "jurusan": "Sistem Informasi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "budi_updated",
    "jurusan": "Sistem Informasi",
    ...
  },
  "message": "Profile updated successfully"
}
```

---

#### **GET /student/classes**

Get list of enrolled classes

**Request:**
```http
GET /student/classes
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "krs-uuid",
        "matakuliah": {
          "id": "mk-uuid",
          "kode_mk": "IF101",
          "nama_mk": "Pemrograman Web",
          "sks": 3,
          "semester": 3,
          "hari": "Senin",
          "jam_mulai": "08:00:00",
          "jam_selesai": "10:30:00",
          "ruang": "Lab Komputer 1",
          "dosen": {
            "nama_lengkap": "Dr. Ahmad Fauzi",
            "nidn": "0012345678"
          }
        },
        "status": "approved"
      },
      {
        "id": "krs-uuid-2",
        "matakuliah": {
          "kode_mk": "IF102",
          "nama_mk": "Basis Data",
          "sks": 3,
          ...
        }
      }
    ],
    "total": 2
  }
}
```

---

#### **GET /student/classes/:id**

Get detailed information about a specific class

**Request:**
```http
GET /student/classes/mk-uuid-123
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "mk-uuid",
    "kode_mk": "IF101",
    "nama_mk": "Pemrograman Web",
    "sks": 3,
    "semester": 3,
    "dosen": {
      "id": "dosen-uuid",
      "nama_lengkap": "Dr. Ahmad Fauzi",
      "email": "ahmad@lecturer.com"
    },
    "jadwal": {
      "hari": "Senin",
      "jam_mulai": "08:00",
      "jam_selesai": "10:30",
      "ruang": "Lab Komputer 1"
    },
    "posts": [
      {
        "id": "post-uuid",
        "jenis_post": "materi",
        "judul": "Pengenalan HTML & CSS",
        "konten": "Materi pertemuan 1...",
        "file_url": "https://...",
        "created_at": "2024-01-05T10:00:00Z"
      },
      {
        "jenis_post": "tugas",
        "judul": "Tugas 1: Membuat Website Sederhana",
        "deadline": "2024-01-15T23:59:59Z",
        ...
      }
    ],
    "enrolled_count": 35
  }
}
```

---

#### **GET /student/krs**

Get KRS (Kartu Rencana Studi) data

**Request:**
```http
GET /student/krs
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "krs": [
      {
        "id": "krs-uuid",
        "semester": "2024/2025 Ganjil",
        "status": "approved",
        "total_sks": 21,
        "matakuliah": [
          {
            "kode_mk": "IF101",
            "nama_mk": "Pemrograman Web",
            "sks": 3
          },
          ...
        ],
        "approved_at": "2024-01-10T08:00:00Z",
        "approved_by": {
          "nama": "Prof. Dr. Siti Aminah"
        }
      }
    ],
    "current_semester": "2024/2025 Ganjil",
    "total_sks_approved": 21
  }
}
```

---

#### **POST /student/krs**

Submit new KRS

**Request:**
```http
POST /student/krs
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "semester": "2024/2025 Ganjil",
  "tahun_ajaran": "2024/2025",
  "matakuliah_ids": [
    "mk-uuid-1",
    "mk-uuid-2",
    "mk-uuid-3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "krs-uuid",
    "status": "pending",
    "total_sks": 21,
    "message": "KRS berhasil diajukan, menunggu persetujuan Kaprodi"
  }
}
```

---

#### **GET /student/grades**

Get grades and transcript (KHS)

**Request:**
```http
GET /student/grades
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "grades": [
      {
        "semester": "2023/2024 Genap",
        "matakuliah": [
          {
            "kode_mk": "IF101",
            "nama_mk": "Pemrograman Dasar",
            "sks": 3,
            "nilai_angka": 85,
            "nilai_huruf": "A",
            "bobot": 4.0
          },
          ...
        ],
        "ips": 3.75,
        "total_sks": 21
      },
      {
        "semester": "2024/2025 Ganjil",
        ...
      }
    ],
    "ipk": 3.68,
    "total_sks_lulus": 42
  }
}
```

---

#### **GET /student/attendance**

Get attendance records

**Request:**
```http
GET /student/attendance
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "matakuliah": {
          "kode_mk": "IF101",
          "nama_mk": "Pemrograman Web"
        },
        "records": [
          {
            "pertemuan_ke": 1,
            "tanggal": "2024-01-08",
            "status": "hadir",
            "timestamp": "08:05:00"
          },
          {
            "pertemuan_ke": 2,
            "tanggal": "2024-01-15",
            "status": "hadir",
            "timestamp": "08:02:00"
          }
        ],
        "summary": {
          "hadir": 12,
          "izin": 1,
          "sakit": 0,
          "alpha": 1,
          "persentase": 85.7
        }
      }
    ]
  }
}
```

---

#### **GET /student/assignments**

Get list of assignments

**Request:**
```http
GET /student/assignments
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "post-uuid",
        "matakuliah": {
          "kode_mk": "IF101",
          "nama_mk": "Pemrograman Web"
        },
        "judul": "Tugas 1: Website Portfolio",
        "konten": "Buat website portfolio pribadi...",
        "deadline": "2024-01-20T23:59:59Z",
        "file_url": "https://...",
        "submission": {
          "submitted": true,
          "submitted_at": "2024-01-18T14:30:00Z",
          "nilai": 85,
          "feedback": "Bagus, layout responsive!"
        }
      },
      {
        "id": "post-uuid-2",
        "judul": "Tugas 2: CRUD Application",
        "deadline": "2024-02-01T23:59:59Z",
        "submission": {
          "submitted": false
        }
      }
    ],
    "summary": {
      "total": 10,
      "submitted": 7,
      "pending": 3
    }
  }
}
```

---

#### **POST /student/assignments/:postId/submit**

Submit an assignment

**Request:**
```http
POST /student/assignments/post-uuid-123/submit
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "jawaban": "Saya telah menyelesaikan tugas...",
  "file_url": "https://storage.supabase.co/..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "submission-uuid",
    "post_id": "post-uuid-123",
    "jawaban": "Saya telah menyelesaikan tugas...",
    "file_url": "https://...",
    "submitted_at": "2024-01-18T14:30:00Z",
    "status": "submitted"
  },
  "message": "Assignment submitted successfully"
}
```

---

#### **GET /student/materials**

Get learning materials

**Request:**
```http
GET /student/materials
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "post-uuid",
        "matakuliah": {
          "kode_mk": "IF101",
          "nama_mk": "Pemrograman Web"
        },
        "judul": "Materi Pertemuan 1: HTML Dasar",
        "konten": "Pengenalan HTML...",
        "file_url": "https://...",
        "created_at": "2024-01-05T10:00:00Z"
      },
      ...
    ]
  }
}
```

---

#### **GET /student/matakuliah**

Get available courses for enrollment

**Request:**
```http
GET /student/matakuliah
Authorization: Bearer eyJhbGci...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matakuliah": [
      {
        "id": "mk-uuid",
        "kode_mk": "IF101",
        "nama_mk": "Pemrograman Web",
        "sks": 3,
        "semester": 3,
        "dosen": {
          "nama_lengkap": "Dr. Ahmad Fauzi"
        },
        "jadwal": {
          "hari": "Senin",
          "jam_mulai": "08:00",
          "jam_selesai": "10:30",
          "ruang": "Lab 1"
        },
        "kuota": 40,
        "terisi": 35,
        "available": true
      },
      ...
    ]
  }
}
```

---

## Flutter Integration

### Setup Dependencies

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  flutter_secure_storage: ^9.0.0
  provider: ^6.1.1  # State management (optional)
```

### 1. API Service Class

```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'https://your-app.vercel.app/api/mobile';
  final storage = const FlutterSecureStorage();
  
  // Get access token from secure storage
  Future<String?> getAccessToken() async {
    return await storage.read(key: 'access_token');
  }
  
  // Save tokens
  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await storage.write(key: 'access_token', value: accessToken);
    await storage.write(key: 'refresh_token', value: refreshToken);
  }
  
  // Clear tokens (logout)
  Future<void> clearTokens() async {
    await storage.delete(key: 'access_token');
    await storage.delete(key: 'refresh_token');
  }
  
  // Make authenticated request
  Future<http.Response> authenticatedRequest({
    required String method,
    required String endpoint,
    Map<String, dynamic>? body,
  }) async {
    final token = await getAccessToken();
    
    if (token == null) {
      throw Exception('No access token found');
    }
    
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
    
    http.Response response;
    
    switch (method.toUpperCase()) {
      case 'GET':
        response = await http.get(url, headers: headers);
        break;
      case 'POST':
        response = await http.post(
          url,
          headers: headers,
          body: json.encode(body),
        );
        break;
      case 'PUT':
        response = await http.put(
          url,
          headers: headers,
          body: json.encode(body),
        );
        break;
      case 'DELETE':
        response = await http.delete(url, headers: headers);
        break;
      default:
        throw Exception('Unsupported method: $method');
    }
    
    // Handle 401 Unauthorized (token expired)
    if (response.statusCode == 401) {
      // Try to refresh token
      final refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry request with new token
        return authenticatedRequest(
          method: method,
          endpoint: endpoint,
          body: body,
        );
      } else {
        // Refresh failed, logout user
        await clearTokens();
        throw Exception('Session expired, please login again');
      }
    }
    
    return response;
  }
  
  // Refresh access token
  Future<bool> refreshAccessToken() async {
    try {
      final refreshToken = await storage.read(key: 'refresh_token');
      
      if (refreshToken == null) return false;
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'refresh_token': refreshToken}),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        await saveTokens(
          data['data']['access_token'],
          data['data']['refresh_token'],
        );
        return true;
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }
}
```

### 2. Auth Service

```dart
// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  static const String baseUrl = ApiService.baseUrl;
  
  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );
      
      final data = json.decode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        // Save tokens
        await _apiService.saveTokens(
          data['data']['session']['access_token'],
          data['data']['session']['refresh_token'],
        );
        
        return {
          'success': true,
          'user': data['data']['user'],
        };
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Login failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Network error: $e',
      };
    }
  }
  
  // Logout
  Future<void> logout() async {
    try {
      await _apiService.authenticatedRequest(
        method: 'POST',
        endpoint: '/auth/logout',
      );
    } catch (e) {
      // Ignore errors, just clear tokens
    } finally {
      await _apiService.clearTokens();
    }
  }
  
  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _apiService.getAccessToken();
    return token != null;
  }
}
```

### 3. Student Service

```dart
// lib/services/student_service.dart
import 'dart:convert';
import 'api_service.dart';

class StudentService {
  final ApiService _apiService = ApiService();
  
  // Get profile
  Future<Map<String, dynamic>> getProfile() async {
    final response = await _apiService.authenticatedRequest(
      method: 'GET',
      endpoint: '/student/profile',
    );
    
    return json.decode(response.body);
  }
  
  // Get classes
  Future<Map<String, dynamic>> getClasses() async {
    final response = await _apiService.authenticatedRequest(
      method: 'GET',
      endpoint: '/student/classes',
    );
    
    return json.decode(response.body);
  }
  
  // Get grades
  Future<Map<String, dynamic>> getGrades() async {
    final response = await _apiService.authenticatedRequest(
      method: 'GET',
      endpoint: '/student/grades',
    );
    
    return json.decode(response.body);
  }
  
  // Submit assignment
  Future<Map<String, dynamic>> submitAssignment(
    String postId,
    String jawaban,
    String? fileUrl,
  ) async {
    final response = await _apiService.authenticatedRequest(
      method: 'POST',
      endpoint: '/student/assignments/$postId/submit',
      body: {
        'jawaban': jawaban,
        if (fileUrl != null) 'file_url': fileUrl,
      },
    );
    
    return json.decode(response.body);
  }
}
```

### 4. Example Usage in UI

```dart
// lib/screens/login_screen.dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _authService = AuthService();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  
  Future<void> _login() async {
    setState(() => _isLoading = true);
    
    final result = await _authService.login(
      _emailController.text,
      _passwordController.text,
    );
    
    setState(() => _isLoading = false);
    
    if (result['success']) {
      // Navigate to home
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      // Show error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['error'])),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isLoading ? null : _login,
              child: _isLoading
                  ? CircularProgressIndicator()
                  : Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
```

```dart
// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import '../services/student_service.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _studentService = StudentService();
  Map<String, dynamic>? _profile;
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadProfile();
  }
  
  Future<void> _loadProfile() async {
    try {
      final result = await _studentService.getProfile();
      
      if (result['success']) {
        setState(() {
          _profile = result['data'];
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading profile: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    
    return Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          ListTile(
            title: Text('Username'),
            subtitle: Text(_profile!['username']),
          ),
          ListTile(
            title: Text('NIM'),
            subtitle: Text(_profile!['nim']),
          ),
          ListTile(
            title: Text('Jurusan'),
            subtitle: Text(_profile!['jurusan']),
          ),
          ListTile(
            title: Text('Angkatan'),
            subtitle: Text(_profile!['angkatan']),
          ),
        ],
      ),
    );
  }
}
```

---

## React Native Integration

### Setup Dependencies

```bash
npm install axios @react-native-async-storage/async-storage react-native-encrypted-storage
```

### 1. API Service

```javascript
// src/services/api.js
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const BASE_URL = 'https://your-app.vercel.app/api/mobile';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add token)
api.interceptors.request.use(
  async (config) => {
    const token = await EncryptedStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await EncryptedStorage.getItem('refresh_token');
        
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token, refresh_token: newRefreshToken } = response.data.data;
        
        await EncryptedStorage.setItem('access_token', access_token);
        await EncryptedStorage.setItem('refresh_token', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await EncryptedStorage.removeItem('access_token');
        await EncryptedStorage.removeItem('refresh_token');
        // Navigate to login screen
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Auth Service

```javascript
// src/services/authService.js
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import api from './api';

const BASE_URL = 'https://your-app.vercel.app/api/mobile';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    
    const { access_token, refresh_token } = response.data.data.session;
    
    await EncryptedStorage.setItem('access_token', access_token);
    await EncryptedStorage.setItem('refresh_token', refresh_token);
    
    return {
      success: true,
      user: response.data.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed',
    };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Ignore errors
  } finally {
    await EncryptedStorage.removeItem('access_token');
    await EncryptedStorage.removeItem('refresh_token');
  }
};

export const isLoggedIn = async () => {
  const token = await EncryptedStorage.getItem('access_token');
  return token !== null;
};
```

### 3. Student Service

```javascript
// src/services/studentService.js
import api from './api';

export const getProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const getClasses = async () => {
  const response = await api.get('/student/classes');
  return response.data;
};

export const getGrades = async () => {
  const response = await api.get('/student/grades');
  return response.data;
};

export const submitAssignment = async (postId, jawaban, fileUrl = null) => {
  const response = await api.post(`/student/assignments/${postId}/submit`, {
    jawaban,
    file_url: fileUrl,
  });
  return response.data;
};
```

### 4. Example Usage in Components

```javascript
// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { login } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    setLoading(false);
    
    if (result.success) {
      navigation.replace('Home');
    } else {
      setError(result.error);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
};

export default LoginScreen;
```

```javascript
// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getProfile } from '../services/studentService';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      const result = await getProfile();
      if (result.success) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  
  return (
    <View style={{ padding: 20 }}>
      <Text>Username: {profile.username}</Text>
      <Text>NIM: {profile.nim}</Text>
      <Text>Jurusan: {profile.jurusan}</Text>
      <Text>Angkatan: {profile.angkatan}</Text>
    </View>
  );
};

export default ProfileScreen;
```

---

## Error Handling

### Standard Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `NO_TOKEN` | Missing authorization token | Redirect to login |
| `INVALID_TOKEN` | Token invalid or expired | Try refresh, then login |
| `INVALID_ROLE` | Wrong role for endpoint | Show error message |
| `NOT_FOUND` | Resource not found | Show 404 message |
| `VALIDATION_ERROR` | Invalid input data | Show validation errors |
| `SERVER_ERROR` | Internal server error | Retry or contact support |

### Example Error Handler (Flutter)

```dart
Future<void> handleApiError(dynamic error) {
  if (error.toString().contains('401')) {
    // Unauthorized - redirect to login
    Navigator.pushReplacementNamed(context, '/login');
  } else if (error.toString().contains('403')) {
    // Forbidden - show access denied
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Access Denied'),
        content: Text('You do not have permission to access this resource.'),
      ),
    );
  } else if (error.toString().contains('404')) {
    // Not found
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Not Found'),
        content: Text('The requested resource was not found.'),
      ),
    );
  } else {
    // Generic error
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text('An error occurred. Please try again.'),
      ),
    );
  }
}
```

---

## Best Practices

### 1. **Secure Token Storage**

✅ **DO:**
- Use `flutter_secure_storage` (Flutter)
- Use `react-native-encrypted-storage` (React Native)
- Store tokens in secure, encrypted storage

❌ **DON'T:**
- Store tokens in `SharedPreferences` (Flutter)
- Store tokens in `AsyncStorage` (React Native)
- Store tokens in plain text

### 2. **Automatic Token Refresh**

```dart
// Flutter example with automatic refresh
Future<http.Response> makeRequest(String endpoint) async {
  var response = await http.get(
    Uri.parse(endpoint),
    headers: {'Authorization': 'Bearer ${await getAccessToken()}'},
  );
  
  if (response.statusCode == 401) {
    // Token expired, try refresh
    final refreshed = await refreshToken();
    if (refreshed) {
      // Retry with new token
      response = await http.get(
        Uri.parse(endpoint),
        headers: {'Authorization': 'Bearer ${await getAccessToken()}'},
      );
    }
  }
  
  return response;
}
```

### 3. **Network Error Handling**

```dart
try {
  final response = await api.get('/student/profile');
  return response.data;
} on SocketException {
  throw Exception('No internet connection');
} on TimeoutException {
  throw Exception('Request timeout');
} on HttpException {
  throw Exception('Server error');
} catch (e) {
  throw Exception('Unexpected error: $e');
}
```

### 4. **Loading States**

```dart
class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool isLoading = true;
  dynamic profile;
  String? error;
  
  @override
  void initState() {
    super.initState();
    loadProfile();
  }
  
  Future<void> loadProfile() async {
    setState(() {
      isLoading = true;
      error = null;
    });
    
    try {
      final result = await studentService.getProfile();
      setState(() {
        profile = result['data'];
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (isLoading) return CircularProgressIndicator();
    if (error != null) return Text('Error: $error');
    return ProfileWidget(profile: profile);
  }
}
```

### 5. **Retry Logic**

```dart
Future<dynamic> makeRequestWithRetry(
  Future<dynamic> Function() request, {
  int maxRetries = 3,
}) async {
  int retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await request();
    } catch (e) {
      retries++;
      if (retries >= maxRetries) rethrow;
      await Future.delayed(Duration(seconds: retries * 2)); // Exponential backoff
    }
  }
}
```

---

## Testing dengan Postman

### Setup Environment

1. **Create Environment:**
   - Name: `SynClass Dev`
   - Variables:
     - `base_url`: `http://localhost:3000/api/mobile`
     - `access_token`: (will be set after login)

2. **Create Environment (Production):**
   - Name: `SynClass Prod`
   - Variables:
     - `base_url`: `https://your-app.vercel.app/api/mobile`

### Test Flow

#### 1. Login

```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "student@mail.com",
  "password": "password123"
}

Tests (JavaScript):
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    
    // Save access token to environment
    pm.environment.set("access_token", jsonData.data.session.access_token);
});
```

#### 2. Get Profile

```
GET {{base_url}}/student/profile
Headers:
Authorization: Bearer {{access_token}}

Tests:
pm.test("Profile retrieved", function () {
    pm.response.to.have.status(200);
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('username');
});
```

#### 3. Get Classes

```
GET {{base_url}}/student/classes
Headers:
Authorization: Bearer {{access_token}}

Tests:
pm.test("Classes retrieved", function () {
    pm.response.to.have.status(200);
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.data).to.be.an('array');
});
```

### Postman Collection

Import collection JSON:

```json
{
  "info": {
    "name": "SynClass Mobile API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"student@mail.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Student",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/student/profile",
              "host": ["{{base_url}}"],
              "path": ["student", "profile"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Kesimpulan

### Checklist Integrasi Mobile

- [ ] Setup HTTP client (axios/http)
- [ ] Setup secure storage for tokens
- [ ] Implement login flow
- [ ] Implement token refresh mechanism
- [ ] Handle 401/403 errors
- [ ] Implement logout
- [ ] Test all student endpoints
- [ ] Handle network errors
- [ ] Implement loading states
- [ ] Add retry logic
- [ ] Test with Postman

### Resources

- **API Documentation:** [https://your-app.vercel.app/api/mobile/README.md](https://your-app.vercel.app/api/mobile/README.md)
- **Architecture Docs:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Postman Collection:** [Download](./postman-collection.json)

### Support

Jika ada pertanyaan atau issue:
1. Baca dokumentasi lengkap
2. Test dengan Postman terlebih dahulu
3. Check error logs di console
4. Pastikan token valid dan belum expired

**Happy Coding! 🚀**


---

# ❓ FAQ & TROUBLESHOOTING


- [Performance Tips](#performance-tips)

---

## FAQ - Pertanyaan Umum

### 💡 **Konsep Dasar**

#### **Q: Apa itu Web Service?**
**A:** Web Service adalah sistem yang menyediakan data dan fungsi melalui internet menggunakan protokol HTTP, sehingga aplikasi lain (web, mobile, desktop) dapat mengaksesnya.

**Analogi:** Seperti restoran yang menerima pesanan via telepon/online dan mengirim makanan. Client (mobile app) pesan data, Web Service (backend) kirim data.

👉 **Detail:** [Baca Penjelasan Lengkap](./ARCHITECTURE.md#1-apa-itu-web-service)

---

#### **Q: Apakah SynClass adalah Web Service?**
**A:** **YA!** SynClass adalah Web Service karena:
- ✅ Punya REST API (18+ endpoints)
- ✅ Client bisa web browser atau mobile app
- ✅ Response dalam format JSON
- ✅ Menggunakan HTTP/HTTPS protocol

👉 **Bukti:** [SynClass sebagai Web Service](./ARCHITECTURE.md#synclass-sebagai-web-service)

---

#### **Q: Apa perbedaan JWT Token dan Session?**

| Aspek | JWT Token | Session |
|-------|-----------|---------|
| **Data disimpan** | Di CLIENT (mobile app) | Di SERVER (database) |
| **Setiap request** | Verify signature (cepat!) | Query database (lambat) |
| **Scalability** | ✅ Mudah (stateless) | ❌ Sulit (perlu shared storage) |
| **Mobile-friendly** | ✅ Perfect | ❌ Terbatas |

**SynClass pakai JWT karena:**
- Mobile app support
- Stateless (cocok serverless)
- Industry standard

👉 **Detail:** [JWT vs Session](./ARCHITECTURE.md#jwt-vs-session)

---

#### **Q: Apa itu RLS (Row Level Security)?**
**A:** RLS adalah fitur keamanan di PostgreSQL yang mengatur **siapa boleh lihat/edit baris data mana** di tabel.

**Contoh:**
- Mahasiswa A hanya bisa lihat profile miliknya sendiri
- Mahasiswa B tidak bisa lihat profile Mahasiswa A
- Kaprodi bisa lihat semua profile

**Keuntungan:**
- ✅ Automatic data filtering per user
- ✅ Tidak bisa di-bypass dari client
- ✅ Keamanan di level database

👉 **Detail:** [RLS Explained](./ARCHITECTURE.md#6-apa-itu-row-level-security-rls)

---

#### **Q: Apa perbedaan PostgreSQL dan MySQL?**

| Aspek | PostgreSQL | MySQL |
|-------|-----------|-------|
| **Kompleksitas** | Advanced | Sederhana |
| **RLS** | ✅ Built-in | ❌ Tidak ada |
| **JSON Support** | ✅ Native (JSONB) | ⚠️ Terbatas |
| **Best For** | Complex apps | Simple websites |

**SynClass pakai PostgreSQL karena:**
- RLS untuk keamanan
- JSONB untuk flexible data
- Advanced features

👉 **Detail:** [PostgreSQL vs MySQL](./ARCHITECTURE.md#postgresql-vs-mysql)

---

### 🔐 **Authentication & Security**

#### **Q: Kenapa perlu kirim token di setiap request?**
**A:** Karena JWT stateless - server TIDAK menyimpan info session. Token adalah **proof** bahwa Anda sudah login.

**Analogi:**
- Token = Tiket bioskop
- Setiap masuk ruangan harus tunjukkan tiket
- Tanpa tiket = ditolak (401 Unauthorized)

**Di Code:**
```http
GET /api/mobile/student/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...  ← Token wajib!
```

---

#### **Q: Apa yang terjadi jika access token expired?**
**A:** Mobile app akan dapat error `401 Unauthorized`. Solusi:
1. Gunakan **refresh token** untuk dapat access token baru
2. Tidak perlu login ulang!

**Flow:**
```
Access token expired → POST /auth/refresh
                       + refresh_token
                    → Dapat access_token baru
                    → Retry request
```

**Hanya login ulang jika:**
- Refresh token juga expired (30 hari)
- User logout manual

👉 **Detail:** [Refresh Token Flow](./MOBILE_INTEGRATION_GUIDE.md#2-refresh-token)

---

#### **Q: Apa perbedaan NEXT_PUBLIC_SUPABASE_ANON_KEY dan SUPABASE_SERVICE_ROLE_KEY?**

| Key Type | Safe for Client? | Bypass RLS? | Use Case |
|----------|------------------|-------------|----------|
| **ANON_KEY** | ✅ Yes | ❌ No | Login, query dengan RLS |
| **SERVICE_ROLE_KEY** | ❌ NEVER! | ✅ Yes | Admin operations |

**ANON_KEY:**
```typescript
// ✅ Safe to use in browser/mobile
const supabase = createClient(url, ANON_KEY)
await supabase.from('profiles').select('*')  // RLS auto-filter
```

**SERVICE_ROLE_KEY:**
```typescript
// ⚠️ Server-side ONLY! NEVER expose to client!
const adminClient = createClient(url, SERVICE_ROLE_KEY)
await adminClient.auth.admin.createUser(...)  // Bypass RLS
```

👉 **Detail:** [Supabase Keys](./ARCHITECTURE.md#supabase-keys)

---

#### **Q: Apakah data bisa diakses tanpa login?**
**A:** **TIDAK!** Kecuali 3 endpoint public:
- `POST /auth/login` ← Untuk login
- `POST /auth/refresh` ← Untuk refresh token
- `POST /auth/logout` ← Untuk logout

**Semua endpoint lainnya** (profile, classes, grades, dll) **WAJIB login** dengan JWT token.

**Test sendiri dengan Postman:**
```http
GET /api/mobile/student/profile
(Tanpa header Authorization)

→ Response: 401 Unauthorized
→ Error: "Missing authorization token"
```

---

### 📱 **Mobile Integration**

#### **Q: Bagaimana cara mobile app akses API?**
**A:** 
1. **Login** dulu dapat access_token
2. **Simpan token** di secure storage
3. **Setiap request** kirim token di header
4. **Parse JSON** response

**Example (Flutter):**
```dart
// 1. Login
final result = await authService.login(email, password);
// Save token to FlutterSecureStorage

// 2. Request dengan token
final response = await http.get(
  Uri.parse('$baseUrl/student/profile'),
  headers: {
    'Authorization': 'Bearer $accessToken',
  },
);
```

👉 **Tutorial Lengkap:** [Flutter Integration](./MOBILE_INTEGRATION_GUIDE.md#flutter-integration)

---

#### **Q: Apakah harus pakai Flutter? Bisa React Native?**
**A:** **Bisa keduanya!** SynClass adalah REST API, bisa diakses dari:
- ✅ Flutter
- ✅ React Native
- ✅ Kotlin (Android Native)
- ✅ Swift (iOS Native)
- ✅ Web (Axios/Fetch)

**Yang penting:**
- HTTP/HTTPS request library
- JSON parser
- Secure storage untuk token

👉 **Examples:**
- [Flutter Integration](./MOBILE_INTEGRATION_GUIDE.md#flutter-integration)
- [React Native Integration](./MOBILE_INTEGRATION_GUIDE.md#react-native-integration)

---

#### **Q: Dimana menyimpan token di mobile app?**

**✅ DO (Recommended):**
- **Flutter:** `flutter_secure_storage`
- **React Native:** `react-native-encrypted-storage`
- **Android Native:** `EncryptedSharedPreferences`
- **iOS Native:** `Keychain`

**❌ DON'T:**
- `SharedPreferences` (Flutter) - tidak encrypted
- `AsyncStorage` (React Native) - tidak encrypted
- Plain text files
- Database tanpa encryption

**Kenapa penting?**
- Token adalah "kunci" akses data user
- Jika dicuri = hacker bisa akses data

---

### 🗄️ **Database**

#### **Q: Apa hubungan Supabase dengan PostgreSQL?**
**A:** 
- **PostgreSQL** = Mesin database (core engine)
- **Supabase** = "Wrapper" di atas PostgreSQL + extra features

**Analogi:**
- PostgreSQL = Mesin mobil
- Supabase = Mobil lengkap (mesin + AC + GPS + sound system)

**Supabase menambahkan:**
- Dashboard UI
- Auto-generated REST API
- Authentication (JWT)
- Storage (file upload)
- Realtime subscriptions

👉 **Detail:** [Hubungan dengan Supabase](./ARCHITECTURE.md#hubungan-dengan-supabase)

---

#### **Q: Apakah perlu AWS untuk database?**
**A:** **TIDAK!** Supabase sudah include hosting PostgreSQL.

**Pilihan hosting database:**
- ✅ **Supabase Cloud** ← SynClass pakai ini (gratis tier 500MB)
- ⚠️ AWS RDS (bayar ~$15-100/bulan)
- ⚠️ Google Cloud SQL (bayar)
- ⚠️ Self-hosted (server sendiri)

**Tidak ada hubungan langsung** antara Supabase dan AWS.

---

### 🚀 **Deployment**

#### **Q: Bagaimana cara deploy ke production?**
**A:**
1. Push code ke GitHub
2. Login ke [Vercel](https://vercel.com)
3. Import repository
4. Set environment variables
5. Deploy!

**Vercel auto-deploy** setiap push ke GitHub.

👉 **Tutorial:** [Deploy ke Vercel](./README.md#deploy-ke-vercel)

---

#### **Q: Apakah gratis deploy di Vercel?**
**A:** **YA!** Vercel punya free tier:
- ✅ Unlimited deployments
- ✅ HTTPS/SSL gratis
- ✅ Global CDN
- ✅ Serverless functions

**Limit free tier:**
- 100GB bandwidth/month
- 100 hours serverless execution/month
- (Cukup untuk development & small-medium apps)

---

## Troubleshooting - Pemecahan Masalah

### 🔧 **Development Issues**

#### **Problem: `npm install` gagal**

**Solusi:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules & package-lock.json
rm -rf node_modules package-lock.json

# 3. Install ulang
npm install

# 4. Jika masih gagal, coba yarn
npm install -g yarn
yarn install
```

---

#### **Problem: Port 3000 already in use**

**Solusi 1 - Kill process:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Solusi 2 - Use different port:**
```bash
PORT=3001 npm run dev
```

---

#### **Problem: Environment variables tidak terbaca**

**Checklist:**
- ✅ File harus bernama `.env.local` (bukan `.env` saja)
- ✅ Restart dev server setelah edit `.env.local`
- ✅ Public vars harus prefix `NEXT_PUBLIC_`
- ✅ Tidak ada spasi sebelum/sesudah `=`

**Contoh yang BENAR:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Contoh yang SALAH:**
```env
NEXT_PUBLIC_SUPABASE_URL = https://abc.supabase.co  ← Ada spasi!
SUPABASE_URL=https://abc.supabase.co  ← Kurang prefix NEXT_PUBLIC_
```

---

#### **Problem: Supabase connection error**

**Checklist:**
1. ✅ URL benar? Check di Supabase Dashboard → Settings → API
2. ✅ Keys benar? Copy-paste lagi dari dashboard
3. ✅ Internet connection aktif?
4. ✅ Supabase project tidak suspended?

**Test connection:**
```typescript
// Test di browser console atau API route
const { data, error } = await supabase.auth.getSession()
console.log('Session:', data)
console.log('Error:', error)
```

---

### 🔐 **Authentication Issues**

#### **Problem: Login return 401 "Invalid credentials"**

**Kemungkinan:**
1. Email/password salah
2. User belum terdaftar di database
3. User belum verified email

**Debug:**
```sql
-- Check di Supabase SQL Editor
SELECT email, email_confirmed_at
FROM auth.users
WHERE email = 'student@mail.com';

-- Jika email_confirmed_at NULL → user belum verify email
```

**Solusi:**
```sql
-- Manual verify email (untuk testing)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'student@mail.com';
```

---

#### **Problem: Token expired terus-menerus**

**Penyebab:** Jam server/client tidak sinkron

**Debug:**
```javascript
// Check JWT payload
const token = "eyJhbGci...";
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Issued at:', new Date(payload.iat * 1000));
console.log('Expires at:', new Date(payload.exp * 1000));
console.log('Now:', new Date());
```

**Solusi:**
- Sync jam sistem dengan NTP
- Atau gunakan refresh token lebih awal (sebelum expired)

---

#### **Problem: CORS error di browser**

**Penyebab:** Frontend di domain berbeda dengan backend

**Solusi (development):**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
        ],
      },
    ];
  },
};
```

**Note:** Untuk production, ganti `*` dengan domain specific.

---

### 📱 **Mobile Integration Issues**

#### **Problem: Flutter - "Missing authorization token"**

**Checklist:**
1. ✅ Token tersimpan di secure storage?
   ```dart
   final token = await storage.read(key: 'access_token');
   print('Token: $token');  // Check if null
   ```

2. ✅ Header format benar?
   ```dart
   // ✅ CORRECT
   headers: {
     'Authorization': 'Bearer $token',
   }
   
   // ❌ WRONG
   headers: {
     'Authorization': token,  // Missing "Bearer"
   }
   ```

3. ✅ Token expired?
   ```dart
   // Decode & check expiry
   final parts = token.split('.');
   final payload = json.decode(
     utf8.decode(base64Url.decode(base64Url.normalize(parts[1])))
   );
   print('Expires: ${DateTime.fromMillisecondsSinceEpoch(payload['exp'] * 1000)}');
   ```

---

#### **Problem: React Native - Network request failed**

**Kemungkinan:**
1. Android emulator tidak bisa akses `localhost`
2. iOS App Transport Security block HTTP

**Solusi Android:**
```javascript
// Ganti localhost dengan IP address
const BASE_URL = 'http://10.0.2.2:3000/api/mobile';  // Android emulator
// atau
const BASE_URL = 'http://192.168.1.100:3000/api/mobile';  // Real device
```

**Solusi iOS:**
```xml
<!-- ios/YourApp/Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>  <!-- Hanya untuk development! -->
</dict>
```

---

### 🗄️ **Database Issues**

#### **Problem: RLS policy block semua query**

**Symptom:** Query return empty array meskipun data ada

**Debug:**
```sql
-- 1. Disable RLS temporarily (untuk testing)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Query lagi, jika dapat data → problem di RLS policy

-- 3. Check policy
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

**Fix policy:**
```sql
-- Contoh policy yang benar
DROP POLICY IF EXISTS "Users see own profile" ON profiles;

CREATE POLICY "Users see own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);  -- Make sure this condition is correct!
```

---

#### **Problem: Foreign key constraint violation**

**Error:**
```
insert or update on table "krs_pengajuan" violates 
foreign key constraint "krs_pengajuan_mahasiswa_id_fkey"
```

**Penyebab:** Mencoba insert `mahasiswa_id` yang tidak ada di `profiles`

**Solusi:**
```sql
-- 1. Check apakah mahasiswa_id exist
SELECT id FROM profiles WHERE id = 'uuid-yang-error';

-- 2. Jika tidak ada, create user dulu atau pakai id yang benar
```

---

#### **Problem: Migration gagal di production**

**Solusi:**
1. **Backup database dulu!**
   ```bash
   # Di Supabase Dashboard → Database → Backups
   ```

2. **Run migration manual:**
   ```sql
   -- Copy SQL dari migration file
   -- Paste di Supabase SQL Editor
   -- Run satu-satu, check error
   ```

3. **Rollback jika error:**
   ```sql
   -- Restore dari backup
   ```

---

### 🚀 **Deployment Issues**

#### **Problem: Vercel build failed**

**Check build logs:**
```bash
# Error biasanya:
# 1. TypeScript errors
# 2. Missing dependencies
# 3. Environment variables
```

**Solusi:**
```bash
# 1. Build locally dulu
npm run build

# 2. Fix errors yang muncul

# 3. Push lagi ke GitHub
```

---

#### **Problem: API works locally but not on Vercel**

**Checklist:**
1. ✅ Environment variables set di Vercel?
   - Dashboard → Settings → Environment Variables
   - Add semua vars dari `.env.local`

2. ✅ Serverless function timeout?
   - Vercel free tier: 10s limit
   - Optimize query atau upgrade plan

3. ✅ CORS issue?
   - Add CORS headers di API routes

---

## Best Practices

### 🔐 **Security**

#### **DO:**
- ✅ Always use HTTPS in production
- ✅ Validate input di server-side
- ✅ Use RLS policies untuk semua tabel
- ✅ Rotate secrets regularly
- ✅ Log security events

#### **DON'T:**
- ❌ Expose SERVICE_ROLE_KEY ke client
- ❌ Trust client-side validation
- ❌ Store sensitive data in localStorage
- ❌ Commit `.env.local` to Git
- ❌ Use `SELECT *` without RLS

---

### 📱 **Mobile Development**

#### **DO:**
- ✅ Use secure storage for tokens
- ✅ Implement retry logic
- ✅ Handle network errors gracefully
- ✅ Show loading states
- ✅ Implement pull-to-refresh

#### **DON'T:**
- ❌ Store tokens in plain text
- ❌ Ignore 401/403 errors
- ❌ Make request without timeout
- ❌ Cache sensitive data indefinitely

---

### 💻 **Code Quality**

#### **DO:**
- ✅ Use TypeScript untuk type safety
- ✅ Write JSDoc comments
- ✅ Follow ESLint rules
- ✅ Use meaningful variable names
- ✅ Keep functions small & focused

#### **DON'T:**
- ❌ Use `any` type unnecessarily
- ❌ Duplicate code (DRY principle)
- ❌ Commit commented code
- ❌ Ignore linter warnings

---

## Performance Tips

### ⚡ **Database Optimization**

#### **1. Add Indexes**
```sql
-- Index untuk sering di-query
CREATE INDEX idx_krs_mahasiswa 
ON krs_pengajuan(mahasiswa_id);

CREATE INDEX idx_nilai_mahasiswa 
ON nilai(mahasiswa_id, semester);
```

#### **2. Use JOIN wisely**
```sql
-- ✅ GOOD: Select hanya kolom yang dibutuhkan
SELECT p.username, m.nama_mk
FROM profiles p
JOIN krs_pengajuan k ON k.mahasiswa_id = p.id
JOIN matakuliah m ON m.id = k.matakuliah_id;

-- ❌ BAD: SELECT *
SELECT *
FROM profiles p
JOIN krs_pengajuan k ON k.mahasiswa_id = p.id
JOIN matakuliah m ON m.id = k.matakuliah_id;
```

#### **3. Pagination**
```typescript
// API endpoint dengan pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const { data, count } = await supabase
    .from('matakuliah')
    .select('*', { count: 'exact' })
    .range((page - 1) * limit, page * limit - 1);
  
  return successResponse({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
}
```

---

### 📱 **Mobile App Optimization**

#### **1. Cache Data**
```dart
// Flutter - Cache dengan Hive/SQLite
class DataCache {
  static final Map<String, dynamic> _cache = {};
  static final Map<String, DateTime> _timestamp = {};
  
  static Future<dynamic> get(String key, Future<dynamic> Function() fetch) async {
    if (_cache.containsKey(key)) {
      final age = DateTime.now().difference(_timestamp[key]!);
      if (age.inMinutes < 5) {  // Cache 5 menit
        return _cache[key];
      }
    }
    
    final data = await fetch();
    _cache[key] = data;
    _timestamp[key] = DateTime.now();
    return data;
  }
}

// Usage
final classes = await DataCache.get(
  'student_classes',
  () => studentService.getClasses(),
);
```

#### **2. Debounce API Calls**
```dart
// Flutter - Debounce search
Timer? _debounce;

void onSearchChanged(String query) {
  if (_debounce?.isActive ?? false) _debounce!.cancel();
  
  _debounce = Timer(const Duration(milliseconds: 500), () {
    // Call API after user stop typing for 500ms
    searchAPI(query);
  });
}
```

#### **3. Image Optimization**
```dart
// Flutter - Lazy load images
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return CachedNetworkImage(
      imageUrl: items[index].imageUrl,
      placeholder: (context, url) => CircularProgressIndicator(),
      errorWidget: (context, url, error) => Icon(Icons.error),
    );
  },
);
```

---

### 🚀 **API Performance**

#### **1. Use Compression**
```typescript
// next.config.ts
const nextConfig = {
  compress: true,  // Enable gzip compression
};
```

#### **2. Implement Caching**
```typescript
// API route dengan cache header
export async function GET(request: NextRequest) {
  const data = await fetchData();
  
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      // Cache 60 detik, revalidate 30 detik
    },
  });
}
```

#### **3. Batch Requests**
```typescript
// ❌ BAD: Multiple requests
const profile = await fetch('/api/mobile/student/profile');
const classes = await fetch('/api/mobile/student/classes');
const grades = await fetch('/api/mobile/student/grades');

// ✅ GOOD: Single batch request
const data = await fetch('/api/mobile/student/dashboard', {
  // Return profile, classes, grades dalam satu response
});
```

---

## 📞 Butuh Bantuan Lebih Lanjut?

Jika masalah Anda tidak ada di FAQ ini:

1. **📖 Baca dokumentasi lengkap:**
   - [Konsep Dasar](./ARCHITECTURE.md)
   - [Mobile Integration](./MOBILE_INTEGRATION_GUIDE.md)

2. **🧪 Test dengan Postman:**
   - Isolate problem (API atau mobile?)

3. **🔍 Check logs:**
   - Vercel Dashboard → Logs
   - Browser Console
   - Mobile app logs

4. **💬 Ask community:**
   - GitHub Issues
   - Stack Overflow
   - Discord/Slack

---

<div align="center">

**Semoga FAQ ini membantu! 🚀**

[⬆️ Back to Top](#-faq--troubleshooting---synclass)

</div>

---

<div align="center">

## 🎉 Selamat! Anda Sudah Menyelesaikan Dokumentasi Lengkap!

**SynClass Documentation v2.0 - Complete in One File**  
📄 3600+ baris dokumentasi comprehensive  
🚀 Mulai dari Getting Started hingga Troubleshooting  

### 📚 Yang Sudah Anda Pelajari:

✅ **PART 1:** Setup project dari nol hingga production  
✅ **PART 2:** Arsitektur sistem, database, security layers  
✅ **PART 3:** Integrasi Flutter & React Native lengkap  
✅ **PART 4:** 20+ FAQ & solusi troubleshooting  

### 🔗 Resources Tambahan:

- [GitHub Repository](https://github.com/username/synclass)
- [Live Demo](https://synclass.vercel.app)
- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Dashboard](https://vercel.com/dashboard)

### 💬 Butuh Bantuan?

- 📧 Email: support@synclass.id
- 💬 Discord: [Join Community](https://discord.gg/synclass)
- 🐛 Issues: [GitHub Issues](https://github.com/username/synclass/issues)

---

**Made with ❤️ by SynClass Team**  
📅 Terakhir diupdate: Januari 2026

[⬆️ Back to Top](#-synclass---sistem-informasi-akademik-modern)

</div>
