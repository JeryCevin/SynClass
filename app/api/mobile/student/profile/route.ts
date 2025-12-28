// app/api/mobile/student/profile/route.ts - Get & Update Profile
import { NextRequest } from 'next/server';
import { verifyToken, checkStudentRole, successResponse, errorResponse, supabase } from '../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify token & role
    const tokenResult = await verifyToken(request);
    if (!tokenResult.success) {
      return errorResponse(tokenResult.error!, tokenResult.code!, tokenResult.status!);
    }

    const roleResult = await checkStudentRole(tokenResult.userId!);
    if (!roleResult.success) {
      return errorResponse(roleResult.error!, roleResult.code!, roleResult.status!);
    }

    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', tokenResult.userId)
      .single();

    if (error || !profile) {
      return errorResponse('Profile not found', 'PROFILE_NOT_FOUND', 404);
    }

    return successResponse(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    return errorResponse('Failed to fetch profile', 'PROFILE_ERROR', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify token & role
    const tokenResult = await verifyToken(request);
    if (!tokenResult.success) {
      return errorResponse(tokenResult.error!, tokenResult.code!, tokenResult.status!);
    }

    const roleResult = await checkStudentRole(tokenResult.userId!);
    if (!roleResult.success) {
      return errorResponse(roleResult.error!, roleResult.code!, roleResult.status!);
    }

    const body = await request.json();
    const { username, jurusan, angkatan, nidn } = body;

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...(username && { username }),
        ...(jurusan && { jurusan }),
        ...(angkatan && { angkatan }),
        ...(nidn && { nidn }),
        updated_at: new Date(),
      })
      .eq('id', tokenResult.userId!)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 'UPDATE_FAILED', 400);
    }

    return successResponse(profile, 'Profile updated successfully');
  } catch (err) {
    console.error('Update profile error:', err);
    return errorResponse('Failed to update profile', 'UPDATE_ERROR', 500);
  }
}
