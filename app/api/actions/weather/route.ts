export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    if (!location) {
      return Response.json({ error: "Location parameter is required" }, { status: 400 })
    }

    // Simulate weather API call
    const temperature = 15 + Math.floor(Math.random() * 25)
    const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"][Math.floor(Math.random() * 4)]
    const humidity = Math.floor(Math.random() * 100)

    return Response.json({
      location,
      temperature,
      conditions,
      humidity,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return Response.json({ error: "Failed to get weather information" }, { status: 500 })
  }
}
