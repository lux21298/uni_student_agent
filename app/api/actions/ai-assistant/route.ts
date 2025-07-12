import { generateText, tool } from "ai"
import { Groq } from 'groq-sdk'
import { z } from "zod"

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Groq API key not configured. Please add GROQ_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { query, context } = await request.json()

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    // Create the chat completion with Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user" as const,
          content: context ? `Context: ${context}\n\nQuery: ${query}` : query
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    // Process tools and reasoning steps if needed
    const result = {
      text: chatCompletion.choices[0]?.message?.content || '',
      steps: [] // Groq doesn't provide step-by-step reasoning by default
    };

    return Response.json({
      response: result.text,
      reasoning_steps: ['Generated response using LLaMA model'],
    })
  } catch (error) {
    console.error("AI Assistant API error:", error)
    return Response.json({ error: "Failed to get AI assistance" }, { status: 500 })
  }
}
