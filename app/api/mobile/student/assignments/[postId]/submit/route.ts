// app/api/mobile/student/assignments/[postId]/submit/route.ts - Submit Assignment
import { NextRequest } from 'next/server';
import { verifyToken, checkStudentRole, successResponse, errorResponse, supabase } from '../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
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

    const { postId } = await params;

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('post')
      .select('*')
      .eq('id', postId)
      .single();

    if (assignmentError || !assignment) {
      return errorResponse('Assignment not found', 'ASSIGNMENT_NOT_FOUND', 404);
    }

    // Verify student is enrolled in the class
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('matakuliah_diambil')
      .select('*')
      .eq('mahasiswa_id', tokenResult.userId!)
      .eq('matakuliah_id', assignment.matakuliah_id)
      .single();

    if (enrollmentError || !enrollment) {
      return errorResponse('Not enrolled in this course', 'ACCESS_DENIED', 403);
    }

    // Get student's submission
    const { data: submission, error: submissionError } = await supabase
      .from('tugas_submission')
      .select('*')
      .eq('post_id', postId)
      .eq('mahasiswa_id', tokenResult.userId!)
      .single();

    if (submissionError && submissionError.code !== 'PGRST116') {
      // PGRST116 means no row found, which is okay
      return errorResponse('Failed to fetch submission', 'SUBMISSION_FETCH_ERROR', 400);
    }

    return successResponse({
      assignment,
      submission: submission || null,
    });
  } catch (err) {
    console.error('Get assignment submission error:', err);
    return errorResponse('Failed to fetch assignment submission', 'SUBMISSION_ERROR', 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
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

    const { postId } = await params;
    const body = await request.json();
    const { jawaban_text, jawaban_link } = body;

    if (!jawaban_text && !jawaban_link) {
      return errorResponse(
        'Either jawaban_text or jawaban_link must be provided',
        'MISSING_FIELDS',
        400
      );
    }

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('post')
      .select('*')
      .eq('id', postId)
      .single();

    if (assignmentError || !assignment) {
      return errorResponse('Assignment not found', 'ASSIGNMENT_NOT_FOUND', 404);
    }

    // Verify student is enrolled in the class
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('matakuliah_diambil')
      .select('*')
      .eq('mahasiswa_id', tokenResult.userId!)
      .eq('matakuliah_id', assignment.matakuliah_id)
      .single();

    if (enrollmentError || !enrollment) {
      return errorResponse('Not enrolled in this course', 'ACCESS_DENIED', 403);
    }

    // Check if submission already exists
    const { data: existingSubmission } = await supabase
      .from('tugas_submission')
      .select('*')
      .eq('post_id', postId)
      .eq('mahasiswa_id', tokenResult.userId!)
      .single();

    if (existingSubmission && existingSubmission.graded_at) {
      return errorResponse('Assignment already graded, cannot modify submission', 'SUBMISSION_GRADED', 400);
    }

    // Create or update submission
    if (existingSubmission) {
      const { data: updated, error: updateError } = await supabase
        .from('tugas_submission')
        .update({
          jawaban_text,
          jawaban_link,
          submitted_at: new Date(),
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (updateError) {
        return errorResponse(updateError.message, 'SUBMISSION_UPDATE_ERROR', 400);
      }

      return successResponse(updated, 'Assignment submission updated successfully', 201);
    } else {
      const { data: created, error: createError } = await supabase
        .from('tugas_submission')
        .insert({
          post_id: postId,
          mahasiswa_id: tokenResult.userId!,
          jawaban_text,
          jawaban_link,
          submitted_at: new Date(),
        })
        .select()
        .single();

      if (createError) {
        return errorResponse(createError.message, 'SUBMISSION_CREATE_ERROR', 400);
      }

      return successResponse(created, 'Assignment submitted successfully', 201);
    }
  } catch (err) {
    console.error('Submit assignment error:', err);
    return errorResponse('Failed to submit assignment', 'SUBMISSION_ERROR', 500);
  }
}
