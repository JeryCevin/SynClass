// app/api/mobile/student/matakuliah/route.ts - Get Available Courses
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

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    const kode_mk = searchParams.get('kode_mk');

    let query = supabase
      .from('matakuliah')
      .select(`
        id,
        kode_mk,
        nama_mk,
        sks,
        semester,
        hari,
        jam_mulai,
        jam_selesai,
        ruangan,
        dosen:dosen_id (
          id,
          username,
          nidn
        )
      `);

    if (semester) {
      query = query.eq('semester', parseInt(semester));
    }

    if (kode_mk) {
      query = query.ilike('kode_mk', `%${kode_mk}%`);
    }

    const { data: courses, error } = await query.order('semester', {
      ascending: true,
    }).order('kode_mk', { ascending: true });

    if (error) {
      return errorResponse(error.message, 'COURSES_FETCH_ERROR', 400);
    }

    // Get student's current enrollments to mark which ones are already taken
    const { data: enrollments } = await supabase
      .from('matakuliah_diambil')
      .select('matakuliah_id')
      .eq('mahasiswa_id', tokenResult.userId!);

    const enrolledIds = enrollments?.map((e: any) => e.matakuliah_id) || [];

    // Merge enrollment status
    const coursesWithStatus = (courses || []).map((course: any) => ({
      ...course,
      is_enrolled: enrolledIds.includes(course.id),
    }));

    return successResponse({
      data: coursesWithStatus,
      total: coursesWithStatus.length,
    });
  } catch (err) {
    console.error('Get courses error:', err);
    return errorResponse('Failed to fetch courses', 'COURSES_ERROR', 500);
  }
}
