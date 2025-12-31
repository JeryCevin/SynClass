// app/api/mobile/student/presensi-sessions/route.ts - Get Available Attendance Sessions
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
    const tanggal = searchParams.get('tanggal'); // format: YYYY-MM-DD
    const show_past = searchParams.get('show_past') === 'true';

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
      return errorResponse('Not enrolled in this course', 'ACCESS_DENIED', 403);
    }

    let query = supabase
      .from('presensi_session')
      .select(`
        id,
        matakuliah_id,
        pertemuan,
        tanggal,
        waktu_mulai,
        waktu_selesai,
        is_active,
        created_by,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk
        )
      `)
      .in('matakuliah_id', enrolledMatakuliahIds);

    if (matakuliah_id) {
      query = query.eq('matakuliah_id', parseInt(matakuliah_id));
    }

    if (tanggal) {
      query = query.eq('tanggal', tanggal);
    }

    const { data: sessions, error } = await query.order('tanggal', {
      ascending: !show_past, // newest first if showing past, oldest if not
    }).order('waktu_mulai', { ascending: true });

    if (error) {
      return errorResponse(error.message, 'SESSIONS_FETCH_ERROR', 400);
    }

    // Check which sessions student has already attended
    const { data: attendance } = await supabase
      .from('presensi')
      .select('presensi_session_id')
      .eq('mahasiswa_id', tokenResult.userId!);

    const attendedSessionIds = attendance?.map((a: any) => a.presensi_session_id) || [];

    // Merge attendance status
    const sessionsList = (sessions || []).map((session: any) => ({
      ...session,
      has_attended: attendedSessionIds.includes(session.id),
      // Calculate if session is still active (15 minute window after start time)
      is_available_now: (() => {
        try {
          const now = new Date();
          // Handle tanggal format (e.g., "2025-01-15")
          const sessionDate = new Date(session.tanggal);
          
          if (isNaN(sessionDate.getTime())) {
            // If date parsing fails, check only is_active flag
            return session.is_active === true;
          }
          
          // Handle waktu_mulai format (e.g., "08:00:00" or "08:00")
          if (session.waktu_mulai) {
            const timeParts = session.waktu_mulai.split(':');
            const hours = parseInt(timeParts[0]) || 0;
            const minutes = parseInt(timeParts[1]) || 0;
            sessionDate.setHours(hours, minutes, 0, 0);
          }
          
          const sessionEnd = new Date(sessionDate.getTime() + 15 * 60 * 1000); // 15 min window
          return now >= sessionDate && now <= sessionEnd && session.is_active === true;
        } catch {
          return session.is_active === true;
        }
      })(),
    }));

    return successResponse({
      data: sessionsList,
      total: sessionsList.length,
    });
  } catch (err) {
    console.error('Get presensi sessions error:', err);
    return errorResponse('Failed to fetch attendance sessions', 'SESSIONS_ERROR', 500);
  }
}
