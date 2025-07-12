export async function GET() {
  const pluginManifest = {
    schema_version: "v1",
    name_for_human: "University Student Assistant",
    name_for_model: "universityStudentAssistant",
    description_for_human:
      "Your personal university assistant for managing grades, assignments, study groups, campus bookings, and finances",
    description_for_model:
      "A comprehensive university student management system that helps with academic tracking, assignment management, study group coordination, facility booking, financial planning, and degree progress monitoring. Perfect for Australian university students.",
    api: {
      type: "openapi",
      url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/.well-known/openapi.json`,
      is_user_authenticated: false,
    },
    auth: {
      type: "none",
    },
    logo_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/logo.png`,
    contact_email: "support@university-assistant.edu.au",
    legal_info_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/legal`,
  }

  return Response.json(pluginManifest, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
