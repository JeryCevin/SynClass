# 🎓 SynClass - Sistem Informasi Akademik Modern

<div align="center">

**Web Service RESTful untuk Manajemen Akademik Perguruan Tinggi**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

[Demo](https://synclass.vercel.app) • [Dokumentasi](#-dokumentasi) • [API Docs](./MOBILE_INTEGRATION_GUIDE.md) • [Arsitektur](./ARCHITECTURE.md)

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

## 🚀 Quick Start

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

## 📚 Dokumentasi

### 📖 **Untuk Pemula** (Pahami Konsep Dasar)

Jika Anda masih awam dengan konsep web service, REST API, JWT, atau database, **mulai dari sini:**

#### 🎓 Tutorial Konsep Dasar
| Topik | Link | Apa yang Dipelajari |
|-------|------|---------------------|
| **1. Web Service** | [Baca →](./ARCHITECTURE.md#1-apa-itu-web-service) | Apa itu web service, SynClass sebagai web service, arsitektur client-server |
| **2. REST API** | [Baca →](./ARCHITECTURE.md#2-apa-itu-rest-api) | Prinsip REST, HTTP methods, contoh request/response |
| **3. JWT Token** | [Baca →](./ARCHITECTURE.md#3-apa-itu-jwt-token) | JWT vs Session, struktur token, access & refresh token |
| **4. Supabase** | [Baca →](./ARCHITECTURE.md#4-apa-itu-supabase) | Backend-as-a-Service, ANON vs SERVICE_ROLE key |
| **5. PostgreSQL** | [Baca →](./ARCHITECTURE.md#5-apa-itu-postgresql) | PostgreSQL vs MySQL, hubungan dengan Supabase |
| **6. Row Level Security** | [Baca →](./ARCHITECTURE.md#6-apa-itu-row-level-security-rls) | RLS policies, keamanan database level |

**Visualisasi & Diagram:**
- ✅ Diagram arsitektur lengkap dengan penjelasan
- ✅ Flow diagram login hingga mendapatkan data
- ✅ Comparison tables (JWT vs Session, PostgreSQL vs MySQL, dll)
- ✅ Analogi sederhana untuk setiap konsep

---

### 🏗️ **Arsitektur & Design**

Pahami bagaimana SynClass dibangun dari ground-up:

| Dokumen | Konten |
|---------|--------|
| **[Arsitektur Lengkap](./ARCHITECTURE.md)** | Diagram arsitektur layer-by-layer, data flow, security layers |
| **[Database Schema](./ARCHITECTURE.md#database-schema)** | ERD, relational diagram, foreign keys |
| **[API Design Pattern](./ARCHITECTURE.md#api-design-pattern)** | RESTful best practices, response format, versioning |

**Highlights:**
- 📊 **Layer-by-Layer Explanation** - Dari deployment hingga database
- 🔐 **6 Lapisan Keamanan** - HTTPS, JWT, RBAC, RLS, validasi, constraints
- 🗄️ **Database ERD** - Relasi antar tabel dengan foreign keys
- 📡 **Data Flow Diagram** - Login → Get Data (complete flow)

---

### 📱 **Untuk Mobile Developers**

Integrasikan SynClass API ke aplikasi mobile Anda (Flutter/React Native):

| Dokumen | Konten |
|---------|--------|
| **[Mobile Integration Guide](./MOBILE_INTEGRATION_GUIDE.md)** | Complete guide untuk Flutter & React Native |
| **[API Endpoints Reference](./MOBILE_INTEGRATION_GUIDE.md#api-endpoints-reference)** | List lengkap 18+ endpoints dengan contoh |
| **[Authentication Flow](./MOBILE_INTEGRATION_GUIDE.md#authentication-flow)** | Login, refresh token, logout flow |

**Yang Anda Dapatkan:**
- ✅ **Flutter Code Examples** - Service class, auth service, UI examples
- ✅ **React Native Examples** - Axios setup, interceptors, components
- ✅ **Postman Collection** - Test API tanpa coding
- ✅ **Error Handling Guide** - Best practices & retry logic
- ✅ **Complete Examples** - Login screen, profile screen, classes list

#### Quick Example (Flutter):

```dart
// Login
final authService = AuthService();
final result = await authService.login(email, password);

if (result['success']) {
  // Navigate to home
  Navigator.pushReplacementNamed(context, '/home');
}

// Get Classes
final studentService = StudentService();
final classes = await studentService.getClasses();
```

#### Quick Example (React Native):

```javascript
// Login
import { login } from './services/authService';

const result = await login(email, password);
if (result.success) {
  navigation.replace('Home');
}

// Get Classes
import { getClasses } from './services/studentService';

const classes = await getClasses();
```

---

## ✨ Fitur Utama

### 🎭 Multi-Role System

SynClass mendukung 3 role dengan fitur berbeda:

#### 👨‍🎓 **Mahasiswa**
- ✅ Dashboard akademik (IPK, kehadiran, tugas)
- ✅ KRS (Kartu Rencana Studi) - ajukan & lihat status
- ✅ KHS (Kartu Hasil Studi) - nilai & transkrip
- ✅ Daftar kelas yang diambil
- ✅ Presensi (QR Code based)
- ✅ Tugas & pengumpulan
- ✅ Materi pembelajaran
- ✅ Profil & settings

#### 👨‍🏫 **Dosen**
- ✅ Dashboard mata kuliah
- ✅ Manajemen kelas & mahasiswa
- ✅ Buat session presensi (QR Code)
- ✅ Upload materi & tugas
- ✅ Penilaian & feedback
- ✅ Laporan kehadiran

#### 👑 **Kaprodi** (Kepala Program Studi)
- ✅ Dashboard monitoring akademik
- ✅ Approve/reject KRS mahasiswa
- ✅ Manajemen user (CRUD)
- ✅ Manajemen mata kuliah
- ✅ Statistik & laporan

---

## 🔐 Keamanan

SynClass menerapkan **6 lapisan keamanan**:

```
┌─────────────────────────────────────────────┐
│  1. HTTPS/TLS Encryption                    │
│     → Semua traffic terenkripsi             │
├─────────────────────────────────────────────┤
│  2. JWT Token Validation                    │
│     → Signature verification                │
├─────────────────────────────────────────────┤
│  3. Role-Based Access Control (RBAC)        │
│     → Student/Dosen/Kaprodi permissions     │
├─────────────────────────────────────────────┤
│  4. Row Level Security (RLS)                │
│     → Database-level filtering per user     │
├─────────────────────────────────────────────┤
│  5. Business Logic Validation               │
│     → Input validation & business rules     │
├─────────────────────────────────────────────┤
│  6. Database Constraints                    │
│     → FK, NOT NULL, UNIQUE constraints      │
└─────────────────────────────────────────────┘
```

### Public vs Protected Endpoints

| Type | Endpoints | Auth Required |
|------|-----------|---------------|
| **Public** | `/auth/login`, `/auth/refresh`, `/auth/logout` | ❌ |
| **Protected** | `/student/*`, `/dosen/*` | ✅ JWT Token + Role |
| **Admin** | `/admin/*` | ✅ SERVICE_ROLE_KEY |

**Contoh Protected Endpoint:**

```typescript
// app/api/mobile/student/profile/route.ts
export async function GET(request: NextRequest) {
  // 1. Verify JWT Token
  const tokenResult = await verifyToken(request);
  if (!tokenResult.success) {
    return errorResponse('Unauthorized', 'NO_TOKEN', 401);
  }
  
  // 2. Check Role = Student
  const roleResult = await checkStudentRole(tokenResult.userId!);
  if (!roleResult.success) {
    return errorResponse('Access denied', 'INVALID_ROLE', 403);
  }
  
  // 3. Query Database (RLS auto-filter)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', tokenResult.userId)
    .single();
  
  return successResponse(profile);
}
```

**RLS Policy Example:**

```sql
-- Mahasiswa hanya bisa lihat profile sendiri
CREATE POLICY "Students see only own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Mahasiswa lihat KRS sendiri, Kaprodi lihat semua
CREATE POLICY "KRS access by role"
ON krs_pengajuan FOR SELECT
USING (
  auth.uid() = mahasiswa_id OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'kaprodi'
);
```

---

## 🛠 Teknologi

### Frontend

| Tech | Version | Purpose |
|------|---------|---------|
| **Next.js** | 15.1 | React framework dengan SSR |
| **React** | 19 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.0 | Utility-first CSS |

### Backend

| Tech | Version | Purpose |
|------|---------|---------|
| **Next.js API Routes** | 15.1 | Serverless API |
| **Supabase** | Latest | Backend-as-a-Service |
| **PostgreSQL** | 15+ | Relational database |

### Authentication & Security

| Tech | Purpose |
|------|---------|
| **JWT** | Stateless authentication |
| **Supabase Auth** | User management |
| **RLS** | Database-level security |

### Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting (serverless) |
| **Supabase Cloud** | Database & Auth |

---

## 📁 Struktur Project

```
synclass/
├── app/
│   ├── api/
│   │   ├── admin/                 # Admin operations (SERVICE_ROLE_KEY)
│   │   │   └── create-user/
│   │   │       └── route.ts
│   │   └── mobile/                # Mobile API (JWT protected)
│   │       ├── README.md          # API documentation
│   │       ├── auth/              # Public endpoints
│   │       │   ├── login/route.ts
│   │       │   ├── refresh/route.ts
│   │       │   └── logout/route.ts
│   │       ├── student/           # Student endpoints (role=student)
│   │       │   ├── profile/route.ts
│   │       │   ├── classes/route.ts
│   │       │   ├── krs/route.ts
│   │       │   ├── grades/route.ts
│   │       │   ├── attendance/route.ts
│   │       │   ├── assignments/route.ts
│   │       │   └── materials/route.ts
│   │       └── lib/
│   │           └── auth.ts        # Auth helpers (verifyToken, etc)
│   ├── (pages)/                   # Web application pages
│   │   ├── page.tsx               # Dashboard (role-based)
│   │   ├── login/page.tsx
│   │   ├── profil/page.tsx
│   │   ├── list-kelas/page.tsx
│   │   ├── krs/page.tsx
│   │   ├── khs/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx                 # Root layout
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   └── DashboardStatCard.tsx
├── utils/
│   └── supabase/
│       └── client.ts              # Supabase client config
├── public/                         # Static assets
├── .env.local                     # Environment variables (gitignore)
├── .env.example                   # Template env vars
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── README.md                      # This file
├── ARCHITECTURE.md                # Architecture docs
├── MOBILE_INTEGRATION_GUIDE.md    # Mobile dev guide
└── postman-collection.json        # Postman API collection
```

---

## 🗄️ Database Schema

### Core Tables

```
auth.users (Supabase managed)
    │
    │ 1:1
    ▼
profiles (user data + role)
    │
    ├─── 1:N ──► krs_pengajuan ──► matakuliah
    ├─── 1:N ──► nilai
    ├─── 1:N ──► presensi_mahasiswa
    └─── 1:N ──► tugas_submission
                        │
                        │ N:1
                        ▼
                      post
                        │
                        │ N:1
                        ▼
                   matakuliah
                        │
                        ├─── 1:N ──► presensi_session
                        └─── 1:N ──► post
```

**Lihat ERD lengkap:** [Database Schema](./ARCHITECTURE.md#database-schema)

---

## 📡 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mobile/auth/login` | Login user |
| POST | `/api/mobile/auth/refresh` | Refresh access token |
| POST | `/api/mobile/auth/logout` | Logout user |

### Student Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mobile/student/profile` | Get user profile |
| PUT | `/api/mobile/student/profile` | Update profile |
| GET | `/api/mobile/student/classes` | Get enrolled classes |
| GET | `/api/mobile/student/classes/:id` | Get class detail |
| GET | `/api/mobile/student/krs` | Get KRS data |
| POST | `/api/mobile/student/krs` | Submit KRS |
| GET | `/api/mobile/student/grades` | Get grades (KHS) |
| GET | `/api/mobile/student/attendance` | Get attendance |
| GET | `/api/mobile/student/assignments` | Get assignments |
| POST | `/api/mobile/student/assignments/:id/submit` | Submit assignment |
| GET | `/api/mobile/student/materials` | Get materials |
| GET | `/api/mobile/student/matakuliah` | Get available courses |

**Detail lengkap:** [API Reference](./MOBILE_INTEGRATION_GUIDE.md#api-endpoints-reference)

### Request/Response Format

**Request:**
```http
GET /api/mobile/student/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "student_123",
    "email": "student@mail.com",
    "role": "student",
    "nim": "2021001",
    "jurusan": "Teknik Informatika"
  },
  "message": "Success"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

---

## 🧪 Testing

### Postman Testing

1. **Import Collection:**
   - Download [postman-collection.json](./postman-collection.json)
   - Import ke Postman

2. **Setup Environment:**
   ```
   base_url: http://localhost:3000/api/mobile
   access_token: (will be set after login)
   ```

3. **Test Flow:**
   ```
   1. POST /auth/login → Save access_token
   2. GET /student/profile → Test with token
   3. GET /student/classes → Test data fetching
   ```

**Panduan lengkap:** [Testing dengan Postman](./MOBILE_INTEGRATION_GUIDE.md#testing-dengan-postman)

---

## 🚀 Deployment

### Deploy ke Vercel

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect Vercel:**
   - Login ke [Vercel](https://vercel.com)
   - Import repository
   - Set environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     ```

3. **Deploy:**
   - Vercel auto-deploy on push
   - Production URL: `https://your-app.vercel.app`

### Post-Deployment

- ✅ Update mobile app base URL ke production
- ✅ Test semua endpoints
- ✅ Monitor logs di Vercel dashboard
- ✅ Setup custom domain (optional)

---

## 📖 Development Guide

### Local Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Structure

```typescript
// Endpoint structure
app/api/mobile/[feature]/route.ts

// Example: app/api/mobile/student/profile/route.ts
export async function GET(request: NextRequest) {
  // 1. Verify token
  // 2. Check role
  // 3. Query database
  // 4. Return response
}
```

### Adding New Endpoint

1. **Create file:**
   ```bash
   app/api/mobile/student/new-feature/route.ts
   ```

2. **Implement handler:**
   ```typescript
   import { verifyToken, checkStudentRole } from '../../lib/auth';
   
   export async function GET(request: NextRequest) {
     const tokenResult = await verifyToken(request);
     if (!tokenResult.success) return errorResponse(...);
     
     const roleResult = await checkStudentRole(tokenResult.userId!);
     if (!roleResult.success) return errorResponse(...);
     
     // Your logic here
     
     return successResponse(data);
   }
   ```

3. **Add RLS policy:**
   ```sql
   CREATE POLICY "policy_name"
   ON table_name
   FOR SELECT
   USING (auth.uid() = user_id);
   ```

4. **Update documentation:**
   - Add to [MOBILE_INTEGRATION_GUIDE.md](./MOBILE_INTEGRATION_GUIDE.md)
   - Add to Postman collection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- ✅ Use TypeScript
- ✅ Follow ESLint rules
- ✅ Add JSDoc comments for functions
- ✅ Write unit tests for new features
- ✅ Update documentation

---

## 📄 Lisensi

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase** - Excellent Backend-as-a-Service
- **Vercel** - Seamless deployment platform
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support & Contact

Jika Anda memiliki pertanyaan atau butuh bantuan:

1. 📖 **Baca dokumentasi lengkap:**
   - [Konsep Dasar](./ARCHITECTURE.md#bagian-i-konsep-dasar)
   - [Mobile Integration](./MOBILE_INTEGRATION_GUIDE.md)
   
2. 🧪 **Test dengan Postman** terlebih dahulu

3. 🐛 **Report bugs** via GitHub Issues

4. 💬 **Diskusi** di GitHub Discussions

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic CRUD operations
- ✅ JWT Authentication
- ✅ Student endpoints (18+)
- ✅ RLS policies
- ✅ Web dashboard

### Version 1.1 (Planned)
- ⏳ Dosen endpoints
- ⏳ Real-time notifications
- ⏳ File upload (Supabase Storage)
- ⏳ Advanced analytics

### Version 2.0 (Future)
- 📅 GraphQL API (alternative)
- 📅 WebSocket support
- 📅 AI-powered recommendations
- 📅 Mobile push notifications

---

## 📊 Statistics

- **18+ REST API Endpoints** ready untuk mobile
- **6 Layers Security** implementation
- **10+ Database Tables** dengan RLS
- **3 User Roles** dengan RBAC
- **100% TypeScript** untuk type safety
- **Production Ready** pada Vercel

---

<div align="center">

**Dibuat dengan ❤️ menggunakan Next.js, React, TypeScript, dan Supabase**

[⬆️ Back to Top](#-synclass---sistem-informasi-akademik-modern)

</div>
