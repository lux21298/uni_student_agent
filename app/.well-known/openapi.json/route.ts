export async function GET() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: "University Student Assistant API",
      description:
        "Personal university assistant for Australian ICT students - manage academics, assignments, study groups, and more!",
      version: "1.0.0",
      contact: {
        email: "support@university-assistant.edu.au",
      },
    },
    servers: [
      {
        url: `${baseUrl}/api/student`,
        description: "Student services server",
      },
    ],
    paths: {
      "/profile": {
        get: {
          operationId: "getStudentProfile",
          summary: "Get student profile and academic progress",
          description: "Retrieve student information, GPA, degree progress, and academic standing",
          parameters: [
            {
              name: "include_gpa_breakdown",
              in: "query",
              required: false,
              description: "Include detailed GPA calculation breakdown",
              schema: {
                type: "boolean",
                default: false,
              },
            },
          ],
          responses: {
            "200": {
              description: "Student profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      studentId: { type: "string" },
                      degree: { type: "string" },
                      year: { type: "number" },
                      gpa: { type: "number" },
                      subjects: { type: "array" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/assignments": {
        get: {
          operationId: "getAssignments",
          summary: "Get assignment list and deadlines",
          description: "View all assignments with status and upcoming deadlines",
          parameters: [
            {
              name: "filter",
              in: "query",
              required: false,
              description: "Filter assignments by status",
              schema: {
                type: "string",
                enum: ["all", "upcoming", "overdue", "submitted"],
                default: "all",
              },
            },
          ],
          responses: {
            "200": {
              description: "Assignments retrieved successfully",
            },
          },
        },
        post: {
          operationId: "updateAssignment",
          summary: "Update assignment status",
          description: "Update the status of an assignment or add reminders",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    assignmentId: { type: "string" },
                    status: {
                      type: "string",
                      enum: ["not_started", "in_progress", "completed", "submitted"],
                    },
                  },
                  required: ["assignmentId", "status"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Assignment updated successfully",
            },
          },
        },
      },
      "/study-groups": {
        get: {
          operationId: "getStudyGroups",
          summary: "Get study groups and meetings",
          description: "View your study groups and upcoming meetings",
          responses: {
            "200": {
              description: "Study groups retrieved successfully",
            },
          },
        },
        post: {
          operationId: "manageStudyGroup",
          summary: "Create or join study groups",
          description: "Create new study groups or manage existing ones",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    action: {
                      type: "string",
                      enum: ["create", "join", "schedule_meeting"],
                    },
                    groupName: { type: "string" },
                    subjectCode: { type: "string" },
                    meetingTime: { type: "string" },
                    location: { type: "string" },
                  },
                  required: ["action"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Study group action completed successfully",
            },
          },
        },
      },
      "/bookings": {
        get: {
          operationId: "getFacilityBookings",
          summary: "Get facility bookings",
          description: "View your current facility bookings and check availability",
          responses: {
            "200": {
              description: "Bookings retrieved successfully",
            },
          },
        },
        post: {
          operationId: "bookFacility",
          summary: "Book campus facilities",
          description: "Book study rooms, labs, or other campus facilities",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    facility: { type: "string" },
                    date: { type: "string", format: "date" },
                    timeSlot: { type: "string" },
                    purpose: { type: "string" },
                    attendees: { type: "number" },
                  },
                  required: ["facility", "date", "timeSlot"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Facility booked successfully",
            },
          },
        },
      },
      "/finances": {
        get: {
          operationId: "getStudentFinances",
          summary: "Check student finances",
          description: "View tuition fees, HECS debt, textbook costs, and payment deadlines",
          parameters: [
            {
              name: "category",
              in: "query",
              required: false,
              description: "Financial category to check",
              schema: {
                type: "string",
                enum: ["all", "tuition", "hecs", "textbooks"],
                default: "all",
              },
            },
          ],
          responses: {
            "200": {
              description: "Financial information retrieved successfully",
            },
          },
        },
      },
      "/academic-planning": {
        get: {
          operationId: "getAcademicPlan",
          summary: "Academic planning and course recommendations",
          description: "Get degree progress, course recommendations, and graduation planning",
          parameters: [
            {
              name: "action",
              in: "query",
              required: true,
              description: "Planning action to perform",
              schema: {
                type: "string",
                enum: ["degree_progress", "recommend_courses", "graduation_check"],
              },
            },
            {
              name: "semester",
              in: "query",
              required: false,
              description: "Semester to plan for",
              schema: {
                type: "string",
                example: "T1 2025",
              },
            },
            {
              name: "interests",
              in: "query",
              required: false,
              description: "Areas of interest for course recommendations",
              schema: {
                type: "string",
                example: "graphics, machine learning",
              },
            },
          ],
          responses: {
            "200": {
              description: "Academic planning information retrieved successfully",
            },
          },
        },
      },
    },
  }

  return Response.json(openApiSpec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
