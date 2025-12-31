// app/api/mobile/student/attendance/route.ts - Attendance Management
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

    let query = supabase
      .from('presensi')
      .select(`
        id,
        mahasiswa_id,
        presensi_session_id,
        status,
        waktu_presensi,
        presensi_session:presensi_session_id (
          id,
          matakuliah_id,
          pertemuan,
          tanggal,
          waktu_mulai,
          waktu_selesai
        )
      `)
      .eq('mahasiswa_id', tokenResult.userId!);

    if (matakuliah_id) {
      query = query.eq('presensi_session.matakuliah_id', parseInt(matakuliah_id));
    }

    const { data: attendance, error } = await query.order('waktu_presensi', {
      ascending: false,
    });

    if (error) {
      return errorResponse(error.message, 'ATTENDANCE_FETCH_ERROR', 400);
    }

    const attendanceList = attendance || [];
    const stats = {
      total: attendanceList.length,
      hadir: attendanceList.filter((a: any) => a.status === 'HADIR').length,
      persentase: attendanceList.length > 0
        ? ((attendanceList.filter((a: any) => a.status === 'HADIR').length / attendanceList.length) * 100).toFixed(2)
        : 0,
    };

    return successResponse({
      data: attendanceList,
      stats,
    });
  } catch (err) {
    console.error('Get attendance error:', err);
    return errorResponse('Failed to fetch attendance', 'ATTENDANCE_ERROR', 500);
  }
}

export async function POST(request: NextRequest) {
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
    const { presensi_session_id, status } = body;

    // Validate required fields
    if (!presensi_session_id) {
      return errorResponse(
        'presensi_session_id is required',
        'MISSING_FIELDS',
        400
      );
    }

    // Validate status - must be one of: HADIR, SAKIT, IZIN, ALPHA
    const validStatuses = ['HADIR', 'SAKIT', 'IZIN', 'ALPHA'];
    const attendanceStatus = status?.toUpperCase() || 'HADIR';
    
    if (!validStatuses.includes(attendanceStatus)) {
      return errorResponse(
        'Invalid status. Must be: HADIR, SAKIT, IZIN, or ALPHA',
        'INVALID_STATUS',
        400
      );
    }

    // Get session by ID
    const { data: session, error: sessionError } = await supabase
      .from('presensi_session')
      .select('*')
      .eq('id', presensi_session_id)
      .single();

    if (sessionError || !session) {
      return errorResponse('Attendance session not found', 'SESSION_NOT_FOUND', 404);
    }

    // Check if session is active
    if (!session.is_active) {
      return errorResponse('Attendance session is not active', 'SESSION_INACTIVE', 403);
    }

    // Check if student is enrolled in the course
    const { data: enrollment } = await supabase
      .from('matakuliah_diambil')
      .select('*')
      .eq('mahasiswa_id', tokenResult.userId!)
      .eq('matakuliah_id', session.matakuliah_id)
      .single();

    if (!enrollment) {
      return errorResponse('Not enrolled in this course', 'ACCESS_DENIED', 403);
    }

    // Check if already attended this session
    const { data: existingAttendance } = await supabase
      .from('presensi')
      .select('*')
      .eq('mahasiswa_id', tokenResult.userId!)
      .eq('presensi_session_id', session.id)
      .single();

    if (existingAttendance) {
      return errorResponse('Already submitted attendance for this session', 'ALREADY_CHECKED_IN', 400);
    }

    const now = new Date();

    // Insert attendance record
    const { data: attendance, error: insertError } = await supabase
      .from('presensi')
      .insert({
        mahasiswa_id: tokenResult.userId!,
        presensi_session_id: session.id,
        status: attendanceStatus,
        waktu_presensi: now,
      })
      .select()
      .single();

    if (insertError) {
      return errorResponse(insertError.message, 'INSERT_FAILED', 400);
    }

    return successResponse(attendance, `Attendance submitted as ${attendanceStatus}`, 201);
  } catch (err) {
    console.error('Submit attendance error:', err);
    return errorResponse('Failed to submit attendance', 'ATTENDANCE_SUBMIT_ERROR', 500);
  }
}
