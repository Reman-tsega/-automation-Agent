import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import { CalendarService } from '../services/calendar.service';
import { EmailService } from '../services/email.service';
import { NLPService } from '../services/nlp.service';
import { AgentService } from '../services/agent.service';

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints for scheduling meetings, sending emails, and processing NLP commands
 */
const router = Router();

// Initialize dependencies
const config = new ConfigService();
const logger = new LoggerService(config);
const calendar = new CalendarService(config, logger);
const email = new EmailService(config, logger);
const nlp = new NLPService(config, logger);
const agent = new AgentService(config, logger, calendar, email, nlp);
const taskController = new TaskController(agent, logger);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', taskController.checkHealth.bind(taskController));

/**
 * @swagger
 * /meetings:
 *   post:
 *     summary: Schedule a meeting
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - participants
 *             properties:
 *               title:
 *                 type: string
 *                 example: Project Kickoff
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-10T10:00:00Z
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["alice@example.com", "bob@example.com"]
 *     responses:
 *       201:
 *         description: Meeting scheduled successfully
 */
router.post('/meetings', taskController.createMeeting.bind(taskController));

/**
 * @swagger
 * /emails:
 *   post:
 *     summary: Send an email task to the agent service
 *     description: Creates a new email-sending task with optional priority.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - to
 *               - subject
 *               - body
 *             properties:
 *               priority:
 *                 type: integer
 *                 description: Task priority (1 = lowest, 5 = highest)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 3
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *                 example: remantsega@gmail.com
 *               subject:
 *                 type: string
 *                 description: Email subject line
 *                 example: Meeting Reminder
 *               body:
 *                 type: string
 *                 description: Email body content
 *                 example: Don't forget about our meeting tomorrow at 10:00 AM.
 *     responses:
 *       200:
 *         description: Email task created and queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Task description is required
 *                       param:
 *                         type: string
 *                         example: task
 *                       location:
 *                         type: string
 *                         example: body
 *       500:
 *         description: Internal server error
 */
router.post('/emails', taskController.sendEmail.bind(taskController));


/**
 * @swagger
 * /nlp:
 *   post:
 *     summary: Process an NLP command
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - command
 *             properties:
 *               command:
 *                 type: string
 *                 example: Schedule a meeting with Alice tomorrow at 10am
 *     responses:
 *       200:
 *         description: NLP command processed successfully
 */
router.post('/nlp', taskController.processNLP.bind(taskController));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve task history
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   status:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get('/tasks', taskController.getTaskHistory.bind(taskController));

export default router;
