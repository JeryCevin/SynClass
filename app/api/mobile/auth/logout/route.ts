// app/api/mobile/auth/logout/route.ts - Logout
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, successResponse } from '../../lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return errorResponse(
        'Access token is required',
        'MISSING_TOKEN',
        400
      );
    }

    // Sign out
    await supabase.auth.signOut();

    return successResponse(
      {},
      'Logged out successfully'
    );
  } catch (err) {
    console.error('Logout error:', err);
    return errorResponse('Logout failed', 'LOGOUT_ERROR', 500);
  }
}
