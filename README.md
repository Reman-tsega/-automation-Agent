AI Agent Project - Executive Assistant Automation
An intelligent AI agent built with Express.js and TypeScript to automate executive assistant tasks including scheduling meetings, sending emails, and processing natural language commands.
🎯 Project Overview
This AI agent serves as an Executive Assistant in a Tech Startup, automating high-impact, repetitive tasks to increase productivity and efficiency.
Core Features

📅 Meeting Scheduling: Automatically schedule meetings using Google Calendar API
📧 Email Automation: Send emails and follow-ups using SendGrid API
🧠 Natural Language Processing: Process commands using Google Gemini API
⏰ Proactive Reminders: Automated daily task reminders and meeting notifications
🌐 REST API: Secure HTTP endpoints with JWT authentication
🔐 Security: Rate limiting, input validation, and helmet for security headers
📈 Task Prioritization: Support for task priorities to focus on critical tasks

🏗️ Architecture
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Express Server│    │   Agent Service │    │   API Clients   │
│   (Port 8080)   │◄──►│   (Main Logic)  │◄──►│  (Calendar,     │
│                 │    │                 │    │   Email, NLP)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Endpoints:    │    │   Components:   │    │   External      │
│ • /health       │    │ • TaskProcessor │    │   APIs:         │
│ • /meetings     │    │ • Scheduler     │    │ • Google        │
│ • /emails       │    │ • Logger        │    │   Calendar      │
│ • /nlp          │    │ • Config        │    │ • SendGrid      │
└─────────────────┘    └─────────────────┘    │ • Gemini        │
                                              └─────────────────┘

🚀 Quick Start
Prerequisites

Node.js 18 or higher
API keys for:
Google Calendar API
SendGrid API
Google Gemini API


JWT secret for authentication

Installation

Clone the repository
git clone https://github.com/reman-tsega/-automation-Agent.git
cd ai-agent


Install dependencies
npm install


Set up environment variablesCreate a .env file:
GOOGLE_CALENDAR_API_KEY=your_calendar_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
SERVER_PORT=8080
LOG_LEVEL=info


Run the application
npm start

you cna use the 
# swager API at
 http://localhost:8080/api-docs/#/
 
Test the health endpoint
curl http://localhost:8080/health -H "Authorization: Bearer your_jwt_token"



📋 API Endpoints
Health Check
GET /health
Authorization: Bearer <jwt_token>

Returns service status.
Schedule Meeting
POST /meetings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "task": "Schedule a meeting with John tomorrow at 2 PM",
  "priority": 2
}

Send Email
POST /emails
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "task": "Send email to client@example.com about project update",
  "priority": 1
}

Process NLP Command
POST /nlp
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "command": "What meetings do I have today?"
}

🔧 Configuration
The agent uses environment variables for configuration:



Variable
Description
Default



GOOGLE_CALENDAR_API_KEY
Google Calendar API key
""


SENDGRID_API_KEY
SendGrid API key
""


GEMINI_API_KEY
Google Gemini API key
""


JWT_SECRET
JWT secret for authentication
Required


SERVER_PORT
HTTP server port
"8080"


LOG_LEVEL
Logging level (info, debug, error)
"info"


🎯 Use Cases
Executive Assistant Tasks Automated

Meeting Management

Schedule meetings based on natural language commands
Send meeting reminders 15 minutes before start
Handle meeting conflicts and rescheduling


Email Automation

Send follow-up emails after meetings
Send daily task reminders
Process email requests via natural language


Task Management

Daily task summaries with priority sorting
Proactive reminders for high-priority tasks
Natural language task creation


Calendar Integration

Sync with Google Calendar
Check availability
Manage recurring meetings



🔄 Proactive Actions
The agent runs proactive tasks in the background:

Daily Reminders: Sends task summaries at 9 AM, prioritizing high-priority tasks
Meeting Alerts: Notifies 15 minutes before meetings
Periodic Checks: Monitors calendar and tasks every minute

🛠️ Development
Project Structure
├── src/
│   ├── config/
│   │   └── config.ts        # Configuration management
│   ├── controllers/
│   │   └── task.controller.ts # HTTP request handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT authentication
│   │   └── error.middleware.ts # Error handling
│   ├── services/
│   │   ├── agent.service.ts  # Main agent logic
│   │   ├── calendar.service.ts # Google Calendar integration
│   │   ├── email.service.ts  # SendGrid integration
│   │   ├── nlp.service.ts    # Gemini NLP integration
│   │   ├── scheduler.ts      # Proactive scheduling
│   │   └── task-processor.ts # Task processing logic
│   ├── types/
│   │   └── task.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── logger.ts        # Logging utilities
│   └── index.ts             # Application entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation

Adding New Features

New API Integration: Add service in src/services/
New Task Type: Update TaskProcessor in src/services/task-processor.ts
New Endpoint: Add handler in src/controllers/task.controller.ts

🧪 Testing
Manual Testing
# Test scheduling
curl -X POST http://localhost:8080/meetings \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"task": "Schedule meeting with team tomorrow at 10 AM", "priority": 2}'

# Test email
curl -X POST http://localhost:8080/emails \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"task": "Send email to john@example.com about project status", "priority": 1}'

# Test NLP
curl -X POST http://localhost:8080/nlp \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"command": "What is my schedule for today?"}'

Unit Testing
npm test

🔒 Security

JWT-based authentication for all endpoints
Rate limiting to prevent abuse
Input validation with express-validator
Helmet for security headers
No hardcoded credentials in source code
Error handling prevents information leakage

📈 Monitoring

Health check endpoint for monitoring
Structured logging with Winston
Error tracking and reporting
Performance metrics via HTTP endpoints

🚀 Deployment
Local Development
npm start

Production Build
npm run build
node dist/index.js

Docker (Future Enhancement)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]

🤝 Contributing

Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

📄 License
This project is licensed under the MIT License.
🆘 Support
For issues and questions:

Create an issue in the GitHub repository
Check the logs for debugging information
Verify API keys and JWT secret are correctly configured


Built with ❤️ using Express.js, TypeScript, and modern automation practices.