// app/api/mobile/student/assignments/route.ts - Get Assignments
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
    const status = searchParams.get('status'); // 'pending', 'submitted', 'graded'

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
      return errorResponse('Access denied to this course assignments', 'ACCESS_DENIED', 403);
    }

    // Get assignments (posts with jenis='tugas')
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
        deadline,
        created_at,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk
        )
      `)
      .eq('jenis', 'tugas')
      .in('matakuliah_id', enrolledMatakuliahIds);

    if (matakuliah_id) {
      query = query.eq('matakuliah_id', parseInt(matakuliah_id));
    }

    const { data: assignments, error } = await query.order('deadline', {
      ascending: true,
    });

    if (error) {
      return errorResponse(error.message, 'ASSIGNMENTS_FETCH_ERROR', 400);
    }

    // Fetch student's submissions for these assignments
    const assignmentIds = (assignments || []).map((a: any) => a.id);
    
    let submissionsData: any = [];
    if (assignmentIds.length > 0) {
      const { data: submissions, error: submissionError } = await supabase
        .from('tugas_submission')
        .select('*')
        .eq('mahasiswa_id', tokenResult.userId!)
        .in('post_id', assignmentIds);

      if (!submissionError && submissions) {
        submissionsData = submissions;
      }
    }

    // Merge submission data with assignments
    const assignmentsWithSubmissions = (assignments || []).map((assignment: any) => {
      const submission = submissionsData.find((s: any) => s.post_id === assignment.id);
      return {
        ...assignment,
        submission: submission || null,
        submission_status: submission ? (submission.graded_at ? 'graded' : 'submitted') : 'pending',
      };
    });

    // Filter by status if provided
    let result = assignmentsWithSubmissions;
    if (status) {
      result = assignmentsWithSubmissions.filter((a: any) => a.submission_status === status);
    }

    return successResponse({
      data: result,
      total: result.length,
    });
  } catch (err) {
    console.error('Get assignments error:', err);
    return errorResponse('Failed to fetch assignments', 'ASSIGNMENTS_ERROR', 500);
  }
}
