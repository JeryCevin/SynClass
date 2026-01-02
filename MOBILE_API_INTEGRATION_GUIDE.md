# 📱 Mobile API Integration Guide

Panduan lengkap untuk mengintegrasikan SynClass Mobile API ke aplikasi Flutter, React Native, atau platform mobile lainnya.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [Setup Client](#setup-client)
- [Implementation Examples](#implementation-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

SynClass Mobile API adalah REST API Gateway yang menyediakan akses ke semua fitur akademik untuk mahasiswa melalui aplikasi mobile.

### Key Features

- ✅ **18+ REST Endpoints** - Complete academic features
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role Verification** - Student-only access
- ✅ **Standard JSON Response** - Consistent format
- ✅ **Comprehensive Error Codes** - Easy debugging
- ✅ **Real-time Data** - Direct from PostgreSQL

### Base URL

```
Development: http://localhost:3000/api/mobile
Production:  https://your-domain.vercel.app/api/mobile
```

---

## 🔐 Authentication Flow

### Complete Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION LIFECYCLE                      │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN
   Mobile App → POST /api/mobile/auth/login
                {email, password}
                ↓
   API Response ← {access_token, refresh_token, user}
                ↓
   Save to Secure Storage

2. USE ACCESS TOKEN (For all protected endpoints)
   Mobile App → GET /api/mobile/student/profile
                Header: Authorization: Bearer <access_token>
                ↓
   API Response ← {success: true, data: {...}}

3. TOKEN EXPIRED (After 1 hour)
   Mobile App → GET /api/mobile/student/profile
                ↓
   API Response ← {success: false, code: "TOKEN_EXPIRED"}
                ↓
   Detect Error Code

4. REFRESH TOKEN
   Mobile App → POST /api/mobile/auth/refresh
                {refresh_token}
                ↓
   API Response ← {access_token, refresh_token}
                ↓
   Update Secure Storage
                ↓
   Retry Failed Request

5. LOGOUT
   Mobile App → POST /api/mobile/auth/logout
                Header: Authorization: Bearer <access_token>
                ↓
   Clear Secure Storage
   Navigate to Login Screen
```

### Token Management

**Access Token:**
- Expires in: **1 hour**
- Use for: All protected API requests
- Storage: Secure storage (flutter_secure_storage, react-native-keychain)

**Refresh Token:**
- Expires in: **30 days** (Supabase default)
- Use for: Renewing access token
- Storage: Secure storage (same as access token)

---

## 🛠 Setup Client

### Flutter Setup

#### 1. Add Dependencies

```yaml
# pubspec.yaml
dependencies:
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
  provider: ^6.1.0  # For state management
```

#### 2. Create API Service

```dart
// lib/services/api_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'YOUR_API_URL/api/mobile';
  final storage = const FlutterSecureStorage();
  
  String? _accessToken;
  String? _refreshToken;

  // Initialize tokens from storage
  Future<void> init() async {
    _accessToken = await storage.read(key: 'access_token');
    _refreshToken = await storage.read(key: 'refresh_token');
  }

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);

    if (data['success'] == true) {
      _accessToken = data['data']['session']['access_token'];
      _refreshToken = data['data']['session']['refresh_token'];
      
      // Save to secure storage
      await storage.write(key: 'access_token', value: _accessToken!);
      await storage.write(key: 'refresh_token', value: _refreshToken!);
    }

    return data;
  }

  // Refresh Token
  Future<bool> refreshAccessToken() async {
    if (_refreshToken == null) return false;

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refresh_token': _refreshToken}),
      );

      final data = jsonDecode(response.body);

      if (data['success'] == true) {
        _accessToken = data['data']['session']['access_token'];
        _refreshToken = data['data']['session']['refresh_token'];
        
        await storage.write(key: 'access_token', value: _accessToken!);
        await storage.write(key: 'refresh_token', value: _refreshToken!);
        
        return true;
      }
    } catch (e) {
      print('Refresh token error: $e');
    }

    return false;
  }

  // Generic GET request with auto-retry on token expiry
  Future<Map<String, dynamic>> get(String endpoint) async {
    var response = await _makeRequest('GET', endpoint);
    var data = jsonDecode(response.body);

    // If token expired, refresh and retry
    if (data['code'] == 'TOKEN_EXPIRED') {
      bool refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await _makeRequest('GET', endpoint);
        data = jsonDecode(response.body);
      }
    }

    return data;
  }

  // Generic POST request
  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> body) async {
    var response = await _makeRequest('POST', endpoint, body: body);
    var data = jsonDecode(response.body);

    if (data['code'] == 'TOKEN_EXPIRED') {
      bool refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await _makeRequest('POST', endpoint, body: body);
        data = jsonDecode(response.body);
      }
    }

    return data;
  }

  // Helper method
  Future<http.Response> _makeRequest(String method, String endpoint, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = {
      'Content-Type': 'application/json',
      if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
    };

    if (method == 'GET') {
      return await http.get(uri, headers: headers);
    } else if (method == 'POST') {
      return await http.post(uri, headers: headers, body: jsonEncode(body));
    } else if (method == 'PUT') {
      return await http.put(uri, headers: headers, body: jsonEncode(body));
    }

    throw Exception('Unsupported method: $method');
  }

  // Logout
  Future<void> logout() async {
    await http.post(
      Uri.parse('$baseUrl/auth/logout'),
      headers: {
        'Authorization': 'Bearer $_accessToken',
      },
    );

    // Clear storage
    await storage.deleteAll();
    _accessToken = null;
    _refreshToken = null;
  }

  bool get isAuthenticated => _accessToken != null;
}
```

#### 3. Use in UI

```dart
// lib/screens/login_screen.dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _apiService = ApiService();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);

    try {
      final result = await _apiService.login(
        _emailController.text,
        _passwordController.text,
      );

      if (result['success'] == true) {
        // Navigate to home
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        // Show error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['error'] ?? 'Login failed')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
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
              keyboardType: TextInputType.emailAddress,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 24),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _handleLogin,
                    child: Text('Login'),
                  ),
          ],
        ),
      ),
    );
  }
}
```

---

### React Native Setup

#### 1. Install Dependencies

```bash
npm install axios react-native-keychain
# or
yarn add axios react-native-keychain
```

#### 2. Create API Service

```javascript
// services/apiService.js
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const BASE_URL = 'YOUR_API_URL/api/mobile';

class ApiService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  async init() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.accessToken = credentials.username;
        this.refreshToken = credentials.password;
      }
    } catch (error) {
      console.log('Could not load credentials', error);
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { access_token, refresh_token } = response.data.data.session;
        this.accessToken = access_token;
        this.refreshToken = refresh_token;

        // Save to keychain
        await Keychain.setGenericPassword(access_token, refresh_token);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: this.refreshToken,
      });

      if (response.data.success) {
        const { access_token, refresh_token } = response.data.data.session;
        this.accessToken = access_token;
        this.refreshToken = refresh_token;

        await Keychain.setGenericPassword(access_token, refresh_token);
        return true;
      }
    } catch (error) {
      console.log('Refresh token error:', error);
    }

    return false;
  }

  async get(endpoint) {
    try {
      let response = await this._makeRequest('get', endpoint);

      // Auto-retry on token expiry
      if (response.data.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          response = await this._makeRequest('get', endpoint);
        }
      }

      return response.data;
    } catch (error) {
      return this._handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      let response = await this._makeRequest('post', endpoint, data);

      if (response.data.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          response = await this._makeRequest('post', endpoint, data);
        }
      }

      return response.data;
    } catch (error) {
      return this._handleError(error);
    }
  }

  async _makeRequest(method, endpoint, data = null) {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    if (data) {
      config.data = data;
    }

    return await axios(config);
  }

  _handleError(error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      code: error.response?.data?.code || 'NETWORK_ERROR',
    };
  }

  async logout() {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );
    } catch (error) {
      console.log('Logout error:', error);
    }

    await Keychain.resetGenericPassword();
    this.accessToken = null;
    this.refreshToken = null;
  }

  get isAuthenticated() {
    return this.accessToken !== null;
  }
}

export default new ApiService();
```

#### 3. Use in Components

```javascript
// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import apiService from '../services/apiService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const result = await apiService.login(email, password);

    if (result.success) {
      navigation.replace('Home');
    } else {
      Alert.alert('Login Failed', result.error);
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

---

## 🎨 Implementation Examples

### Get Student Profile

```dart
// Flutter
Future<void> loadProfile() async {
  final result = await apiService.get('/student/profile');
  
  if (result['success']) {
    setState(() {
      profile = result['data'];
    });
  }
}
```

```javascript
// React Native
const loadProfile = async () => {
  const result = await apiService.get('/student/profile');
  
  if (result.success) {
    setProfile(result.data);
  }
};
```

### Get Classes List

```dart
// Flutter
Future<List> getClasses() async {
  final result = await apiService.get('/student/classes');
  
  if (result['success']) {
    return result['data'];
  }
  return [];
}
```

### Submit KRS

```dart
// Flutter
Future<bool> submitKRS(List<String> matakuliahIds) async {
  final result = await apiService.post('/student/krs', {
    'matakuliah_ids': matakuliahIds,
  });
  
  return result['success'] == true;
}
```

### Get Assignments

```dart
// Flutter with query parameters
Future<List> getAssignments(String matakuliahId) async {
  final result = await apiService.get(
    '/student/assignments?matakuliah_id=$matakuliahId'
  );
  
  if (result['success']) {
    return result['data'];
  }
  return [];
}
```

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `INVALID_CREDENTIALS` | Wrong email/password | Show error, ask user to retry |
| `TOKEN_EXPIRED` | Access token expired | Auto-refresh token & retry |
| `TOKEN_INVALID` | Invalid token format | Force logout & re-login |
| `ROLE_NOT_STUDENT` | User is not student | Show error, deny access |
| `ACCESS_DENIED` | No permission to resource | Show error message |
| `VALIDATION_ERROR` | Invalid input data | Show validation errors |
| `SERVER_ERROR` | Internal server error | Show generic error, retry later |

### Error Handling Example

```dart
// Flutter
Future<void> handleApiCall() async {
  try {
    final result = await apiService.get('/student/profile');
    
    if (result['success']) {
      // Handle success
      handleSuccess(result['data']);
    } else {
      // Handle API error
      handleError(result['error'], result['code']);
    }
  } catch (e) {
    // Handle network error
    showNetworkError();
  }
}

void handleError(String message, String code) {
  switch (code) {
    case 'TOKEN_EXPIRED':
      // Already handled by ApiService auto-retry
      break;
    case 'TOKEN_INVALID':
      // Force logout
      logout();
      break;
    case 'ROLE_NOT_STUDENT':
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Access Denied'),
          content: Text('This app is for students only'),
        ),
      );
      break;
    default:
      // Show generic error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
  }
}
```

---

## ✅ Best Practices

### 1. Secure Token Storage

**✅ DO:**
```dart
// Use flutter_secure_storage
final storage = FlutterSecureStorage();
await storage.write(key: 'access_token', value: token);
```

**❌ DON'T:**
```dart
// Don't use SharedPreferences for tokens
prefs.setString('access_token', token); // INSECURE!
```

### 2. Auto Token Refresh

Implement automatic token refresh when receiving `TOKEN_EXPIRED` error.

### 3. Network Error Handling

Always wrap API calls in try-catch for network errors.

### 4. Loading States

Show loading indicators during API calls for better UX.

### 5. Timeout Configuration

```dart
final client = http.Client();
final request = http.Request('GET', uri);
final streamedResponse = await client.send(request)
  .timeout(Duration(seconds: 30));
```

### 6. Offline Support

Cache important data locally:
```dart
// Save to local database
await db.insert('profile', profile);

// Load from cache if offline
if (!hasNetwork) {
  profile = await db.query('profile');
}
```

### 7. Rate Limiting

Implement debouncing for search/filter operations:
```dart
Timer? _debounce;

void onSearchChanged(String query) {
  _debounce?.cancel();
  _debounce = Timer(Duration(milliseconds: 500), () {
    searchAPI(query);
  });
}
```

---

## 🐛 Troubleshooting

### Issue: "Network error" on Android

**Solution:** Add internet permission in `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Issue: Token expires too quickly

**Solution:** Implement refresh token logic correctly. Access token expires in 1 hour, but refresh token lasts 30 days.

### Issue: CORS error in development

**Solution:** This is handled server-side. Make sure API is deployed or running locally.

### Issue: Cannot save to secure storage

**Solution:**
- Android: Ensure device is not rooted
- iOS: Check app has keychain access group

### Issue: 401 Unauthorized on all requests

**Solution:**
- Check if token is being sent correctly in Authorization header
- Verify token format: `Bearer <token>`
- Check if token is expired

### Issue: Slow API responses

**Solution:**
- Enable HTTP caching
- Implement local caching for frequently accessed data
- Use pagination for list endpoints

---

## 📚 Additional Resources

- **Full API Documentation**: `/app/api/mobile/README.md`
- **Deployment Guide**: `MOBILE_API_DEPLOYMENT.md`
- **Postman Collection**: `postman-collection.json`
- **Main README**: `README.md`

---

## 🤝 Support

Need help? Contact:
- 📧 Email: laurentiusdika28@gmail.com
- 🐛 GitHub Issues: Report bugs & ask questions

---

<div align="center">

**Happy Coding! 🚀**

Made with ❤️ for Mobile Developers

</div>
