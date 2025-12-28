// app/api/mobile/student/classes/route.ts - Get Enrolled Classes
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

    // Get enrolled classes
    const { data: classes, error } = await supabase
      .from('matakuliah_diambil')
      .select(`
        id,
        mahasiswa_id,
        matakuliah_id,
        semester,
        nilai_huruf,
        nilai_angka,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk,
          sks,
          semester,
          dosen_id,
          hari,
          jam_mulai,
          jam_selesai,
          ruangan
        )
      `)
      .eq('mahasiswa_id', tokenResult.userId!)
      .order('created_at', { ascending: false });

    if (error) {
      return errorResponse(error.message, 'CLASS_FETCH_ERROR', 400);
    }

    return successResponse({
      data: classes || [],
      total: (classes || []).length,
    });
  } catch (err) {
    console.error('Get classes error:', err);
    return errorResponse('Failed to fetch classes', 'CLASS_ERROR', 500);
  }
}
