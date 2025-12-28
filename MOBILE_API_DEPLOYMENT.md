# 🚀 Deployment ke Vercel - Step by Step

## ✅ Setup Selesai! Sekarang Tinggal Deploy

Anda sudah punya:
- ✅ 10 API endpoints di `/app/api/mobile/`
- ✅ Authentication dengan Supabase
- ✅ Role verification (Student Only)
- ✅ Semua endpoints ready

---

## 📋 Pre-Deployment Checklist

### 1. Verifikasi Kode Lokal
```bash
cd /home/andreanove/Project/SynClass

# Test API lokal
npm run dev

# Coba endpoint (di terminal lain)
curl -X POST http://localhost:3000/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.com","password":"pass"}'

# Harus return JSON response (bisa error, tapi bukan crash)
```

### 2. Push ke Git
```bash
git add .
git commit -m "Add: Mobile API Gateway for Flutter (Student Only)"
git push origin main
```

---

## 🚀 Deploy ke Vercel (3 Langkah)

### Langkah 1: Connect ke Vercel
1. Buka https://vercel.com
2. Login / Sign up
3. Click "Import Project"
4. Pilih repository SynClass
5. Click Import

### Langkah 2: Add Environment Variables
Setelah import, akan muncul "Configure Project"

**Add 3 variables ini:**
```
NEXT_PUBLIC_SUPABASE_URL
Value: https://uwkoelerozqrxzibtjmf.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
Value: sb_publishable_6ZA1PEcENA7doafLCHb62A_BnmsmrFS

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy dari `.env.local` Anda**

### Langkah 3: Deploy!
1. Click "Deploy"
2. Tunggu ~2 menit
3. Done! ✅

---

## 🎉 Hasil Deployment

Setelah deploy, Anda dapat:
- Production URL: `https://synclass-xxx.vercel.app`
- API Endpoints:
  - `https://synclass-xxx.vercel.app/api/mobile/auth/login`
  - `https://synclass-xxx.vercel.app/api/mobile/student/profile`
  - dll...

---

## 📱 Kasih ke Teman Anda

Berikan informasi ini ke Flutter developer teman Anda:

```
API Base URL: https://synclass-xxx.vercel.app/api/mobile

Endpoints:
1. POST /auth/login
2. POST /auth/refresh
3. POST /auth/logout
4. GET /student/profile
5. PUT /student/profile
6. GET /student/krs
7. POST /student/krs
8. GET /student/attendance
9. POST /student/attendance
10. GET /student/classes

Dokumentasi: /app/api/mobile/README.md
```

---

## ✨ Testing Setelah Deploy

```bash
# Test login dari Flutter
curl -X POST https://synclass-xxx.vercel.app/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password"}'

# Response:
# {
#   "success": false,
#   "error": "Invalid login credentials",
#   "code": "LOGIN_FAILED"
# }

# ^ Ini normal! Berarti API berjalan, tinggal pakai credentials yang benar
```

---

## 🔧 Troubleshooting Deployment

### Error: "Missing Supabase environment variables"
**Solusi:** Pastikan 3 environment variables di Vercel sudah benar
1. Go to Vercel Dashboard
2. Project Settings
3. Environment Variables
4. Verify semua 3 variable ada

### Error: "CORS error" dari Flutter
**Solusi:** Vercel sudah support CORS, tidak perlu konfigurasi tambahan

### Error: "Token verification failed"
**Solusi:** Pastikan Supabase keys di .env.local sudah benar

---

## 📊 Monitoring di Vercel

### Lihat Logs
1. Vercel Dashboard → Project
2. Click "Deployments"
3. Pilih latest deployment
4. Click "Logs"
5. Lihat request & response

### Lihat Errors
1. Analytics → Functions
2. Lihat error rate
3. Click untuk detail

---

## 🎯 Ringkasan

| Step | Status | Action |
|------|--------|--------|
| Setup API | ✅ Done | - |
| Push ke Git | ⏳ TODO | `git push` |
| Deploy ke Vercel | ⏳ TODO | Import → Add Vars → Deploy |
| Test API | ⏳ TODO | cURL atau Flutter |
| Share ke Teman | ⏳ TODO | Kasih base URL |

---

## 💡 Pro Tips

1. **Jangan hardcode URL di Flutter**
   ```dart
   const String API_BASE_URL = 'https://yourdomain.com/api/mobile';
   
   // Gampang di-change kalau ada perubahan
   ```

2. **Simpan Token di SecureStorage**
   ```dart
   await secureStorage.write(key: 'token', value: accessToken);
   ```

3. **Auto Refresh Token**
   ```dart
   // Kalau token expired, auto request new one
   ```

4. **Add Timeout**
   ```dart
   final response = await http.post(...).timeout(Duration(seconds: 30));
   ```

---

## 📞 Support

Kalau ada masalah:
1. Check Vercel logs
2. Check Supabase dashboard
3. Test API dengan cURL
4. Verify .env variables

**Semua sudah ready!** Tinggal deploy & share URL ke teman! 🚀
