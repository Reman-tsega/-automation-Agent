Software Requirements Specification (SRS)
1. Introduction
1.1 Purpose
This SRS document outlines the requirements and design for an AI-driven executive assistant agent for a tech startup. The agent automates repetitive tasks such as meeting scheduling, email sending, and natural language command processing to enhance productivity.
1.2 Scope
The AI agent targets the role of an executive assistant in a tech startup, automating high-impact tasks using free-tier APIs. It provides a secure REST API with Swagger documentation and operates proactively with scheduled tasks.
1.3 Role and Industry Selection

Role: Executive Assistant
Industry: Tech Startup
Rationale: Executive assistants in tech startups manage repetitive tasks like scheduling and communication, ideal for AI automation in a fast-paced environment.

2. Requirements
2.1 Functional Requirements

Meeting Scheduling:
Parse natural language commands to schedule meetings.
Integrate with Google Calendar API (free tier).
Send reminders 15 minutes before meetings.


Email Automation:
Send emails based on commands.
Integrate with SendGrid API (free tier, 100 emails/day).
Send daily task summaries at 9 AM UTC.


Natural Language Processing:
Process commands using Google Gemini API (free tier, 1500 requests/day).
Extract task parameters (e.g., attendees, time).


Task Management:
Support task prioritization (1-5).
Track task history with status (pending, completed, failed).
Provide endpoint to retrieve task history.


Proactive Actions:
Check upcoming meetings every minute (cron: * * * * *).
Send daily reminders with prioritized tasks (cron: 0 9 * * *).


Security:
JWT-based authentication for all endpoints.
Rate limiting (100 requests/15 minutes).
Input validation with express-validator.


API Documentation:
Provide Swagger UI at /api-docs for interactive API documentation.



2.2 Non-Functional Requirements

Scalability: Handle 100 concurrent requests.
Reliability: Stay within free-tier limits (SendGrid: 100 emails/day, Gemini: 1500 requests/day).
Maintainability: Modular structure with separate routes, services, and controllers.
Security: No hardcoded credentials, secure headers via Helmet.
Performance: Respond within 2 seconds under normal load.
Usability: Swagger UI for easy API exploration and testing.

3. System Architecture
3.1 High-Level Architecture
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Express Server│    │   Agent Service │    │   API Clients   │
│   (Port 8080)   │◄──►│   (Main Logic)  │◄──►│  (Calendar,     │
│                 │    │                 │    │   Email, NLP)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Endpoints:    │    │   Components:   │    │   External      │
│ • /auth/login   │    │ • TaskProcessor │    │   APIs:         │
│ • /health       │    │ • Scheduler     │    │ • Google        │
│ • /meetings     │    │ • Logger        │    │   Calendar      │
│ • /emails       │    │ • Config        │    │ • SendGrid      │
│ • /nlp          │    │                 │    │ • Gemini        │
│ • /tasks        │    └─────────────────┘    └─────────────────┘
└─────────────────┘

3.2 Components

Express Server: Handles HTTP requests, middleware, and Swagger UI.
Agent Service: Coordinates task processing and scheduling.
Task Processor: Parses and executes tasks.
Scheduler: Runs proactive tasks using node-cron.
API Clients: Integrate with Google Calendar, SendGrid, and Gemini APIs.
Logger: Structured logging with Winston and request IDs.
Config: Environment variable management with Zod.

3.3 Third-Party APIs

Google Calendar API (Free Tier): Schedule meetings, no specific request limit.
SendGrid API (Free Tier): Send emails, 100 emails/day.
Google Gemini API (Free Tier): NLP processing, 1500 requests/day.
node-cron: Local scheduling, no external limits.

4. Task Workflows
4.1 Meeting Scheduling

POST request to /meetings with task and priority.
TaskProcessor parses command using Gemini API.
CalendarService schedules meeting.
Task logged in history.

4.2 Email Automation

POST request to /emails with task and priority.
TaskProcessor parses command.
EmailService sends email.
Task logged in history.

4.3 NLP Command Processing

POST request to /nlp with command.
NLPService processes command.
Response returned.

4.4 Proactive Actions

Scheduler checks meetings every minute.
Scheduler sends daily reminders at 9 AM UTC.
Emails sent via EmailService.

4.5 Task History

GET request to /tasks.
AgentService returns task history.

5. Technical Approach

Tech Stack: Express.js, TypeScript, node-cron, axios, Winston, Zod, express-validator, JWT, swagger-ui-express, swagger-jsdoc.
Design Principles:
Modularity: Separate routes, services, controllers.
Type Safety: TypeScript interfaces and Zod validation.
Security: JWT, rate limiting, input validation.
Simplicity: No dependency injection frameworks.


Deployment: Local Node.js or Docker, compatible with GCP Cloud Run.
Testing: Jest for unit tests, manual API testing, Swagger UI for interactive testing.

6. Value Proposition

Why Valuable: Saves hours daily by automating scheduling, emailing, and reminders.
Why Hireable: Reliable, secure, provides task history, and includes Swagger documentation for easy integration.
Cost-Effectiveness: Uses free-tier APIs and local scheduling.

7. Implementation Notes

Free Tier Compliance: Stays within API limits (SendGrid: 100 emails/day, Gemini: 1500 requests/day).
Limitations: In-memory task history; production would use a database.
Future Enhancements:
Add Firestore for persistent storage.
Improve NLP parsing.
Deploy on Cloud Run.



8. Deliverables

Source code
README
SRS (this file)
Unit tests
Docker configuration
Swagger documentation
Video recording (submitted separately)

9. Submission
Submit to kidus@brain3.ai by midnight, including code, documentation, and video.