const mockAssignments = [
  {
    id: "a1",
    subject: "COMP3141",
    title: "Agile Development Sprint 1",
    dueDate: "2024-02-15",
    status: "submitted",
    grade: null,
    submittedAt: "2024-02-14T23:45:00Z",
  },
  {
    id: "a2",
    subject: "COMP3141",
    title: "System Architecture Design",
    dueDate: "2024-02-28",
    status: "in_progress",
    grade: null,
    submittedAt: null,
  },
  {
    id: "a3",
    subject: "COMP3331",
    title: "Network Protocol Analysis",
    dueDate: "2024-03-05",
    status: "not_started",
    grade: null,
    submittedAt: null,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter") || "all"

  let filteredAssignments = mockAssignments

  if (filter === "upcoming") {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    filteredAssignments = mockAssignments.filter((a) => {
      const dueDate = new Date(a.dueDate)
      return dueDate >= now && dueDate <= weekFromNow && a.status !== "submitted"
    })
  } else if (filter === "submitted") {
    filteredAssignments = mockAssignments.filter((a) => a.status === "submitted")
  }

  return Response.json({
    assignments: filteredAssignments,
    summary: {
      total: mockAssignments.length,
      submitted: mockAssignments.filter((a) => a.status === "submitted").length,
      inProgress: mockAssignments.filter((a) => a.status === "in_progress").length,
      notStarted: mockAssignments.filter((a) => a.status === "not_started").length,
    },
  })
}

export async function POST(request: Request) {
  const { assignmentId, status } = await request.json()

  const assignment = mockAssignments.find((a) => a.id === assignmentId)
  if (!assignment) {
    return Response.json({ error: "Assignment not found" }, { status: 404 })
  }

  assignment.status = status
  if (status === "submitted") {
    assignment.submittedAt = new Date().toISOString()
  }

  return Response.json({
    success: true,
    message: `Updated "${assignment.title}" status to: ${status.replace("_", " ")}`,
    assignment,
  })
}
