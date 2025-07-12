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

    const { prompt, context } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user" as const,
          content: context ? `Context: ${context}\n\nUser: ${prompt}` : prompt
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
      response: chatCompletion.choices[0]?.message?.content || ''
    })
  } catch (error) {
    console.error("Agent API error:", error)
    return Response.json({ error: "Failed to get agent response" }, { status: 500 })
  }
}
