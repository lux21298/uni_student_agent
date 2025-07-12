"use client"

import { useState } from "react"
import { GraduationCap, BookOpen, Users, Calendar, DollarSign, TrendingUp } from "lucide-react"

export default function UniversityStudentAgent() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint: string, method = "GET", body?: any) => {
    setLoading(true)
    try {
      const options: RequestInit = { method }
      if (body) {
        options.headers = { "Content-Type": "application/json" }
        options.body = JSON.stringify(body)
      }

      const res = await fetch(endpoint, options)
      const data = await res.json()
      setTestResults({ endpoint, data, status: res.status })
    } catch (error) {
      setTestResults({
        endpoint,
        error: error instanceof Error ? error.message : "Unknown error",
        status: "Error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            University Student Assistant
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Your personal AI agent for managing university life! Track grades, assignments, study groups, campus
            bookings, and finances. Perfect for Australian ICT students! 🇦🇺
          </p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">No API Key Required</span>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Mock Data Demo</span>
            <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
              MCP + ChatGPT Compatible
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Academic Progress Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Progress
              </h2>
              <p className="text-sm text-gray-600">Check GPA, completed subjects, and degree progress</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/profile")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                📊 View Profile & GPA
              </button>
              <button
                onClick={() => testEndpoint("/api/student/profile?include_gpa_breakdown=true")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                📈 Detailed GPA Breakdown
              </button>
              <button
                onClick={() => testEndpoint("/api/student/academic-planning?action=degree_progress")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                🎓 Degree Progress
              </button>
            </div>
          </div>

          {/* Assignment Tracker Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assignment Tracker
              </h2>
              <p className="text-sm text-gray-600">Manage assignments, deadlines, and submissions</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/assignments")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                📝 All Assignments
              </button>
              <button
                onClick={() => testEndpoint("/api/student/assignments?filter=upcoming")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                ⏰ Upcoming Deadlines
              </button>
              <button
                onClick={() =>
                  testEndpoint("/api/student/assignments", "POST", {
                    assignmentId: "a2",
                    status: "completed",
                  })
                }
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                ✅ Mark Assignment Complete
              </button>
            </div>
          </div>

          {/* Study Groups Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Groups
              </h2>
              <p className="text-sm text-gray-600">Join groups, schedule meetings, collaborate</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/study-groups")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                👥 My Study Groups
              </button>
              <button
                onClick={() =>
                  testEndpoint("/api/student/study-groups", "POST", {
                    action: "create",
                    groupName: "AI & Machine Learning Club",
                    subjectCode: "COMP3411",
                  })
                }
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                ➕ Create New Group
              </button>
            </div>
          </div>

          {/* Campus Bookings Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Campus Bookings
              </h2>
              <p className="text-sm text-gray-600">Book study rooms, labs, and facilities</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/bookings")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                🏢 My Bookings
              </button>
              <button
                onClick={() =>
                  testEndpoint("/api/student/bookings", "POST", {
                    facility: "Computer Lab 2",
                    date: "2024-02-25",
                    timeSlot: "14:00-16:00",
                    purpose: "Final project coding session",
                    attendees: 3,
                  })
                }
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                📅 Book Study Room
              </button>
            </div>
          </div>

          {/* Student Finances Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Student Finances
              </h2>
              <p className="text-sm text-gray-600">Track fees, HECS debt, and textbook costs</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/finances")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                💰 Complete Financial Overview
              </button>
              <button
                onClick={() => testEndpoint("/api/student/finances?category=tuition")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                🧾 Tuition Fees Status
              </button>
              <button
                onClick={() => testEndpoint("/api/student/finances?category=hecs")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                🎓 HECS Debt Info
              </button>
            </div>
          </div>

          {/* Academic Planning Card */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-indigo-600 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Academic Planning
              </h2>
              <p className="text-sm text-gray-600">Course recommendations and graduation planning</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint("/api/student/academic-planning?action=recommend_courses&semester=T1 2025")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                💡 Course Recommendations
              </button>
              <button
                onClick={() => testEndpoint("/api/student/academic-planning?action=graduation_check")}
                className="w-full text-left px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                🎯 Graduation Readiness
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">🤖 Connect to ChatGPT</h3>
              <p className="text-sm text-gray-600">
                Use this agent as a ChatGPT Action. Follow the steps to integrate.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Plugin URL:</h4>
                <code className="text-sm bg-white p-2 rounded border block break-all">
                  https://your-app.vercel.app/.well-known/ai-plugin.json
                </code>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Steps to add to ChatGPT:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to ChatGPT Settings → Beta Features</li>
                  <li>Enable "Actions" if not already enabled</li>
                  <li>Create new Action and paste the URL above</li>
                  <li>ChatGPT will auto-configure from the OpenAPI spec</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">🔗 Connect to Claude</h3>
              <p className="text-sm text-gray-600">
                Use this agent via MCP (Model Context Protocol). Follow the steps to integrate.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">MCP Server URL:</h4>
                <code className="text-sm bg-white p-2 rounded border block break-all">
                  https://your-app.vercel.app/api/mcp
                </code>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Add to Claude Desktop config:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {`{
  "mcpServers": {
    "university-assistant": {
      "url": "https://your-app.vercel.app/api/mcp"
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {testResults && (
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🧪 Test Results</h3>
              <p className="text-sm text-gray-600">Response from: {testResults.endpoint}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    testResults.status === 200 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  Status: {testResults.status}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(testResults.data || testResults.error, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">🎯 Why This Agent is Powerful</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🔒 Private Data Access</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Your personal grades and GPA calculations</li>
                  <li>• Assignment deadlines and submission status</li>
                  <li>• Study group memberships and meetings</li>
                  <li>• Campus facility bookings and availability</li>
                  <li>• Financial information (fees, HECS, textbooks)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🚀 Beyond Public APIs</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Personalized academic planning</li>
                  <li>• Context-aware course recommendations</li>
                  <li>• Integrated university systems access</li>
                  <li>• Custom business logic for your institution</li>
                  <li>• Real-time updates to your personal data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
