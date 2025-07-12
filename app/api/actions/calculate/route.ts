export async function POST(request: Request) {
  try {
    const { expression } = await request.json()

    if (!expression) {
      return Response.json({ error: "Expression is required" }, { status: 400 })
    }

    try {
      // Simple math evaluation (use a proper parser in production)
      const result = eval(expression.replace(/[^0-9+\-*/().\s]/g, ""))

      if (typeof result !== "number" || !isFinite(result)) {
        throw new Error("Invalid result")
      }

      return Response.json({
        expression,
        result,
      })
    } catch (evalError) {
      return Response.json({ error: "Invalid mathematical expression" }, { status: 400 })
    }
  } catch (error) {
    console.error("Calculate API error:", error)
    return Response.json({ error: "Failed to perform calculation" }, { status: 500 })
  }
}
