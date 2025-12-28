// app/api/mobile/lib/auth.ts - Authentication & Role Verification
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verify JWT Token & Extract User Data
 */
export async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return {
        success: false,
        error: 'Missing authorization token',
        code: 'NO_TOKEN',
        status: 401,
        userId: undefined,
        userEmail: undefined,
      };
    }

    // Verify token dengan Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        status: 401,
        userId: undefined,
        userEmail: undefined,
      };
    }

    return {
      success: true,
      user,
      userId: user.id,
      userEmail: user.email,
    };
  } catch (err) {
    console.error('Token verification error:', err);
    return {
      success: false,
      error: 'Token verification failed',
      code: 'TOKEN_ERROR',
      status: 500,
      userId: undefined,
      userEmail: undefined,
    };
  }
}

/**
 * Check User Role - Only STUDENT
 */
export async function checkStudentRole(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return {
        success: false,
        error: 'Profile not found',
        code: 'PROFILE_NOT_FOUND',
        status: 403,
        profile: undefined,
      };
    }

    if (profile.role !== 'student') {
      return {
        success: false,
        error: `Access denied. Only student role allowed. Your role: ${profile.role}`,
        code: 'INVALID_ROLE',
        status: 403,
        profile: undefined,
      };
    }

    return {
      success: true,
      profile,
    };
  } catch (err) {
    console.error('Role check error:', err);
    return {
      success: false,
      error: 'Role verification failed',
      code: 'ROLE_CHECK_ERROR',
      status: 500,
      profile: undefined,
    };
  }
}

/**
 * Format success response
 */
export function successResponse(
  data: any,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Format error response
 */
export function errorResponse(
  error: string,
  code: string,
  status: number = 400
) {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Get Supabase client (for use in API routes)
 */
export { supabase };
