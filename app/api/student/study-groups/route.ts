const mockStudyGroups = [
  {
    id: "sg1",
    name: "COMP3141 Study Squad",
    subject: "COMP3141",
    members: ["Alex Chen", "Sarah Kim", "James Wilson", "Priya Patel"],
    nextMeeting: "2024-02-20T14:00:00Z",
    location: "Library Level 3, Room 301",
  },
  {
    id: "sg2",
    name: "Database Legends",
    subject: "COMP3311",
    members: ["Alex Chen", "Mike Zhang", "Emma Thompson"],
    nextMeeting: "2024-02-22T16:00:00Z",
    location: "CSE Building, Room 201",
  },
]

export async function GET() {
  const upcomingMeetings = mockStudyGroups.filter((group) => new Date(group.nextMeeting) > new Date())

  return Response.json({
    studyGroups: mockStudyGroups,
    upcomingMeetings,
    totalGroups: mockStudyGroups.length,
  })
}

export async function POST(request: Request) {
  const { action, groupName, subjectCode, meetingTime, location } = await request.json()

  switch (action) {
    case "create":
      if (!groupName || !subjectCode) {
        return Response.json({ error: "Group name and subject code required" }, { status: 400 })
      }

      const newGroup = {
        id: `sg${Date.now()}`,
        name: groupName,
        subject: subjectCode,
        members: ["Alex Chen"],
        nextMeeting: meetingTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: location || "TBD",
      }

      mockStudyGroups.push(newGroup)

      return Response.json({
        success: true,
        message: `Created study group "${groupName}" for ${subjectCode}!`,
        group: newGroup,
      })

    case "schedule_meeting":
      // Implementation for scheduling meetings
      return Response.json({
        success: true,
        message: "Meeting scheduled successfully!",
      })

    default:
      return Response.json({ error: "Invalid action" }, { status: 400 })
  }
}
