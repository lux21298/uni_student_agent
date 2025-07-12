export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const semester = searchParams.get("semester")
  const interests = searchParams.get("interests")

  const completedCredits = 108 // Mock completed credits
  const totalRequired = 144

  switch (action) {
    case "degree_progress":
      const progressPercent = Math.round((completedCredits / totalRequired) * 100)
      return Response.json({
        completedCredits,
        totalRequired,
        progressPercent,
        estimatedGraduation: progressPercent >= 75 ? "End of 2024" : "Mid 2025",
        currentYear: 3,
      })

    case "recommend_courses":
      const availableCourses = [
        { code: "COMP3421", name: "Computer Graphics", credits: 6, difficulty: "Medium" },
        { code: "COMP3511", name: "Human Computer Interaction", credits: 6, difficulty: "Easy" },
        { code: "COMP4920", name: "Professional Issues", credits: 3, difficulty: "Easy" },
      ]

      let recommendations = availableCourses
      if (interests?.includes("graphics")) {
        recommendations = recommendations.filter((course) => course.code === "COMP3421")
      }

      return Response.json({
        semester: semester || "next semester",
        recommendations: recommendations.slice(0, 3),
        interests,
      })

    case "graduation_check":
      const remainingCredits = totalRequired - completedCredits
      const semestersLeft = Math.ceil(remainingCredits / 18)

      return Response.json({
        remainingCredits,
        semestersLeft,
        readyToGraduate: remainingCredits === 0,
        requirements: {
          coreSubjects: "Complete",
          mathematics: "Complete",
          electives: remainingCredits <= 24 ? "Complete" : `${remainingCredits - 18} credits remaining`,
          professionalDevelopment: "Complete",
        },
      })

    default:
      return Response.json({ error: "Invalid action" }, { status: 400 })
  }
}
