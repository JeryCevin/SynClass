// app/api/mobile/student/grades/route.ts - Get Student Grades
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

    // Get all courses taken by student with grades
    let query = supabase
      .from('matakuliah_diambil')
      .select(`
        id,
        mahasiswa_id,
        matakuliah_id,
        semester,
        nilai_huruf,
        nilai_angka,
        created_at,
        matakuliah:matakuliah_id (
          id,
          kode_mk,
          nama_mk,
          sks,
          semester
        )
      `)
      .eq('mahasiswa_id', tokenResult.userId!);

    if (semester) {
      query = query.eq('semester', semester);
    }

    const { data: grades, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return errorResponse(error.message, 'GRADES_FETCH_ERROR', 400);
    }

    const gradesList = grades || [];

    // Calculate GPA for each semester
    const gradesBySemester = gradesList.reduce((acc: any, grade: any) => {
      const sem = grade.semester;
      if (!acc[sem]) {
        acc[sem] = [];
      }
      acc[sem].push(grade);
      return acc;
    }, {});

    // Calculate semester GPA
    const semesterSummary = Object.entries(gradesBySemester).map(([sem, courses]: [string, any]) => {
      const validGrades = courses.filter((c: any) => c.nilai_angka !== null);
      const totalSks = courses.reduce((sum: number, c: any) => sum + (c.matakuliah?.sks || 0), 0);
      const weightedSum = validGrades.reduce((sum: number, c: any) => {
        return sum + (c.nilai_angka * (c.matakuliah?.sks || 0));
      }, 0);
      
      const gpa = totalSks > 0 ? (weightedSum / totalSks).toFixed(2) : '0.00';

      return {
        semester: sem,
        courses_count: courses.length,
        gpa: parseFloat(gpa),
        total_sks: totalSks,
      };
    });

    // Calculate cumulative GPA
    const allValidGrades = gradesList.filter((g: any) => g.nilai_angka !== null);
    const totalAllSks = gradesList.reduce((sum: number, g: any) => sum + (g.matakuliah?.sks || 0), 0);
    const weightedSumAll = allValidGrades.reduce((sum: number, g: any) => {
      return sum + (g.nilai_angka * (g.matakuliah?.sks || 0));
    }, 0);
    
    const cumulativeGpa = totalAllSks > 0 ? (weightedSumAll / totalAllSks).toFixed(2) : '0.00';

    return successResponse({
      grades: gradesList,
      semester_summary: semesterSummary,
      cumulative_gpa: parseFloat(cumulativeGpa),
      total_courses: gradesList.length,
    });
  } catch (err) {
    console.error('Get grades error:', err);
    return errorResponse('Failed to fetch grades', 'GRADES_ERROR', 500);
  }
}
