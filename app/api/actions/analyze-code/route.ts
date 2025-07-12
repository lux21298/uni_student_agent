import { generateText } from "ai"
import { Groq } from 'groq-sdk'

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Groq API key not configured. Please add GROQ_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const { code, analysis_type, language } = await request.json()

    if (!code || !analysis_type) {
      return Response.json({ error: "Code and analysis type are required" }, { status: 400 })
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user" as const,
          content: `Perform a ${analysis_type} analysis of this ${language || "code"}:\n\n${code}\n\nProvide specific suggestions and explanations.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    return Response.json({
      analysis: chatCompletion.choices[0]?.message?.content || ''
    })
  } catch (error) {
    console.error("Code analysis API error:", error)
    return Response.json({ error: "Failed to analyze code" }, { status: 500 })
  }
}
