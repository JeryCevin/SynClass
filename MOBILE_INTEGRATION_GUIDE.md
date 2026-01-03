# 📱 Mobile Integration Guide - SynClass API

> **Panduan lengkap untuk mengintegrasikan aplikasi mobile (Flutter/React Native) dengan SynClass REST API**

## 📋 Daftar Isi

- [Quick Start](#quick-start)
- [Authentication Flow](#authentication-flow)
- [API Endpoints Reference](#api-endpoints-reference)
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
