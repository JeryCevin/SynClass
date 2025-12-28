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
    const kelas_id = searchParams.get('kelas_id');

    let query = supabase
      .from('presensi')
      .select(`
        id,
        user_id,
        presensi_session_id,
        status,
        waktu_presensi,
        presensi_session:presensi_session_id (
          id,
          kelas_id,
          tanggal,
          jam_mulai,
          jam_selesai
        )
      `)
      .eq('user_id', tokenResult.userId!);

    if (kelas_id) {
      query = query.eq('presensi_session.kelas_id', kelas_id);
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
    const { presensi_session_id, kode_presensi } = body;

    if (!presensi_session_id || !kode_presensi) {
      return errorResponse(
        'presensi_session_id and kode_presensi are required',
        'MISSING_FIELDS',
        400
      );
    }

    // Verify session exists and is active
    const { data: session, error: sessionError } = await supabase
      .from('presensi_session')
      .select('*')
      .eq('id', presensi_session_id)
      .single();

    if (sessionError || !session) {
      return errorResponse('Attendance session not found', 'SESSION_NOT_FOUND', 404);
    }

    // Check if session is still active (15 minute window)
    const now = new Date();
    const sessionStart = new Date(session.jam_mulai);
    const sessionEnd = new Date(sessionStart.getTime() + 15 * 60 * 1000);

    if (now < sessionStart || now > sessionEnd) {
      return errorResponse('Attendance window is closed', 'WINDOW_CLOSED', 403);
    }

    // Verify code
    if (kode_presensi !== session.kode_presensi) {
      return errorResponse('Invalid attendance code', 'INVALID_CODE', 403);
    }

    // Insert attendance record
    const { data: attendance, error: insertError } = await supabase
      .from('presensi')
      .insert({
        user_id: tokenResult.userId!,
        presensi_session_id,
        status: 'HADIR',
        waktu_presensi: now,
      })
      .select()
      .single();

    if (insertError) {
      return errorResponse(insertError.message, 'INSERT_FAILED', 400);
    }

    return successResponse(attendance, 'Attendance submitted successfully', 201);
  } catch (err) {
    console.error('Submit attendance error:', err);
    return errorResponse('Failed to submit attendance', 'ATTENDANCE_SUBMIT_ERROR', 500);
  }
}
