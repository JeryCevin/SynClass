// app/api/mobile/student/materials/route.ts - Get Course Materials
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
    const matakuliah_id = searchParams.get('matakuliah_id');
    const pertemuan = searchParams.get('pertemuan');

    // Get student's enrolled classes
    const { data: enrolledClasses, error: enrollError } = await supabase
      .from('matakuliah_diambil')
      .select('matakuliah_id')
      .eq('mahasiswa_id', tokenResult.userId!);

    if (enrollError || !enrolledClasses) {
      return errorResponse('Failed to fetch enrolled classes', 'CLASS_FETCH_ERROR', 400);
    }

    const enrolledMatakuliahIds = enrolledClasses.map((ec: any) => ec.matakuliah_id);

    // Validate access
    if (matakuliah_id && !enrolledMatakuliahIds.includes(parseInt(matakuliah_id))) {
      return errorResponse('Access denied to this course materials', 'ACCESS_DENIED', 403);
    }

    let query = supabase
      .from('post')
      .select(`
        id,
        matakuliah_id,
        judul,
        pertemuan,
        deskripsi,
        jenis,
        link,
        created_at,
        created_by,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk
        )
      `)
      .eq('jenis', 'materi')
      .in('matakuliah_id', enrolledMatakuliahIds);

    if (matakuliah_id) {
      query = query.eq('matakuliah_id', parseInt(matakuliah_id));
    }

    if (pertemuan) {
      query = query.eq('pertemuan', parseInt(pertemuan));
    }

    const { data: materials, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return errorResponse(error.message, 'MATERIALS_FETCH_ERROR', 400);
    }

    return successResponse({
      data: materials || [],
      total: (materials || []).length,
    });
  } catch (err) {
    console.error('Get materials error:', err);
    return errorResponse('Failed to fetch materials', 'MATERIALS_ERROR', 500);
  }
}
