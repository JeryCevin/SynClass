// app/api/mobile/auth/refresh/route.ts - Refresh Token
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, successResponse } from '../../lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return errorResponse(
        'Refresh token is required',
        'MISSING_REFRESH_TOKEN',
        400
      );
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return errorResponse('Token refresh failed', 'REFRESH_FAILED', 401);
    }

    return successResponse({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
      expires_in: data.session!.expires_in,
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return errorResponse('Token refresh failed', 'REFRESH_ERROR', 500);
  }
}
