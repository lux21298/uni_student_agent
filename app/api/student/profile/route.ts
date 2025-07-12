interface StudentResponse {
    profile: {
      name: string;
      studentId: string;
      degree: string;
      year: number;
      campus: string;
      gpa: number;
    };
    completedSubjects: number;
    currentEnrollment: number;
    totalCredits: number;
    subjects: Array<any>;
    gpaBreakdown?: Array<{
      code: string;
      grade: string;
      points: number;
    }>;
  }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const includeGpaBreakdown = searchParams.get("include_gpa_breakdown") === "true"

  // Mock student data
  const profile = {
    name: "Alex Chen",
    studentId: "s3456789",
    degree: "Bachelor of Information Technology",
    year: 3,
    campus: "Sydney",
    gpa: 6.2,
  }

  const subjects = [
    { code: "COMP3900", name: "Computer Science Project", credits: 6, grade: "HD", semester: "T1 2024" },
    { code: "COMP3311", name: "Database Systems", credits: 6, grade: "DN", semester: "T1 2024" },
    { code: "COMP3331", name: "Computer Networks", credits: 6, grade: "CR", semester: "T2 2024" },
    { code: "COMP3141", name: "Software Engineering", credits: 6, grade: null, semester: "T3 2024" },
  ]

  const completedSubjects = subjects.filter((s) => s.grade)
  const totalCredits = completedSubjects.reduce((sum, s) => sum + s.credits, 0)

  const response: StudentResponse = {
    profile,
    completedSubjects: completedSubjects.length,
    currentEnrollment: subjects.filter((s) => !s.grade).length,
    totalCredits,
    subjects: includeGpaBreakdown ? subjects : subjects.map(({ grade, ...rest }) => rest),
  }

  if (includeGpaBreakdown) {
    const gradePoints: { [key: string]: number } = { HD: 7, DN: 6, CR: 5, PS: 4 }
    response.gpaBreakdown = completedSubjects.map((subject) => ({
      code: subject.code,
      grade: subject.grade || '',
      points: gradePoints[subject.grade || ''] || 0,
    }))
  }

  return Response.json(response)
}
