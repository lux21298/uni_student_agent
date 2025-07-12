# University Student Agent with MCP Support

This project implements an intelligent university student assistant using Groq's LLaMA model and Vercel's AI SDK with Model Context Protocol (MCP) support. It provides comprehensive tools and services to help students manage their academic life efficiently.

## Features

- **AI Assistant**: Powered by Groq's LLaMA model for intelligent responses and analysis
- **Academic Management**: Track courses, grades, and degree progress
- **Study Groups**: Create and manage study groups and meetings
- **Facility Booking**: Book study rooms and campus facilities
- **Financial Tracking**: Monitor tuition fees, HECS debt, and expenses
- **Assignment Management**: Track deadlines and submissions
- **MCP Integration**: Seamlessly integrates with other AI systems via Model Context Protocol
- **Vercel Deployment**: Optimized for serverless deployment

## Setup

1. **Environment Variables**: Add your Groq API key to your Vercel project:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

2. **Install Dependencies**: 
   ```bash
   pnpm install
   ```

3. **Deploy to Vercel**: 
   ```bash
   vercel deploy
   ```

4. **Get your MCP URL**: After deployment, your MCP server will be available at:
   ```
   https://your-app.vercel.app/api/mcp
   ```

## Available Tools

### Academic Tools
- **get_student_profile**: View academic profile, GPA, and degree progress
- **manage_assignments**: Track and update assignment status
- **academic_planner**: Plan courses and check graduation requirements
- **manage_study_groups**: Create and manage study groups

### Campus Services
- **manage_facility_bookings**: Book study rooms and labs
- **check_student_finances**: Monitor fees, HECS, and expenses

### AI Assistant Features
- **ai_assistant**: Get help with studies and academic questions
- **analyze_code**: Code review and programming assistance

## API Routes

- `/api/student/profile`: Student profile and academic information
- `/api/student/assignments`: Assignment management
- `/api/student/study-groups`: Study group coordination
- `/api/student/bookings`: Facility booking system
- `/api/student/finances`: Financial tracking
- `/api/student/academic-planning`: Course planning and recommendations

## Technologies Used

- **Frontend**: Next.js 15.1.0
- **AI Model**: Groq LLaMA 3.3 70B
- **Authentication**: Vercel
- **Deployment**: Vercel Serverless Functions

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with your Groq API key
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Testing

1. Use the web interface at your deployed URL
2. Test the MCP server with the MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector@latest https://your-app.vercel.app/api/mcp
   ```

## Architecture

- **Next.js API Routes**: Handle both direct API calls and MCP protocol
- **Groq Integration**: Powers the AI features with LLaMA model
- **MCP Adapter**: Bridges AI tools to MCP protocol
- **Vercel Functions**: Serverless deployment with extended duration support

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
