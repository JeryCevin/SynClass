// app/api/mobile/student/classes/[matakuliahId]/route.ts - Get Class Details
import { NextRequest } from 'next/server';
import { verifyToken, checkStudentRole, successResponse, errorResponse, supabase } from '../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matakuliahId: string }> }
) {
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

    const { matakuliahId } = await params;
    const matakuliahIdNum = parseInt(matakuliahId);

    // Verify student is enrolled in this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('matakuliah_diambil')
      .select('*')
      .eq('mahasiswa_id', tokenResult.userId!)
      .eq('matakuliah_id', matakuliahIdNum)
      .single();

    if (enrollmentError || !enrollment) {
      return errorResponse('Not enrolled in this course', 'ACCESS_DENIED', 403);
    }

    // Get course details
    const { data: matakuliah, error: mkError } = await supabase
      .from('matakuliah')
      .select(`
        *,
        dosen:dosen_id (
          id,
          username,
          nidn
        )
      `)
      .eq('id', matakuliahIdNum)
      .single();

    if (mkError || !matakuliah) {
      return errorResponse('Course not found', 'COURSE_NOT_FOUND', 404);
    }

    // Get class information
    const { data: kelas, error: kelasError } = await supabase
      .from('kelas')
      .select(`
        *,
        dosen:dosen_id (
          id,
          username,
          nidn
        )
      `)
      .eq('matakuliah_id', matakuliahIdNum);

    if (kelasError) {
      return errorResponse(kelasError.message, 'CLASS_FETCH_ERROR', 400);
    }

    // Get enrolled students count
    const { data: students, error: studentError } = await supabase
      .from('matakuliah_diambil')
      .select(`
        id,
        mahasiswa_id,
        nilai_huruf,
        profiles:mahasiswa_id (
          id,
          username,
          nim
        )
      `)
      .eq('matakuliah_id', matakuliahIdNum);

    if (studentError) {
      return errorResponse(studentError.message, 'STUDENT_FETCH_ERROR', 400);
    }

    // Get course materials count
    const { data: materials, error: materialError } = await supabase
      .from('post')
      .select('id')
      .eq('matakuliah_id', matakuliahIdNum)
      .eq('jenis', 'materi');

    if (materialError) {
      return errorResponse(materialError.message, 'MATERIAL_COUNT_ERROR', 400);
    }

    // Get assignments count
    const { data: assignments, error: assignmentError } = await supabase
      .from('post')
      .select('id')
      .eq('matakuliah_id', matakuliahIdNum)
      .eq('jenis', 'tugas');

    if (assignmentError) {
      return errorResponse(assignmentError.message, 'ASSIGNMENT_COUNT_ERROR', 400);
    }

    // Get attendance summary
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('presensi')
      .select(`
        status,
        presensi_session:presensi_session_id (
          matakuliah_id
        )
      `)
      .eq('mahasiswa_id', tokenResult.userId!)
      .filter('presensi_session.matakuliah_id', 'eq', matakuliahId);

    let attendanceSummary = {
      total: 0,
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
      persentase: 0,
    };

    if (!attendanceError && attendanceData && attendanceData.length > 0) {
      attendanceSummary.total = attendanceData.length;
      attendanceSummary.hadir = attendanceData.filter((a: any) => a.status === 'hadir').length;
      attendanceSummary.sakit = attendanceData.filter((a: any) => a.status === 'sakit').length;
      attendanceSummary.izin = attendanceData.filter((a: any) => a.status === 'izin').length;
      attendanceSummary.alpha = attendanceData.filter((a: any) => a.status === 'alpha').length;
      attendanceSummary.persentase = parseFloat(((attendanceSummary.hadir / attendanceSummary.total) * 100).toFixed(2));
    }

    return successResponse({
      matakuliah,
      kelas,
      student_enrollment: {
        total_students: students?.length || 0,
        students: students || [],
      },
      course_content: {
        materials_count: materials?.length || 0,
        assignments_count: assignments?.length || 0,
      },
      attendance_summary: attendanceSummary,
    });
  } catch (err) {
    console.error('Get class details error:', err);
    return errorResponse('Failed to fetch class details', 'CLASS_DETAIL_ERROR', 500);
  }
}
