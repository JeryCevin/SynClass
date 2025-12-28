// app/api/mobile/auth/login/route.ts - Student Login
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, successResponse } from '../../lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse(
        'Email and password are required',
        'MISSING_CREDENTIALS',
        400
      );
    }

    // Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse(error.message, 'LOGIN_FAILED', 401);
    }

    // Verify user adalah student
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, username, nim, jurusan, angkatan')
      .eq('id', data.user!.id)
      .single();

    if (profileError || !profile || profile.role !== 'student') {
      return errorResponse(
        'Access denied. Only student role allowed.',
        'INVALID_ROLE',
        403
      );
    }

    return successResponse(
      {
        user: {
          id: data.user!.id,
          email: data.user!.email,
          username: profile.username,
          nim: profile.nim,
          jurusan: profile.jurusan,
          angkatan: profile.angkatan,
          role: profile.role,
        },
        session: {
          access_token: data.session!.access_token,
          refresh_token: data.session!.refresh_token,
          expires_in: data.session!.expires_in,
        },
      },
      'Login successful',
      200
    );
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse('Login failed', 'LOGIN_ERROR', 500);
  }
}
