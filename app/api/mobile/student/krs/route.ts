// app/api/mobile/student/krs/route.ts - KRS Management
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

    // Get status filter from query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('matakuliah_diambil')
      .select(`
        id,
        user_id,
        matakuliah_id,
        status,
        created_at,
        updated_at,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk,
          sks,
          semester
        )
      `)
      .eq('user_id', tokenResult.userId!);

    if (status) {
      query = query.eq('status', status.toUpperCase());
    }

    const { data: krs, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return errorResponse(error.message, 'KRS_FETCH_ERROR', 400);
    }

    return successResponse({
      data: krs || [],
      total: (krs || []).length,
    });
  } catch (err) {
    console.error('Get KRS error:', err);
    return errorResponse('Failed to fetch KRS', 'KRS_ERROR', 500);
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
    const { matakuliah_ids } = body;

    if (!Array.isArray(matakuliah_ids) || matakuliah_ids.length === 0) {
      return errorResponse(
        'matakuliah_ids must be a non-empty array',
        'INVALID_INPUT',
        400
      );
    }

    // Check total SKS
    const { data: mkData, error: mkError } = await supabase
      .from('matakuliah')
      .select('sks')
      .in('id', matakuliah_ids);

    if (mkError || !mkData) {
      return errorResponse('Failed to fetch course data', 'COURSE_FETCH_ERROR', 400);
    }

    const totalSks = mkData.reduce((sum: number, mk: any) => sum + mk.sks, 0);

    if (totalSks > 24) {
      return errorResponse(
        `Total SKS (${totalSks}) exceeds maximum of 24`,
        'EXCESS_SKS',
        400
      );
    }

    // Insert KRS records
    const krsRecords = matakuliah_ids.map((mkId: string) => ({
      user_id: tokenResult.userId!,
      matakuliah_id: mkId,
      status: 'PENDING',
      created_at: new Date(),
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('matakuliah_diambil')
      .insert(krsRecords)
      .select();

    if (insertError) {
      return errorResponse(insertError.message, 'INSERT_FAILED', 400);
    }

    return successResponse(
      {
        submitted: (inserted || []).length,
        total_sks: totalSks,
        status: 'PENDING',
      },
      `KRS submitted successfully (${totalSks} SKS)`,
      201
    );
  } catch (err) {
    console.error('Submit KRS error:', err);
    return errorResponse('Failed to submit KRS', 'KRS_SUBMIT_ERROR', 500);
  }
}
