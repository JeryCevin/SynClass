# 🎓 SynClass

**Sistem Informasi Akademik Terintegrasi - Modern Web Service dengan REST API**

SynClass adalah **web service** modern berbasis Next.js yang menyediakan backend lengkap untuk sistem informasi akademik. Aplikasi ini mengimplementasikan **REST API** dengan **JWT authentication**, mendukung **web application** dan **mobile app** (Flutter/React Native) dengan arsitektur client-server yang scalable.

**🚀 Fitur Unggulan:**
- ✅ **RESTful Web Service** - Backend API untuk multi-platform
- ✅ **18+ REST API Endpoints** - Ready untuk mobile integration
- ✅ **JWT Token Authentication** - Stateless & secure token-based auth
- ✅ **PostgreSQL + Supabase** - Database dengan Row Level Security (RLS)
- ✅ **Production Ready** - Deploy ke Vercel dalam menit
- ✅ **Multi-Role System** - Mahasiswa, Dosen, Kaprodi

---

## 📋 Daftar Isi

### 📖 **BAGIAN I: KONSEP DASAR (Untuk Pemula)**
1. [Apa itu Web Service?](#1-apa-itu-web-service)
   - [Definisi Web Service](#definisi-web-service)
   - [SynClass sebagai Web Service](#synclass-sebagai-web-service)
   - [Arsitektur Client-Server](#arsitektur-client-server)
   
2. [Apa itu REST API?](#2-apa-itu-rest-api)
   - [Definisi REST API](#definisi-rest-api)
   - [Prinsip REST](#prinsip-rest)
   - [HTTP Methods](#http-methods)
   - [Contoh REST API di SynClass](#contoh-rest-api-di-synclass)

3. [Apa itu JWT Token?](#3-apa-itu-jwt-token)
   - [Definisi JWT](#definisi-jwt)
   - [JWT vs Session](#jwt-vs-session)
   - [Struktur JWT Token](#struktur-jwt-token)
   - [Access Token & Refresh Token](#access-token--refresh-token)
   - [Alur Penggunaan JWT](#alur-penggunaan-jwt)

4. [Apa itu Supabase?](#4-apa-itu-supabase)
   - [Definisi Supabase](#definisi-supabase)
   - [Supabase Keys (ANON vs SERVICE_ROLE)](#supabase-keys)
   - [Supabase vs Firebase](#supabase-vs-firebase)
   - [Kenapa Pakai Supabase?](#kenapa-pakai-supabase)

5. [Apa itu PostgreSQL?](#5-apa-itu-postgresql)
   - [PostgreSQL vs MySQL](#postgresql-vs-mysql)
   - [Hubungan dengan Supabase](#hubungan-dengan-supabase)
   - [Hubungan dengan AWS](#hubungan-dengan-aws)

6. [Apa itu Row Level Security (RLS)?](#6-apa-itu-row-level-security-rls)
   - [Definisi RLS](#definisi-rls)
   - [RLS vs Role Verification](#rls-vs-role-verification)
   - [Contoh RLS Policy](#contoh-rls-policy)
   - [Keuntungan RLS](#keuntungan-rls)

### 🏗 **BAGIAN II: ARSITEKTUR SISTEM**
7. [Arsitektur SynClass](#7-arsitektur-synclass)
   - [Diagram Arsitektur Lengkap](#diagram-arsitektur-lengkap)
   - [Layer-by-Layer Explanation](#layer-by-layer-explanation)
   - [Data Flow](#data-flow)

8. [Keamanan Berlapis](#8-keamanan-berlapis)
   - [6 Lapisan Keamanan](#6-lapisan-keamanan)
   - [Public vs Protected Endpoints](#public-vs-protected-endpoints)
   - [Token Verification Flow](#token-verification-flow)

### ✨ **BAGIAN III: FITUR & FUNGSIONALITAS**
9. [Fitur Utama](#9-fitur-utama)
   - [Dashboard Multi-Role](#dashboard-multi-role)
   - [Manajemen Akademik](#manajemen-akademik)
   - [Authentication & Authorization](#authentication--authorization)

10. [Peran Pengguna (Role-Based Access)](#10-peran-pengguna)
    - [Mahasiswa](#mahasiswa)
    - [Dosen](#dosen)
    - [Kaprodi](#kaprodi)

### 🔌 **BAGIAN IV: MOBILE API (REST API Documentation)**
11. [Mobile API Overview](#11-mobile-api-overview)
    - [Base URL & Format](#base-url--format)
    - [Authentication Flow](#authentication-flow)
    - [Response Format](#response-format)
    - [Error Handling](#error-handling)

12. [API Endpoints](#12-api-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Student Endpoints](#student-endpoints)
    - [Testing dengan Postman](#testing-dengan-postman)

### 💻 **BAGIAN V: TEKNOLOGI & IMPLEMENTASI**
13. [Teknologi yang Digunakan](#13-teknologi-yang-digunakan)
    - [Frontend Stack](#frontend-stack)
    - [Backend Stack](#backend-stack)
    - [Database & Auth](#database--auth)
    - [Deployment](#deployment)

14. [Struktur Proyek](#14-struktur-proyek)
    - [Folder Structure](#folder-structure)
    - [File Organization](#file-organization)

### 🚀 **BAGIAN VI: INSTALASI & DEPLOYMENT**
15. [Instalasi](#15-instalasi)
    - [Prerequisites](#prerequisites)
    - [Setup Project](#setup-project)
    - [Environment Variables](#environment-variables)

16. [Konfigurasi Database](#16-konfigurasi-database)
    - [Setup Supabase](#setup-supabase)
    - [Database Schema](#database-schema)
    - [RLS Policies](#rls-policies)

17. [Menjalankan Aplikasi](#17-menjalankan-aplikasi)
    - [Development Mode](#development-mode)
    - [Production Build](#production-build)

18. [Deployment](#18-deployment)
    - [Deploy ke Vercel](#deploy-ke-vercel)
    - [Environment Variables](#environment-variables-production)

### 📱 **BAGIAN VII: PANDUAN MOBILE DEVELOPER**
19. [Untuk Mobile Developers](#19-untuk-mobile-developers)
    - [Getting Started](#getting-started)
    - [Integration Guide](#integration-guide)
    - [Flutter Example](#flutter-example)
    - [React Native Example](#react-native-example)

### 📚 **BAGIAN VIII: FAQ & TROUBLESHOOTING**
20. [FAQ (Frequently Asked Questions)](#20-faq)
21. [Troubleshooting](#21-troubleshooting)
22. [Kontribusi](#22-kontribusi)
23. [Lisensi](#23-lisensi)

---

# 📖 BAGIAN I: KONSEP DASAR

## 1. Apa itu Web Service?

### Definisi Web Service

**Web Service** adalah sistem yang menyediakan data dan fungsi melalui internet menggunakan protokol HTTP, sehingga aplikasi lain (web, mobile, desktop) dapat mengaksesnya.

**Analogi Sederhana:**

```
Web Service = Restoran
┌────────────────────────────────────────┐
│         🍽️ RESTORAN (Web Service)     │
├────────────────────────────────────────┤
│                                        │
│  Menu (API Endpoints):                 │
│  - GET  /menu        → Lihat menu      │
│  - POST /order       → Pesan makanan   │
│  - GET  /order/123   → Cek pesanan     │
│                                        │
│  Pelanggan (Client):                   │
│  - 📱 Mobile App     → Pesan online    │
│  - 💻 Website        → Pesan via web   │
│  - 🤖 Aplikasi Lain  → API integration │
│                                        │
│  Dapur (Database):                     │
│  - 🗄️ PostgreSQL     → Simpan data     │
│                                        │
└────────────────────────────────────────┘
```

### SynClass sebagai Web Service

**YA! SynClass adalah Web Service lengkap** karena memiliki:

| Komponen | SynClass | Penjelasan |
|----------|----------|------------|
| ✅ **Backend API** | Next.js API Routes | Server yang memproses request |
| ✅ **REST Endpoints** | 18+ endpoints | URL yang bisa diakses |
| ✅ **Database** | PostgreSQL (Supabase) | Penyimpanan data |
| ✅ **Authentication** | JWT Token | Sistem login & keamanan |
| ✅ **JSON Response** | Standard format | Format data universal |
| ✅ **Multi-Client** | Web + Mobile | Bisa diakses berbagai platform |

### Arsitektur Client-Server

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET (Cloud)                         │
│                                                             │
│  ┌───────────────┐              ┌──────────────────┐        │
│  │  WEB BROWSER  │              │   MOBILE APP     │        │
│  │  (Client 1)   │              │   (Client 2)     │        │
│  └───────┬───────┘              └────────┬─────────┘        │
│          │                               │                  │
│          │   HTTP Request (JSON)         │                  │
│          └───────────────┬───────────────┘                  │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   WEB SERVICE         │                      │
│              │   (SynClass Backend)  │                      │
│              │   • Next.js API       │                      │
│              │   • JWT Auth          │                      │
│              │   • Business Logic    │                      │
│              └──────────┬────────────┘                      │
│                         │                                   │
│                         │ SQL Query                         │
│                         ▼                                   │
│              ┌───────────────────────┐                      │
│              │   DATABASE            │                      │
│              │   (Supabase)          │                      │
│              │   PostgreSQL + RLS    │                      │
│              └───────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cara Kerja:**
1. **Client** (web/mobile) kirim **HTTP Request** ke Web Service
2. **Web Service** terima request, proses, ambil/simpan data ke **Database**
3. **Web Service** kirim **HTTP Response** (JSON) kembali ke Client
4. **Client** tampilkan data ke user

---

## 2. Apa itu REST API?

### Definisi REST API

**REST (Representational State Transfer)** adalah gaya arsitektur untuk membangun web service yang menggunakan protokol HTTP dengan format data terstruktur (JSON/XML).

**REST API = Aturan komunikasi antara client dan server**

### Prinsip REST

REST API memiliki **6 prinsip utama:**

#### 1. **Client-Server Architecture**
```
Client (Mobile)  ←── HTTP ──→  Server (Backend)
   (UI/UX)                      (Business Logic + Database)
```

#### 2. **Stateless** (Tidak menyimpan state)
```
Setiap request HARUS membawa semua informasi yang dibutuhkan
Server TIDAK mengingat request sebelumnya

Request #1: GET /profile (+ JWT Token)
Request #2: GET /classes (+ JWT Token)  ← Harus kirim token lagi!
```

#### 3. **Uniform Interface** (HTTP Methods)
```
GET    → Ambil data (Read)
POST   → Buat data baru (Create)
PUT    → Update data lengkap (Update)
PATCH  → Update sebagian data (Partial Update)
DELETE → Hapus data (Delete)
```

#### 4. **Resource-Based URLs**
```
✅ GOOD REST:
GET    /api/students              → Semua mahasiswa
GET    /api/students/123          → Mahasiswa dengan ID 123
POST   /api/students              → Buat mahasiswa baru
PUT    /api/students/123          → Update mahasiswa 123
DELETE /api/students/123          → Hapus mahasiswa 123

❌ BAD (Non-REST):
GET  /api/getStudentById?id=123
POST /api/createNewStudent
POST /api/deleteStudentFromDatabase
```

#### 5. **Representation** (JSON/XML)
```json
// Response selalu dalam format standard
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Budi"
  }
}
```

#### 6. **Layered System**
```
Client tidak perlu tahu detail server:
- Database apa yang dipakai? (PostgreSQL/MySQL)
- Di-host dimana? (AWS/Vercel)
- Pakai cache atau tidak? (Redis)

Client hanya perlu tahu: URL + HTTP Method + Token
```

### HTTP Methods

| Method | Fungsi | Contoh di SynClass |
|--------|--------|-------------------|
| **GET** | Ambil data | `GET /api/mobile/student/profile` |
| **POST** | Buat data baru | `POST /api/mobile/auth/login` |
| **PUT** | Update data lengkap | `PUT /api/mobile/student/profile` |
| **PATCH** | Update sebagian | `PATCH /api/mobile/student/profile` |
| **DELETE** | Hapus data | `DELETE /api/mobile/student/krs/123` |

### Contoh REST API di SynClass

#### **Request:**
```http
GET /api/mobile/student/classes HTTP/1.1
Host: synclass.vercel.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "matakuliah-001",
        "matakuliah": {
          "nama_mk": "Pemrograman Web",
          "sks": 3,
          "hari": "Senin",
          "jam_mulai": "08:00",
          "jam_selesai": "10:30",
          "dosen": {
            "nama": "Dr. Budi Santoso"
          }
        }
      }
    ],
    "total": 1
  },
  "message": "Success"
}
```

**SynClass adalah REST API karena:**
- ✅ Menggunakan HTTP Methods (GET, POST, PUT, DELETE)
- ✅ Resource-based URLs (`/student/profile`, `/student/classes`)
- ✅ Stateless (pakai JWT token di setiap request)
- ✅ JSON Response (format standard)
- ✅ Client-Server separation

---

## 3. Apa itu JWT Token?

### Definisi JWT

**JWT (JSON Web Token)** adalah standar terbuka (RFC 7519) untuk membuat **token digital** yang aman untuk autentikasi dan pertukaran informasi antara client dan server.

**JWT = Tiket Digital yang Membuktikan Identitas Anda**

### JWT vs Session

#### **Perbedaan Fundamental:**

| Aspek | SESSION (Traditional) | JWT TOKEN (Modern) |
|-------|----------------------|-------------------|
| **Data disimpan** | Di **SERVER** (database) | Di **CLIENT** (mobile/browser) |
| **Setiap request** | Query database | Verify signature (tanpa DB) |
| **Ukuran** | Kecil (~20 char) | Besar (~500+ char) |
| **Stateful/Stateless** | Stateful | Stateless ✅ |
| **Scalability** | Sulit (butuh shared session) | Mudah ✅ |
| **Mobile-friendly** | ❌ Terbatas | ✅ Perfect |
| **Revoke token** | Mudah (hapus dari DB) | Sulit (pakai refresh token) |
| **Best for** | Web apps tradisional | Mobile apps, Microservices ✅ |

#### **Cara Kerja Session:**

```
┌─────────────────────────────────────────────────────────┐
│                SESSION-BASED AUTH                       │
└─────────────────────────────────────────────────────────┘

Browser               Server              Database
   📱                   🖥️                  🗄️
   │                    │                   │
   │ 1. Login           │                   │
   ├───────────────────►│ 2. Create Session │
   │                    ├──────────────────►│
   │                    │   session_id: abc │
   │                    │   user_id: 42     │
   │ 3. Set Cookie      │◄──────────────────┤
   │   session_id=abc   │                   │
   │◄───────────────────┤                   │
   │                    │                   │
   │ 4. Request API     │                   │
   │   Cookie: abc      │                   │
   ├───────────────────►│ 5. Query Session  │
   │                    ├──────────────────►│
   │                    │   WHERE id='abc'  │
   │                    │◄──────────────────┤
   │                    │   Found: user=42  │
   │ 6. Response        │                   │
   │◄───────────────────┤                   │

❌ Problem: Setiap request = database query (lambat!)
```

#### **Cara Kerja JWT:**

```
┌─────────────────────────────────────────────────────────┐
│                  JWT TOKEN AUTH                         │
└─────────────────────────────────────────────────────────┘

Mobile App            Server              Database
   📱                   🖥️                  🗄️
   │                    │                   │
   │ 1. Login           │                   │
   ├───────────────────►│ 2. Verify User    │
   │                    ├──────────────────►│
   │                    │◄──────────────────┤
   │                    │ 3. Generate JWT   │
   │                    │   {user_id: 42,   │
   │                    │    role: student} │
   │ 4. Return Token    │   + SIGNATURE     │
   │   eyJhbGci...      │                   │
   │◄───────────────────┤   NOT SAVED!      │
   │ Save to Storage    │                   │
   │                    │                   │
   │ 5. Request API     │                   │
   │   Bearer eyJhbGci  │                   │
   ├───────────────────►│ 6. Verify Sign    │
   │                    │   (NO DATABASE!)  │
   │                    │   Decode: user=42 │
   │ 7. Response        │                   │
   │◄───────────────────┤                   │

✅ Keuntungan: Tidak perlu query database (cepat & scalable!)
```

### Struktur JWT Token

JWT terdiri dari **3 bagian** yang dipisahkan titik (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwicm9sZSI6InN0dWRlbnQifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

│────────── HEADER ─────────│───────────── PAYLOAD ────────────│──────── SIGNATURE ───────│
```

#### **1. HEADER** (Metadata)
```json
{
  "alg": "HS256",    // Algoritma enkripsi
  "typ": "JWT"       // Tipe token
}
```

#### **2. PAYLOAD** (Data User)
```json
{
  "sub": "123e4567-e89b-12d3-a456-426614174000",  // User ID
  "email": "student@mail.com",
  "role": "student",
  "iat": 1735909200,  // Issued At: kapan dibuat
  "exp": 1735912800   // Expiry: kapan expired (1 jam)
}
```

#### **3. SIGNATURE** (Tanda Tangan Digital)
```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key_dari_supabase  // Rahasia hanya server yang tahu
)
```

**Keamanan:**
- Token tidak bisa dipalsukan karena signature di-generate dengan `secret_key`
- Jika payload diubah sedikit → signature tidak cocok → ditolak server
- Decode JWT Anda sendiri di: https://jwt.io

### Access Token & Refresh Token

#### **Masalah JWT:**
- Token tidak bisa di-revoke sebelum expired
- Jika token dicuri, hacker bisa pakai sampai expired

#### **Solusi: Dual Token System**

| Token Type | Expiry | Kegunaan | Storage |
|------------|--------|----------|---------|
| **Access Token** | 1 jam | Request API sehari-hari | Memory/Storage |
| **Refresh Token** | 7-30 hari | Perpanjang access token | Secure Storage |

```
┌────────────────────────────────────────────────────────┐
│           ACCESS TOKEN + REFRESH TOKEN                 │
└────────────────────────────────────────────────────────┘

Login → Dapat 2 token:
{
  "access_token": "eyJhbGci...",   // Valid 1 jam
  "refresh_token": "eyJhbGci..."   // Valid 30 hari
}

Timeline:
13:00 → Login, dapat access_token (valid hingga 14:00)
13:30 → Request API dengan access_token ✅ Success
14:00 → access_token EXPIRED!
14:01 → Request API dengan access_token ❌ 401 Unauthorized
14:01 → POST /auth/refresh dengan refresh_token
14:01 → Dapat access_token BARU (valid hingga 15:00)
14:02 → Request API dengan access_token baru ✅ Success
```

**Keuntungan:**
- Access token pendek → jika dicuri, cuma valid 1 jam
- Refresh token bisa di-revoke dari database
- User tidak perlu login ulang setiap jam

### Alur Penggunaan JWT

#### **1. Login & Mendapatkan Token:**

```
User                    API                     Supabase
 📱                      🖥️                       🗄️
 │                       │                        │
 │ POST /auth/login      │                        │
 │ {email, password}     │                        │
 ├──────────────────────►│                        │
 │                       │ Verify credentials     │
 │                       ├───────────────────────►│
 │                       │                        │
 │                       │ User valid ✓           │
 │                       │◄───────────────────────┤
 │                       │                        │
 │                       │ Generate JWT:          │
 │                       │ {                      │
 │                       │   sub: user_id,        │
 │                       │   role: student,       │
 │                       │   exp: now + 1h        │
 │                       │ }                      │
 │                       │ Sign dengan secret_key │
 │                       │                        │
 │ Return tokens:        │                        │
 │ {                     │                        │
 │   access_token: "...", │                       │
 │   refresh_token: "..." │                       │
 │ }                     │                        │
 │◄──────────────────────┤                        │
 │                       │                        │
 │ Save to secure        │                        │
 │ storage (FlutterSS)   │                        │
```

#### **2. Menggunakan Token untuk Request:**

```
Mobile App              API                     Database
 📱                      🖥️                       🗄️
 │                       │                        │
 │ GET /student/profile  │                        │
 │ Header:               │                        │
 │ Authorization:        │                        │
 │ Bearer eyJhbGci...    │                        │
 ├──────────────────────►│                        │
 │                       │ Extract token          │
 │                       │ Verify signature ✓     │
 │                       │ Check expiry ✓         │
 │                       │ Decode payload:        │
 │                       │   user_id = "123"      │
 │                       │   role = "student"     │
 │                       │                        │
 │                       │ Query profile          │
 │                       │ WHERE id = "123"       │
 │                       ├───────────────────────►│
 │                       │                        │
 │                       │ Return data            │
 │                       │◄───────────────────────┤
 │                       │                        │
 │ Response: profile data│                        │
 │◄──────────────────────┤                        │
```

**Kenapa SynClass Pakai JWT?**
- ✅ Stateless (server tidak perlu simpan session)
- ✅ Scalable (mudah di-deploy ke serverless)
- ✅ Mobile-friendly (token disimpan di app)
- ✅ Industry standard (OAuth 2.0 compatible)
- ✅ Supabase built-in support

---

## 4. Apa itu Supabase?

### Definisi Supabase

**Supabase** adalah **Backend-as-a-Service (BaaS)** open-source yang menyediakan backend siap pakai untuk aplikasi modern. Supabase sering disebut **"Firebase Alternative"** karena fungsinya mirip tapi open-source.

**Supabase = Backend Lengkap Tanpa Coding Backend**

### Apa yang Disediakan Supabase?

```
┌────────────────────────────────────────────────────┐
│             SUPABASE = PAKET LENGKAP               │
├────────────────────────────────────────────────────┤
│                                                    │
│  1️⃣  PostgreSQL Database                           │
│     └─ Relational database dengan RLS             │
│     └─ Auto-generated API                         │
│                                                    │
│  2️⃣  Authentication & Authorization                │
│     └─ JWT token management                       │
│     └─ Email/password, OAuth, Magic links         │
│     └─ User management                            │
│                                                    │
│  3️⃣  Auto-generated REST API                       │
│     └─ Instant API dari database schema           │
│     └─ Realtime subscriptions                     │
│                                                    │
│  4️⃣  Storage                                       │
│     └─ File upload (images, PDFs, etc)            │
│     └─ CDN integration                            │
│                                                    │
│  5️⃣  Row Level Security (RLS)                      │
│     └─ Database-level security                    │
│     └─ Per-row permissions                        │
│                                                    │
│  6️⃣  Dashboard & Tools                             │
│     └─ Database editor                            │
│     └─ SQL editor                                 │
│     └─ API logs & analytics                       │
│                                                    │
│  7️⃣  Hosting & Deployment                          │
│     └─ Free tier (500MB database)                 │
│     └─ Auto-scaling                               │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Supabase Keys

Supabase menyediakan **2 jenis keys** dengan fungsi berbeda:

#### **1. NEXT_PUBLIC_SUPABASE_ANON_KEY** (Public Key)

```javascript
// ✅ AMAN untuk di-expose ke client (browser/mobile)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // Public key
)

// Digunakan untuk:
await supabase.auth.signInWithPassword({...})  // Login
await supabase.from('profiles').select('*')    // Query dengan RLS
```

**Karakteristik:**
- ✅ **Safe** di client-side (browser, mobile app)
- ✅ **Protected by RLS** - User hanya bisa akses data sesuai policy
- ✅ **Authentication** - Untuk login & user operations
- ❌ **Tidak bisa bypass RLS**

**Contoh RLS Protection:**
```sql
-- Policy di tabel profiles
CREATE POLICY "Users can only see their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Mahasiswa A (id=001) query:
SELECT * FROM profiles;

-- RLS auto-filter:
-- Result: Hanya profile dengan id=001 (milik Mahasiswa A)
```

#### **2. SUPABASE_SERVICE_ROLE_KEY** (Admin Key)

```javascript
// ⚠️ RAHASIA! Hanya untuk server-side!
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Admin key - NEVER expose!
)

// Digunakan untuk:
await adminClient.auth.admin.createUser({...})  // Create user (admin only)
await adminClient.from('profiles').select('*')   // Query BYPASS RLS!
```

**Karakteristik:**
- ⚠️ **DANGEROUS** - Bypass semua RLS policies
- ❌ **NEVER** di client-side
- ✅ **Server-side only** - API routes, cron jobs
- ✅ **Admin operations** - Create/delete users, bulk operations

**Perbandingan:**

| Operasi | ANON_KEY | SERVICE_ROLE_KEY |
|---------|----------|------------------|
| Login user | ✅ | ✅ |
| Query dengan RLS | ✅ (filtered) | ✅ (bypass RLS) |
| Create user via admin | ❌ | ✅ |
| Update user password | ❌ | ✅ |
| Bulk delete | ❌ | ✅ |
| Client-side usage | ✅ SAFE | ❌ NEVER! |

### Supabase vs Firebase

| Aspek | Supabase | Firebase |
|-------|----------|----------|
| **Database** | PostgreSQL (SQL) | Firestore (NoSQL) |
| **Open Source** | ✅ Yes | ❌ No (proprietary) |
| **Self-hostable** | ✅ Yes | ❌ No |
| **RLS** | ✅ Built-in | ❌ Security rules |
| **Realtime** | ✅ PostgreSQL subscriptions | ✅ Firestore listeners |
| **Auth** | ✅ JWT-based | ✅ JWT-based |
| **Pricing** | Free tier: 500MB | Free tier: 1GB |
| **Vendor lock-in** | ❌ No (open-source) | ⚠️ Yes (Google) |
| **SQL Support** | ✅ Full SQL | ❌ No SQL |

### Kenapa Pakai Supabase?

**Untuk SynClass:**

1. ✅ **PostgreSQL** - Database relational yang powerful
2. ✅ **RLS** - Keamanan database level untuk multi-user
3. ✅ **JWT Auth** - Built-in authentication dengan token
4. ✅ **Auto API** - Database langsung jadi REST API
5. ✅ **Free Tier** - Gratis untuk development
6. ✅ **Dashboard** - UI untuk manage database
7. ✅ **Open Source** - Tidak tergantung vendor

---

## 5. Apa itu PostgreSQL?

**PostgreSQL** adalah **database relational** open-source yang powerful, sering disebut sebagai "database paling advanced di dunia".

### PostgreSQL vs MySQL

| Aspek | PostgreSQL 🐘 | MySQL 🐬 |
|-------|--------------|----------|
| **Tipe** | Object-Relational | Relational |
| **Kompleksitas** | Advanced | Sederhana |
| **Fitur** | Lengkap (JSON, Array, RLS) | Standard |
| **ACID** | ✅ Full compliance | ⚠️ Tergantung engine |
| **RLS** | ✅ Built-in | ❌ Tidak ada |
| **JSON Support** | ✅ Native (JSONB) | ⚠️ Terbatas |
| **Array Type** | ✅ Ada | ❌ Tidak ada |
| **Security** | ✅ Sangat ketat | ✅ Standard |
| **Performance** | Excellent (complex queries) | Faster (simple queries) |
| **Open Source** | ✅ Sepenuhnya | ⚠️ Owned by Oracle |
| **Best For** | Complex apps, big data | Simple websites |

**Analogi:**
```
PostgreSQL = SUV (besar, kuat, banyak fitur, cocok medan berat)
MySQL = Sedan (ringan, cepat, sederhana, cocok jalan mulus)
```

### Hubungan dengan Supabase

```
┌───────────────────────────────────────┐
│         SUPABASE (Wrapper)            │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  Dashboard & UI                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  Authentication (JWT)           │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  Auto-generated API             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  Storage & Realtime             │  │
│  └─────────────────────────────────┘  │
│                                       │
│         ↓ MENGGUNAKAN ↓              │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │   PostgreSQL Database           │  │
│  │   (Core Engine)                 │  │
│  │   • Tables                      │  │
│  │   • RLS Policies                │  │
│  │   • Functions & Triggers        │  │
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

**Kesimpulan:**
- **PostgreSQL** = Mesin database (inti)
- **Supabase** = "Bungkus" di atas PostgreSQL dengan fitur tambahan

### Hubungan dengan AWS

**TIDAK ADA hubungan langsung!**

PostgreSQL adalah software open-source yang bisa di-install di:
- ✅ AWS RDS (Amazon cloud)
- ✅ Google Cloud SQL
- ✅ Azure Database
- ✅ Supabase Cloud ← **SynClass pakai ini**
- ✅ Self-hosted (server sendiri)

**Supabase sudah include hosting**, jadi tidak perlu AWS!

---

## 6. Apa itu Row Level Security (RLS)?

### Definisi RLS

**RLS (Row Level Security)** adalah fitur keamanan di PostgreSQL yang mengatur **siapa boleh lihat/edit baris data mana** di tabel.

**RLS = Satpam Otomatis di Setiap Baris Data**

### Analogi Sederhana

Bayangkan database seperti **lemari arsip**:

```
┌─────────────────────────────────────────────┐
│         LEMARI ARSIP (Database)             │
├─────────────────────────────────────────────┤
│                                             │
│  📁 Folder Mahasiswa A (Budi)               │
│     - KRS Budi                              │
│     - Nilai Budi                            │
│                                             │
│  📁 Folder Mahasiswa B (Siti)               │
│     - KRS Siti                              │
│     - Nilai Siti                            │
│                                             │
│  📁 Folder Mahasiswa C (Andi)               │
│     - KRS Andi                              │
│     - Nilai Andi                            │
│                                             │
└─────────────────────────────────────────────┘

TANPA RLS:
Budi login → bisa baca SEMUA folder ❌ BAHAYA!

DENGAN RLS:
Budi login → hanya bisa baca folder Budi ✅ AMAN!
```

### RLS vs Role Verification

| Aspek | Role Verification | RLS |
|-------|------------------|-----|
| **Level** | Application (Code) | Database |
| **Scope** | BESAR (mahasiswa vs dosen) | KECIL (mahasiswa A vs B) |
| **Implementasi** | Manual di code | Auto oleh database |
| **Bypass** | Bisa lupa validasi | Tidak bisa bypass |

**Analogi Sekolah:**

```
Role Verification (Pintu Gedung):
- Mahasiswa → masuk gedung mahasiswa
- Dosen → masuk gedung dosen

RLS (Pintu Loker di Dalam Gedung):
- Mahasiswa A → hanya buka loker A
- Mahasiswa B → hanya buka loker B
```

**Di Code:**

```typescript
// Role Verification (CHECK BESAR)
if (user.role !== 'student') {
  return Response.status(403).json({ error: 'Forbidden' })
}

// RLS (CHECK KECIL - di database otomatis)
SELECT * FROM krs_pengajuan WHERE user_id = auth.uid()
// ↑ RLS auto-filter: mahasiswa A hanya lihat KRS miliknya
```

### Contoh RLS Policy

#### **Policy 1: Mahasiswa Hanya Lihat Data Sendiri**

```sql
-- Tabel: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see only own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);
-- ↑ Artinya: User hanya bisa SELECT baris yang id-nya = user_id mereka
```

**Test:**
```sql
-- Mahasiswa Budi (id=001) login dan query:
SELECT * FROM profiles;

-- RLS auto-filter jadi:
SELECT * FROM profiles WHERE id = '001';

-- Result: Hanya profile Budi
```

#### **Policy 2: Mahasiswa Lihat KRS Sendiri, Kaprodi Lihat Semua**

```sql
CREATE POLICY "KRS access by role"
ON krs_pengajuan
FOR SELECT
USING (
  auth.uid() = mahasiswa_id  -- Mahasiswa lihat milik sendiri
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'kaprodi'  -- Kaprodi lihat semua
);
```

**Test:**
```
┌─────────────────────────────────────────────┐
│  Tabel: krs_pengajuan                       │
├──────┬──────────────┬──────────┬───────────┤
│ id   │ mahasiswa_id │ semester │ status    │
├──────┼──────────────┼──────────┼───────────┤
│ 001  │ budi-id      │ 2024-1   │ pending   │
│ 002  │ siti-id      │ 2024-1   │ approved  │
│ 003  │ andi-id      │ 2024-1   │ pending   │
└──────┴──────────────┴──────────┴───────────┘

Budi login (role=student):
  SELECT * FROM krs_pengajuan
  Result: Hanya row 001 ✅

Kaprodi login (role=kaprodi):
  SELECT * FROM krs_pengajuan
  Result: SEMUA rows (001, 002, 003) ✅
```

### Keuntungan RLS

| Tanpa RLS | Dengan RLS |
|:---------:|:----------:|
| ❌ Mahasiswa bisa lihat nilai orang lain | ✅ Mahasiswa hanya lihat nilai sendiri |
| ❌ Harus validasi manual di code | ✅ Database auto-filter |
| ❌ Rawan bug jika lupa | ✅ Keamanan terjamin |
| ❌ Mudah di-hack | ✅ Aman dari SQL injection |

**RLS = Firewall di Level Database!**

---

# 🏗 BAGIAN II: ARSITEKTUR SISTEM

## 7. Arsitektur SynClass

### Diagram Arsitektur Lengkap

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
│                     CLIENT LAYER (Multi-Platform)                   │
│                                                                       │
│  ┌──────────────────────┐           ┌──────────────────────┐         │
│  │   Web Application    │           │   Mobile App         │         │
│  │  (Next.js Frontend)  │           │  (Flutter/React)     │         │
│  │   React 19 + TS      │           │   Native Mobile      │         │
│  │   Tailwind CSS 4.x   │           │   REST API Client    │         │
│  └──────────┬───────────┘           └──────────┬───────────┘         │
│             │                                  │                     │
│             │ Supabase Client                  │ HTTP/HTTPS          │
│             │ (Auth + Database Sync)           │ JWT Token           │
│             │                                  │                     │
└─────────────┼──────────────────────────────────┼─────────────────────┘
              │                                  │
              │                                  │
    ┌─────────▼──────────────────────────────────▼──────────┐
    │            API LAYER (Next.js Backend)                │
    │                                                        │
    │  ┌──────────────────┐     ┌───────────────────────┐   │
    │  │  Web Pages/SSR   │     │  Mobile API Gateway   │   │
    │  │  (Server Comp.)  │     │  /api/mobile/*        │   │
    │  └──────────────────┘     │  18+ REST Endpoints   │   │
    │                           │  JWT Authentication    │   │
    │                           └───────────────────────┘   │
    └────────────────────────────────┬──────────────────────┘
                                     │
                         HTTPS/WebSocket
                                     │
┌────────────────────────────────────▼─────────────────────────────────┐
│                   SERVER LAYER (Supabase Cloud)                      │
│                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Authentication     │  │   PostgreSQL        │                   │
│  │  (JWT + Session)    │  │   Database          │                   │
│  │  • Email/Password   │  │   • 10+ Tables      │                   │
│  │  • Token Refresh    │  │   • RLS Policies    │                   │
│  │  • Role Management  │  │   • Relationships   │                   │
│  └─────────────────────┘  └─────────┬───────────┘                   │
│                                     │                                │
│                   ┌─────────────────┼─────────────────┐              │
│                   │                 │                 │              │
│        ┌──────────▼──────┐  ┌───────▼──────┐  ┌──────▼──────────┐   │
│        │ profiles        │  │ matakuliah   │  │ krs_pengajuan   │   │
│        │ (User Data)     │  │ (Courses)    │  │ (KRS Requests)  │   │
│        └─────────────────┘  └──────────────┘  └─────────────────┘   │
│                                                                       │
│   ┌──────────────┐  ┌─────────────┐  ┌──────────────┐                │
│   │ presensi_    │  │ post        │  │ tugas_       │                │
│   │ session      │  │ (Materials) │  │ submission   │                │
│   │ (Attendance) │  └─────────────┘  │ (Assignments)│                │
│   └──────────────┘                   └──────────────┘                │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Penjelasan Alur:**

**Web Application:**
1. **Client** → User berinteraksi dengan UI Next.js
2. **Supabase Client** → Mengirim request ke backend (Auth & Database)
3. **Server** → Memproses request, validasi, dan mengelola data
4. **Database** → Menyimpan semua data dengan keamanan RLS

**Mobile Application:**
1. **Mobile Client** → Flutter/React Native app
2. **HTTP Request** → REST API call ke `/api/mobile/*`
3. **API Gateway** → Validasi JWT token & role verification
4. **Database** → Query data dengan RLS policy
5. **JSON Response** → Return data ke mobile client

**Key Features:**
- ✅ Multi-platform support (Web + Mobile)
- ✅ Unified authentication system
- ✅ RESTful API architecture
- ✅ Real-time data synchronization
- ✅ Secure token-based auth



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

### Backend & API

- **REST API**: 18+ endpoints untuk mobile integration
- **Authentication**: JWT-based via Supabase Auth
- **Database**: PostgreSQL dengan Row Level Security (RLS)
- **Real-time**: WebSocket support untuk live updates
- **API Format**: Standard JSON response dengan error handling

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

### Mobile Support

- **API Gateway**: REST API untuk Flutter/React Native
- **Authentication**: JWT token-based auth
- **CORS**: Enabled untuk cross-origin requests
- **Documentation**: Comprehensive API docs dengan examples
- **Testing**: Postman collection included

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

## � Mobile API

SynClass menyediakan **REST API Gateway** yang lengkap untuk aplikasi mobile (Flutter/React Native). API ini dirancang khusus untuk role **Student** dengan fitur authentication, academic management, dan real-time data sync.

### 🎯 Fitur Mobile API

| Kategori | Endpoints | Keterangan |
| :---: | :---: | :---: |
| **Authentication** | 3 endpoints | Login, Refresh, Logout |
| **Profile** | 2 endpoints | Get & Update profile |
| **Academic** | 8 endpoints | KRS, Classes, Grades, Materials |
| **Attendance** | 2 endpoints | View & Submit presensi |
| **Assignments** | 3 endpoints | View, Submit, Track tugas |

**Total: 18+ REST API Endpoints** 🚀

---

### 🔐 Authentication Flow

API menggunakan **JWT-based authentication** via Supabase Auth:

```
┌────────────────────────────────────────────────────────────────┐
│               MOBILE APP AUTHENTICATION FLOW                   │
└────────────────────────────────────────────────────────────────┘

  Mobile App         Login API       Supabase Auth      Database
      📱               🔓              🔐                 🗄️
      │                │               │                  │
      │ 1. POST        │               │                  │
      │ /auth/login    │               │                  │
      ├───────────────►│               │                  │
      │ email+password │               │                  │
      │                │ 2. Validate   │                  │
      │                ├──────────────►│                  │
      │                │               │ 3. Check user    │
      │                │               ├─────────────────►│
      │                │               │◄─────────────────┤
      │                │               │                  │
      │                │ 4. Return JWT │                  │
      │                │◄──────────────┤                  │
      │                │               │                  │
      │ 5. Response:   │               │                  │
      │ • access_token │               │                  │
      │ • refresh_token│               │                  │
      │ • user data    │               │                  │
      │◄───────────────┤               │                  │
      │                │               │                  │
      │ 6. Save tokens │               │                  │
      │ to storage     │               │                  │
      │                │               │                  │
      │ 7. Use token   │               │                  │
      │ for protected  │               │                  │
      │ endpoints      │               │                  │
      │                │               │                  │

✅ Security Features:
  • JWT Token (1 hour expiry)
  • Refresh Token (untuk renew)
  • Role verification (Student only)
  • Secure HTTPS communication
```

---

### 📋 Daftar Lengkap API Endpoints

#### 🔓 Public Endpoints (No Auth Required)

| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| POST | `/api/mobile/auth/login` | Login dengan email & password |
| POST | `/api/mobile/auth/refresh` | Refresh access token |
| POST | `/api/mobile/auth/logout` | Logout & clear session |

#### 🔐 Protected Endpoints (Require JWT Token)

**Profile Management:**
| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| GET | `/api/mobile/student/profile` | Get student profile data |
| PUT | `/api/mobile/student/profile` | Update profile information |

**Academic Data:**
| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| GET | `/api/mobile/student/classes` | Get enrolled classes list |
| GET | `/api/mobile/student/classes/[id]` | Get class detail |
| GET | `/api/mobile/student/matakuliah` | Get available courses |
| GET | `/api/mobile/student/grades` | Get grades & KHS |
| GET | `/api/mobile/student/materials` | Get course materials |

**KRS (Course Registration):**
| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| GET | `/api/mobile/student/krs` | Get KRS submissions |
| POST | `/api/mobile/student/krs` | Submit new KRS |

**Attendance (Presensi):**
| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| GET | `/api/mobile/student/attendance` | Get attendance history |
| GET | `/api/mobile/student/presensi-sessions` | Get active sessions |

**Assignments (Tugas):**
| Method | Endpoint | Deskripsi |
| :---: | :---: | :--- |
| GET | `/api/mobile/student/assignments` | Get assignment list |
| POST | `/api/mobile/student/assignments/[id]/submit` | Submit assignment |

---

### 🚀 Quick Start - Mobile API

#### 1. Login Request Example

**Request:**
```bash
POST https://your-domain.com/api/mobile/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "student@example.com",
      "username": "student_001",
      "full_name": "John Doe",
      "role": "student",
      "nim": "123456789",
      "jurusan": "Informatika"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "refresh_token_here",
      "expires_in": 3600,
      "token_type": "Bearer"
    }
  },
  "message": "Login successful"
}
```

---

#### 2. Protected Endpoint Example

**Request:**
```bash
GET https://your-domain.com/api/mobile/student/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "student@example.com",
    "username": "student_001",
    "full_name": "John Doe",
    "nim": "123456789",
    "jurusan": "Informatika",
    "fakultas": "Teknik",
    "angkatan": "2022",
    "avatar_url": null
  },
  "message": "Profile fetched successfully"
}
```

---

### 📱 Flutter Implementation Example

#### Setup HTTP Client
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'https://your-domain.com/api/mobile';
  String? _accessToken;

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    
    if (data['success']) {
      _accessToken = data['data']['session']['access_token'];
      // Save token to secure storage
      await _saveToken(_accessToken!);
    }
    
    return data;
  }

  // Get Profile
  Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/profile'),
      headers: {
        'Authorization': 'Bearer $_accessToken',
      },
    );

    return jsonDecode(response.body);
  }

  // Get Classes
  Future<Map<String, dynamic>> getClasses() async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/classes'),
      headers: {
        'Authorization': 'Bearer $_accessToken',
      },
    );

    return jsonDecode(response.body);
  }
}
```

#### Error Handling
```dart
Future<void> handleApiCall() async {
  try {
    final response = await apiService.getProfile();
    
    if (response['success']) {
      // Handle success
      final userData = response['data'];
      print('User: ${userData['full_name']}');
    } else {
      // Handle API error
      print('Error: ${response['error']}');
      
      // Check error code
      if (response['code'] == 'TOKEN_EXPIRED') {
        // Refresh token
        await refreshToken();
      }
    }
  } catch (e) {
    // Handle network error
    print('Network error: $e');
  }
}
```

---

### 🔒 Security & Authorization

**Token Management:**
- Access Token expires in **1 hour**
- Refresh Token untuk renew session
- Automatic logout setelah token expired
- Secure storage untuk token (flutter_secure_storage)

**Role Verification:**
- Semua `/student/*` endpoints hanya untuk role **student**
- Request dari role lain akan ditolak (403 Forbidden)
- Token validation di setiap protected endpoint

**Error Codes:**
```json
{
  "INVALID_CREDENTIALS": "Email atau password salah",
  "TOKEN_EXPIRED": "Token sudah kadaluarsa, refresh token",
  "TOKEN_INVALID": "Token tidak valid",
  "ROLE_NOT_STUDENT": "Akses ditolak, hanya untuk student",
  "ACCESS_DENIED": "Tidak punya akses ke resource ini",
  "VALIDATION_ERROR": "Data input tidak valid",
  "SERVER_ERROR": "Internal server error"
}
```

---

### 📊 Response Format Standard

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "uuid"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* error details */ }
}
```

---

### 🧪 Testing Mobile API

#### Local Testing (Development)
```bash
# Start dev server
npm run dev

# Test login endpoint
curl -X POST http://localhost:3000/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password"}'

# Test protected endpoint
curl -X GET http://localhost:3000/api/mobile/student/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Postman Collection
Import `postman-collection.json` untuk testing lengkap semua endpoints.

**Collection includes:**
- ✅ All 18+ endpoints
- ✅ Pre-request scripts untuk token management
- ✅ Environment variables
- ✅ Test assertions

---

### 🌐 Production Deployment

API sudah production-ready dan dapat di-deploy ke:

**Recommended Platforms:**
- ✅ **Vercel** (Recommended) - Zero config deployment
- ✅ **Netlify** - Easy deployment dengan CLI
- ✅ **Railway** - Full stack hosting
- ✅ **AWS/GCP/Azure** - Enterprise deployment

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Deployment Steps (Vercel):**
1. Push code ke Git repository
2. Import project di Vercel dashboard
3. Add environment variables
4. Click Deploy
5. API live di `https://your-project.vercel.app/api/mobile`

---

### 📚 Full API Documentation

Dokumentasi lengkap tersedia di:
- **Mobile API README**: [app/api/mobile/README.md](app/api/mobile/README.md)
- **Deployment Guide**: [MOBILE_API_DEPLOYMENT.md](MOBILE_API_DEPLOYMENT.md)
- **Setup Complete**: [MOBILE_API_SETUP_COMPLETE.md](MOBILE_API_SETUP_COMPLETE.md)
- **Postman Collection**: [postman-collection.json](postman-collection.json)

**Fitur Dokumentasi:**
- Request/Response examples untuk setiap endpoint
- Error handling & codes
- Flutter/React Native implementation guides
- Authentication flow diagrams
- Rate limiting & best practices

---

## 📁 Struktur Proyek

```
SynClass/
├── app/                          # App Router (Next.js)
│   ├── api/
│   │   ├── admin/
│   │   │   └── create-user/
│   │   │       └── route.ts     # Admin API untuk create user
│   │   └── mobile/              # 📱 Mobile API Gateway
│   │       ├── auth/            # Authentication endpoints
│   │       │   ├── login/route.ts
│   │       │   ├── refresh/route.ts
│   │       │   └── logout/route.ts
│   │       ├── student/         # Protected student endpoints
│   │       │   ├── profile/route.ts
│   │       │   ├── classes/route.ts
│   │       │   ├── krs/route.ts
│   │       │   ├── attendance/route.ts
│   │       │   ├── assignments/route.ts
│   │       │   ├── materials/route.ts
│   │       │   ├── grades/route.ts
│   │       │   └── matakuliah/route.ts
│   │       ├── lib/
│   │       │   └── auth.ts      # Auth utilities & helpers
│   │       └── README.md        # Mobile API documentation
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

### 📱 FAQ Mobile API

**Q: Apakah Mobile API sudah production-ready?**
A: Ya! Mobile API sudah siap untuk production dengan 18+ endpoints, JWT authentication, dan comprehensive error handling.

**Q: Platform mobile apa yang didukung?**
A: API mendukung semua platform yang bisa melakukan HTTP requests: Flutter (Android/iOS), React Native, Ionic, native Android/iOS.

**Q: Bagaimana cara mendapatkan access token?**
A: Login via POST `/api/mobile/auth/login` dengan email & password. Response akan berisi `access_token` dan `refresh_token`.

**Q: Berapa lama token valid?**
A: Access token valid selama 1 jam. Gunakan refresh token untuk mendapatkan access token baru tanpa login ulang.

**Q: Apa yang terjadi jika token expired?**
A: API akan return error 401 dengan code `TOKEN_EXPIRED`. Gunakan endpoint `/auth/refresh` dengan refresh_token untuk mendapatkan access token baru.

**Q: Apakah semua role bisa akses Mobile API?**
A: Saat ini Mobile API hanya untuk role **Student**. Request dari role dosen/kaprodi akan ditolak dengan error 403.

**Q: Bagaimana cara test Mobile API?**
A: Gunakan Postman collection yang disediakan (`postman-collection.json`) atau curl command untuk testing cepat.

**Q: Apakah ada rate limiting?**
A: Saat ini belum ada rate limiting. Akan ditambahkan di future update untuk mencegah abuse.

**Q: Format response API seperti apa?**
A: Standard JSON format dengan struktur: `{success: boolean, data: object, message: string}` untuk success dan `{success: false, error: string, code: string}` untuk error.

**Q: Bagaimana cara handle file upload (untuk submit tugas)?**
A: Upload file ke storage terlebih dahulu (Supabase Storage atau cloud storage lain), lalu kirim URL-nya via API.

**Q: Apakah API support real-time updates?**
A: Untuk real-time, gunakan Supabase Realtime subscription di client-side. API REST ini untuk data fetching & mutations.

**Q: Di mana dokumentasi lengkap Mobile API?**
A: Lihat file berikut:
- `/app/api/mobile/README.md` - Full API documentation
- `MOBILE_API_DEPLOYMENT.md` - Deployment guide
- `MOBILE_API_SETUP_COMPLETE.md` - Setup overview
- `postman-collection.json` - Import ke Postman

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

### ✅ Fitur yang Sudah Tersedia

- ✅ **Mobile API Gateway** - 18+ REST API endpoints untuk mobile app
- ✅ **JWT Authentication** - Secure token-based auth via Supabase
- ✅ **Student Portal API** - Full academic features untuk mobile
- ✅ **Real-time Data Sync** - PostgreSQL dengan RLS
- ✅ **Production Ready** - Dapat langsung di-deploy ke Vercel/Netlify

### Fitur yang Akan Datang (Roadmap)

- 📱 **Flutter Mobile App** - Native Android app dengan UI Material Design
- 🍎 **iOS Support** - Cross-platform mobile app
- 📱 **Biometric Login** - Fingerprint & Face ID authentication
- 📧 **Email Digest** - Notifikasi weekly dengan summary
- 📊 **Advanced Analytics** - Dashboard insights akademik
- 🔔 **Real-time Push Notification** - FCM untuk mobile notifications
- 🗂️ **Document Management** - Upload file tugas & materi
- 🤖 **AI Grade Prediction** - Machine learning untuk prediksi nilai
- 🌍 **Multi-language Support** - Indonesian, English, Mandarin
- 📅 **Academic Calendar Integration** - Sinkronisasi kalender akademik
- 📈 **Performance Analytics** - Analytics untuk dosen & mahasiswa
- 🎓 **Diploma Generation** - Auto-generate ijazah saat lulus
- 🎯 **Mobile Attendance** - QR Code scanner untuk presensi
- 💬 **In-app Chat** - Real-time messaging dosen-mahasiswa

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
- 📱 **Mobile API Support**: Lihat dokumentasi di `/app/api/mobile/README.md`

---

## 👨‍💻 Untuk Mobile Developers

### Quick Start Mobile Integration

**Base URL API:**
```
Development: http://localhost:3000/api/mobile
Production:  https://your-domain.vercel.app/api/mobile
```

**Langkah Integrasi:**

1. **Setup HTTP Client** di Flutter/React Native
   ```dart
   // Contoh menggunakan http package
   import 'package:http/http.dart' as http;
   ```

2. **Implement Authentication**
   - POST `/auth/login` untuk login
   - Simpan `access_token` & `refresh_token` di secure storage
   - Gunakan token di header semua protected endpoints

3. **Use Protected Endpoints**
   ```dart
   headers: {
     'Authorization': 'Bearer $accessToken',
     'Content-Type': 'application/json',
   }
   ```

4. **Handle Token Refresh**
   - Detect 401 Unauthorized response
   - Call `/auth/refresh` dengan refresh_token
   - Update access_token & retry request

**Resources untuk Mobile Devs:**
- 📖 **Full API Docs**: [app/api/mobile/README.md](app/api/mobile/README.md)
- 🚀 **Deployment Guide**: [MOBILE_API_DEPLOYMENT.md](MOBILE_API_DEPLOYMENT.md)
- ✅ **Setup Complete**: [MOBILE_API_SETUP_COMPLETE.md](MOBILE_API_SETUP_COMPLETE.md)
- 📮 **Postman Collection**: [postman-collection.json](postman-collection.json)
- 💻 **Code Examples**: Flutter & React Native snippets tersedia di docs

**Key Features untuk Mobile:**
- ✅ 18+ REST API endpoints
- ✅ JWT-based authentication
- ✅ Role verification (Student only)
- ✅ Real-time data from PostgreSQL
- ✅ Comprehensive error handling
- ✅ Standard JSON response format
- ✅ CORS enabled untuk cross-origin requests

**Testing:**
```bash
# Test login
curl -X POST https://your-api.com/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"pass"}'

# Test protected endpoint
curl -X GET https://your-api.com/api/mobile/student/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

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
