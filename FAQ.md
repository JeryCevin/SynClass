# ❓ FAQ & Troubleshooting - SynClass

> **Pertanyaan yang Sering Ditanyakan dan Solusinya**

## 📋 Daftar Isi

- [FAQ - Pertanyaan Umum](#faq---pertanyaan-umum)
- [Troubleshooting - Pemecahan Masalah](#troubleshooting---pemecahan-masalah)
- [Best Practices](#best-practices)
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
