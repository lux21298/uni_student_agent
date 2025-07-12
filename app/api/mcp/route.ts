import { z } from "zod"
import { createMcpHandler } from "@vercel/mcp-adapter"

// Mock student data - this would normally come from a database
const mockStudentData = {
  profile: {
    name: "Alex Chen",
    studentId: "s3456789",
    degree: "Bachelor of Information Technology",
    year: 3,
    campus: "Sydney",
    gpa: 6.2,
  },
  subjects: [
    { code: "COMP3900", name: "Computer Science Project", credits: 6, grade: "HD", semester: "T1 2024" },
    { code: "COMP3311", name: "Database Systems", credits: 6, grade: "DN", semester: "T1 2024" },
    { code: "COMP3331", name: "Computer Networks", credits: 6, grade: "CR", semester: "T2 2024" },
    { code: "COMP3141", name: "Software Engineering", credits: 6, grade: null, semester: "T3 2024" },
  ],
  assignments: [
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
  ],
  studyGroups: [
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
  ],
  bookings: [
    {
      id: "b1",
      facility: "Study Room 4A",
      date: "2024-02-21",
      time: "10:00-12:00",
      purpose: "Group project work",
      attendees: 4,
    },
  ],
  finances: {
    tuitionFees: {
      total: 12500,
      paid: 8000,
      due: 4500,
      dueDate: "2024-03-15",
    },
    hecs: {
      totalDebt: 45000,
      thisYearContribution: 12500,
    },
    textbooks: [
      { title: "Database System Concepts", cost: 180, purchased: true },
      { title: "Computer Networks: A Top-Down Approach", cost: 220, purchased: false },
    ],
  },
}

// Create the MCP handler
const handler = createMcpHandler(
  (server) => {
    // Get student profile and academic progress
    server.tool(
      "get_student_profile",
      "Get student profile information including GPA, degree progress, and academic standing",
      {
        include_gpa_breakdown: z.boolean().optional().describe("Include detailed GPA calculation"),
      },
      async ({ include_gpa_breakdown }) => {
        const profile = mockStudentData.profile
        const completedSubjects = mockStudentData.subjects.filter((s) => s.grade)

        let response = `Student Profile:
Name: ${profile.name}
Student ID: ${profile.studentId}
Degree: ${profile.degree} (Year ${profile.year})
Campus: ${profile.campus}
Current GPA: ${profile.gpa}/7.0

Academic Progress:
- Completed subjects: ${completedSubjects.length}
- Current enrollment: ${mockStudentData.subjects.filter((s) => !s.grade).length} subjects
- Total credits completed: ${completedSubjects.reduce((sum, s) => sum + s.credits, 0)}`

        if (include_gpa_breakdown) {
          response += `\n\nGPA Breakdown:`
          completedSubjects.forEach((subject) => {
            const gradePoints: { [key: string]: number } = { HD: 7, DN: 6, CR: 5, PS: 4 };
            const points = gradePoints[subject.grade || ''] || 0;
            response += `\n- ${subject.code}: ${subject.grade} (${points}/7)`
          })
        }

        return {
          content: [{ type: "text", text: response }],
        }
      },
    )

    // Manage assignments and deadlines
    server.tool(
      "manage_assignments",
      "View, update, or track assignment progress and deadlines",
      {
        action: z.enum(["list", "update_status", "add_reminder", "get_upcoming"]).describe("Action to perform"),
        assignment_id: z.string().optional().describe("Assignment ID for update actions"),
        new_status: z
          .enum(["not_started", "in_progress", "completed", "submitted"])
          .optional()
          .describe("New status for assignment"),
        days_ahead: z.number().optional().describe("Days ahead to check for upcoming assignments"),
      },
      async ({ action, assignment_id, new_status, days_ahead = 7 }) => {
        switch (action) {
          case "list":
            let listResponse = "📚 Your Assignments:\n\n"
            mockStudentData.assignments.forEach((assignment) => {
              const statusEmoji = {
                submitted: "✅",
                in_progress: "🔄",
                not_started: "⏳",
                completed: "✔️",
              }[assignment.status]

              listResponse += `${statusEmoji} ${assignment.title} (${assignment.subject})
Due: ${new Date(assignment.dueDate).toLocaleDateString("en-AU")}
Status: ${assignment.status.replace("_", " ")}
${assignment.submittedAt ? `Submitted: ${new Date(assignment.submittedAt).toLocaleString("en-AU")}` : ""}

`
            })
            return { content: [{ type: "text", text: listResponse }] }

          case "update_status":
            if (!assignment_id || !new_status) {
              return { content: [{ type: "text", text: "❌ Assignment ID and new status required" }] }
            }
            const assignment = mockStudentData.assignments.find((a) => a.id === assignment_id)
            if (!assignment) {
              return { content: [{ type: "text", text: "❌ Assignment not found" }] }
            }
            assignment.status = new_status
            if (new_status === "submitted") {
              assignment.submittedAt = new Date().toISOString()
            }
            return {
              content: [
                {
                  type: "text",
                  text: `✅ Updated "${assignment.title}" status to: ${new_status.replace("_", " ")}`,
                },
              ],
            }

          case "get_upcoming":
            const upcoming = mockStudentData.assignments.filter((a) => {
              const dueDate = new Date(a.dueDate)
              const today = new Date()
              const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              return diffDays <= days_ahead && diffDays >= 0 && a.status !== "submitted"
            })

            if (upcoming.length === 0) {
              return {
                content: [{ type: "text", text: `🎉 No assignments due in the next ${days_ahead} days!` }],
              }
            }

            let upcomingResponse = `⚠️ Assignments due in the next ${days_ahead} days:\n\n`
            upcoming.forEach((assignment) => {
              const daysUntilDue = Math.ceil(
                (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              upcomingResponse += `🔥 ${assignment.title} (${assignment.subject})
Due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""} - ${new Date(assignment.dueDate).toLocaleDateString("en-AU")}
Status: ${assignment.status.replace("_", " ")}

`
            })
            return { content: [{ type: "text", text: upcomingResponse }] }

          default:
            return { content: [{ type: "text", text: "❌ Invalid action" }] }
        }
      },
    )

    // Study group management
    server.tool(
      "manage_study_groups",
      "Join, create, or manage study groups and meetings",
      {
        action: z
          .enum(["list", "create", "join", "schedule_meeting", "get_next_meetings"])
          .describe("Action to perform"),
        group_name: z.string().optional().describe("Study group name"),
        subject_code: z.string().optional().describe("Subject code for the study group"),
        meeting_time: z.string().optional().describe("Meeting time in ISO format"),
        location: z.string().optional().describe("Meeting location"),
      },
      async ({ action, group_name, subject_code, meeting_time, location }) => {
        switch (action) {
          case "list":
            let listResponse = "👥 Your Study Groups:\n\n"
            mockStudentData.studyGroups.forEach((group) => {
              listResponse += `📖 ${group.name} (${group.subject})
Members: ${group.members.join(", ")}
Next meeting: ${new Date(group.nextMeeting).toLocaleString("en-AU")}
Location: ${group.location}

`
            })
            return { content: [{ type: "text", text: listResponse }] }

          case "create":
            if (!group_name || !subject_code) {
              return { content: [{ type: "text", text: "❌ Group name and subject code required" }] }
            }
            const newGroup = {
              id: `sg${Date.now()}`,
              name: group_name,
              subject: subject_code,
              members: [mockStudentData.profile.name],
              nextMeeting: meeting_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              location: location || "TBD",
            }
            mockStudentData.studyGroups.push(newGroup)
            return {
              content: [
                {
                  type: "text",
                  text: `✅ Created study group "${group_name}" for ${subject_code}!\nYou're the first member. Share the group ID: ${newGroup.id}`,
                },
              ],
            }

          case "get_next_meetings":
            const nextMeetings = mockStudentData.studyGroups
              .filter((group) => new Date(group.nextMeeting) > new Date())
              .sort((a, b) => new Date(a.nextMeeting).getTime() - new Date(b.nextMeeting).getTime())

            if (nextMeetings.length === 0) {
              return { content: [{ type: "text", text: "📅 No upcoming study group meetings scheduled" }] }
            }

            let meetingsResponse = "📅 Upcoming Study Group Meetings:\n\n"
            nextMeetings.forEach((group) => {
              const timeUntil = Math.ceil(
                (new Date(group.nextMeeting).getTime() - new Date().getTime()) / (1000 * 60 * 60),
              )
              meetingsResponse += `⏰ ${group.name}
Subject: ${group.subject}
Time: ${new Date(group.nextMeeting).toLocaleString("en-AU")} (in ${timeUntil} hours)
Location: ${group.location}
Members: ${group.members.length}

`
            })
            return { content: [{ type: "text", text: meetingsResponse }] }

          default:
            return { content: [{ type: "text", text: "❌ Invalid action" }] }
        }
      },
    )

    // Campus facility booking
    server.tool(
      "manage_facility_bookings",
      "Book study rooms, labs, or other campus facilities",
      {
        action: z.enum(["list", "book", "cancel", "check_availability"]).describe("Action to perform"),
        facility: z.string().optional().describe("Facility name to book"),
        date: z.string().optional().describe("Date in YYYY-MM-DD format"),
        time_slot: z.string().optional().describe("Time slot (e.g., '10:00-12:00')"),
        purpose: z.string().optional().describe("Purpose of booking"),
        attendees: z.number().optional().describe("Number of attendees"),
      },
      async ({ action, facility, date, time_slot, purpose, attendees }) => {
        switch (action) {
          case "list":
            let listResponse = "🏢 Your Facility Bookings:\n\n"
            mockStudentData.bookings.forEach((booking) => {
              listResponse += `📍 ${booking.facility}
Date: ${new Date(booking.date).toLocaleDateString("en-AU")}
Time: ${booking.time}
Purpose: ${booking.purpose}
Attendees: ${booking.attendees}

`
            })
            return { content: [{ type: "text", text: listResponse }] }

          case "book":
            if (!facility || !date || !time_slot) {
              return { content: [{ type: "text", text: "❌ Facility, date, and time slot required" }] }
            }
            const newBooking = {
              id: `b${Date.now()}`,
              facility,
              date,
              time: time_slot,
              purpose: purpose || "Study session",
              attendees: attendees || 1,
            }
            mockStudentData.bookings.push(newBooking)
            return {
              content: [
                {
                  type: "text",
                  text: `✅ Booked ${facility} for ${new Date(date).toLocaleDateString("en-AU")} at ${time_slot}
Purpose: ${newBooking.purpose}
Booking ID: ${newBooking.id}

Remember to bring your student ID for access!`,
                },
              ],
            }

          case "check_availability":
            const availableRooms = [
              "Study Room 1A",
              "Study Room 2B",
              "Study Room 3C",
              "Computer Lab 1",
              "Group Discussion Room",
              "Quiet Study Pod 5",
            ]
            const randomAvailable = availableRooms.slice(0, Math.floor(Math.random() * 4) + 2)
            return {
              content: [
                {
                  type: "text",
                  text: `🔍 Available facilities for ${date || "today"}:\n\n${randomAvailable.map((room) => `✅ ${room}`).join("\n")}\n\nTo book, use the 'book' action with your preferred facility.`,
                },
              ],
            }

          default:
            return { content: [{ type: "text", text: "❌ Invalid action" }] }
        }
      },
    )

    // Financial tracking
    server.tool(
      "check_student_finances",
      "Check tuition fees, HECS debt, textbook costs, and payment deadlines",
      {
        category: z
          .enum(["all", "tuition", "hecs", "textbooks", "payment_plan"])
          .optional()
          .describe("Financial category to check"),
      },
      async ({ category = "all" }) => {
        const finances = mockStudentData.finances

        if (category === "tuition" || category === "all") {
          const tuitionInfo = `💰 Tuition Fees (Current Year):
Total: $${finances.tuitionFees.total.toLocaleString()}
Paid: $${finances.tuitionFees.paid.toLocaleString()}
Outstanding: $${finances.tuitionFees.due.toLocaleString()}
Due Date: ${new Date(finances.tuitionFees.dueDate).toLocaleDateString("en-AU")}

${finances.tuitionFees.due > 0 ? "⚠️ Payment required before due date to avoid late fees!" : "✅ All tuition fees paid!"}`

          if (category === "tuition") {
            return { content: [{ type: "text", text: tuitionInfo }] }
          }
        }

        if (category === "hecs" || category === "all") {
          const hecsInfo = `🎓 HECS-HELP Information:
Total HECS Debt: $${finances.hecs.totalDebt.toLocaleString()}
This Year's Contribution: $${finances.hecs.thisYearContribution.toLocaleString()}

💡 Remember: HECS repayments start when your income exceeds $51,550 (2024 threshold)`

          if (category === "hecs") {
            return { content: [{ type: "text", text: hecsInfo }] }
          }
        }

        if (category === "textbooks" || category === "all") {
          let textbookInfo = "📚 Textbook Expenses:\n\n"
          let totalCost = 0
          let purchasedCost = 0

          finances.textbooks.forEach((book) => {
            totalCost += book.cost
            if (book.purchased) purchasedCost += book.cost
            textbookInfo += `${book.purchased ? "✅" : "❌"} ${book.title} - $${book.cost}\n`
          })

          textbookInfo += `\nTotal textbook budget: $${totalCost}
Purchased: $${purchasedCost}
Remaining: $${totalCost - purchasedCost}`

          if (category === "textbooks") {
            return { content: [{ type: "text", text: textbookInfo }] }
          }
        }

        // Return all information
        return {
          content: [
            {
              type: "text",
              text: `💰 Complete Financial Overview:

TUITION FEES:
Total: $${finances.tuitionFees.total.toLocaleString()}
Outstanding: $${finances.tuitionFees.due.toLocaleString()}
Due: ${new Date(finances.tuitionFees.dueDate).toLocaleDateString("en-AU")}

HECS DEBT:
Total: $${finances.hecs.totalDebt.toLocaleString()}
This year: $${finances.hecs.thisYearContribution.toLocaleString()}

TEXTBOOKS:
Total budget: $${finances.textbooks.reduce((sum, book) => sum + book.cost, 0)}
Purchased: $${finances.textbooks.filter((book) => book.purchased).reduce((sum, book) => sum + book.cost, 0)}

${finances.tuitionFees.due > 0 ? "⚠️ Don't forget your upcoming tuition payment!" : "✅ Finances looking good!"}`,
            },
          ],
        }
      },
    )

    // Academic planning and course recommendations
    server.tool(
      "academic_planner",
      "Get course recommendations, plan future semesters, and track degree progress",
      {
        action: z
          .enum(["degree_progress", "recommend_courses", "plan_semester", "graduation_check"])
          .describe("Planning action"),
        semester: z.string().optional().describe("Semester to plan for (e.g., 'T1 2025')"),
        interests: z.string().optional().describe("Areas of interest for course recommendations"),
      },
      async ({ action, semester, interests }) => {
        const completedCredits = mockStudentData.subjects.filter((s) => s.grade).reduce((sum, s) => sum + s.credits, 0)
        const totalRequired = 144 // Typical IT degree requirement

        switch (action) {
          case "degree_progress":
            const progressPercent = Math.round((completedCredits / totalRequired) * 100)
            return {
              content: [
                {
                  type: "text",
                  text: `🎓 Degree Progress (${mockStudentData.profile.degree}):

Credits completed: ${completedCredits}/${totalRequired} (${progressPercent}%)
Current year: ${mockStudentData.profile.year}/3
Estimated graduation: ${progressPercent >= 75 ? "End of 2024" : "Mid 2025"}

Progress bar: ${"█".repeat(Math.floor(progressPercent / 10))}${"░".repeat(10 - Math.floor(progressPercent / 10))} ${progressPercent}%

${progressPercent >= 90 ? "🎉 Almost there! Time to think about graduation!" : progressPercent >= 75 ? "💪 Final stretch! You've got this!" : "📚 Keep up the great work!"}`,
                },
              ],
            }

          case "recommend_courses":
            const availableCourses = [
              { code: "COMP3421", name: "Computer Graphics", credits: 6, difficulty: "Medium", prereq: "COMP2521" },
              { code: "COMP3511", name: "Human Computer Interaction", credits: 6, difficulty: "Easy", prereq: "None" },
              { code: "COMP4920", name: "Professional Issues", credits: 3, difficulty: "Easy", prereq: "Final year" },
              { code: "COMP3821", name: "Extended Algorithms", credits: 6, difficulty: "Hard", prereq: "COMP3121" },
              {
                code: "COMP4121",
                name: "Advanced Algorithms",
                credits: 6,
                difficulty: "Very Hard",
                prereq: "COMP3821",
              },
            ]

            let recommendations = `💡 Course Recommendations for ${semester || "next semester"}:\n\n`

            if (interests?.toLowerCase().includes("graphics") || interests?.toLowerCase().includes("visual")) {
              recommendations += "🎨 Based on your interest in graphics:\n"
              recommendations += "✅ COMP3421 - Computer Graphics (6 credits, Medium difficulty)\n\n"
            }

            recommendations += "📋 General recommendations:\n"
            availableCourses.slice(0, 3).forEach((course) => {
              recommendations += `• ${course.code} - ${course.name}
  Credits: ${course.credits} | Difficulty: ${course.difficulty}
  Prerequisites: ${course.prereq}

`
            })

            return { content: [{ type: "text", text: recommendations }] }

          case "graduation_check":
            const remainingCredits = totalRequired - completedCredits
            const semestersLeft = Math.ceil(remainingCredits / 18) // Assuming 18 credits per semester

            return {
              content: [
                {
                  type: "text",
                  text: `🎓 Graduation Readiness Check:

Credits needed: ${remainingCredits}
Estimated semesters remaining: ${semestersLeft}
Current GPA: ${mockStudentData.profile.gpa}/7.0 ${mockStudentData.profile.gpa >= 5.0 ? "✅" : "⚠️"}

Requirements status:
✅ Core subjects: Complete
✅ Mathematics requirements: Complete
${remainingCredits <= 24 ? "✅" : "⏳"} Electives: ${remainingCredits <= 24 ? "Complete" : `${Math.max(0, remainingCredits - 18)} credits remaining`}
✅ Professional development: Complete

${remainingCredits === 0 ? "🎉 Ready to graduate! Contact student services to apply." : `📚 ${remainingCredits} more credits to go! You're ${Math.round(((totalRequired - remainingCredits) / totalRequired) * 100)}% there!`}`,
                },
              ],
            }

          default:
            return { content: [{ type: "text", text: "❌ Invalid planning action" }] }
        }
      },
    )
  },
  {},
  { basePath: "/api" },
)

export { handler as GET, handler as POST, handler as DELETE }
