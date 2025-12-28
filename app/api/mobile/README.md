# Mobile API - Dokumentasi Endpoints

API untuk Flutter Android Student. Base URL akan otomatis sesuai domain Next.js Anda.

## 🔓 PUBLIC ENDPOINTS

### 1. Login
```
POST /api/mobile/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "student@example.com",
      "username": "student_001",
      "full_name": "John Doe",
      "role": "student"
    },
    "session": {
      "access_token": "eyJ...",
      "refresh_token": "refresh_...",
      "expires_in": 3600
    }
  },
  "message": "Login successful"
}
```

### 2. Refresh Token
```
POST /api/mobile/auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

### 3. Logout
```
POST /api/mobile/auth/logout
Authorization: Bearer <access_token>
```

---

## 🔐 PROTECTED ENDPOINTS (Require Token)

### Header untuk semua protected endpoints:
```
Authorization: Bearer <access_token>
```

### 4. Get Profile
```
GET /api/mobile/student/profile
Authorization: Bearer <access_token>
```

### 5. Update Profile
```
PUT /api/mobile/student/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "081234567890",
  "address": "Jl. Street",
  "avatar_url": "https://..."
}
```

### 6. Get KRS List
```
GET /api/mobile/student/krs?status=PENDING
Authorization: Bearer <access_token>

Query Parameters:
- status: PENDING, APPROVED, atau REJECTED (optional)
```

### 7. Submit KRS
```
POST /api/mobile/student/krs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "matakuliah_ids": ["id1", "id2", "id3"]
}
```

### 8. Get Attendance
```
GET /api/mobile/student/attendance?kelas_id=xxx
Authorization: Bearer <access_token>
```

### 9. Submit Attendance
```
POST /api/mobile/student/attendance
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "presensi_session_id": "session-id",
  "kode_presensi": "ABC123"
}
```

### 10. Get Classes
```
GET /api/mobile/student/classes
Authorization: Bearer <access_token>
```

---

## 📱 Flutter Implementation

### Login
```dart
final response = await http.post(
  Uri.parse('https://yourdomain.com/api/mobile/auth/login'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'email': 'student@example.com',
    'password': 'password',
  }),
);

final data = jsonDecode(response.body);
final token = data['data']['session']['access_token'];
```

### Use Token in Requests
```dart
final response = await http.get(
  Uri.parse('https://yourdomain.com/api/mobile/student/profile'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  },
);
```

---

## ✅ Semua Endpoints Ready!

Tinggal deploy ke Vercel dan teman Anda bisa langsung pakai.
