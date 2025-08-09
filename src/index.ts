import express from 'express';
import { ConfigService } from './config/config';
import { LoggerService } from './utils/logger';
import { CalendarService } from './services/calendar.service';
import { EmailService } from './services/email.service';
import { NLPService } from './services/nlp.service';
import { AgentService } from './services/agent.service';
import { TaskController } from './controllers/task.controller';
import { ErrorMiddleware } from './middleware/error.middleware';
import taskRoutes from './routes/task.routes';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Initialize services
const config = new ConfigService();
const logger = new LoggerService(config);
const calendar = new CalendarService(config, logger);
const email = new EmailService(config, logger);
const nlp = new NLPService(config, logger);
const agent = new AgentService(config, logger, calendar, email, nlp);
const taskController = new TaskController(agent, logger);
const errorMiddleware = new ErrorMiddleware(logger);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simple login endpoint for JWT generation
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ user: username }, config.getConfig().jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Routes
app.use('/', taskRoutes);

// Error handling
app.use(errorMiddleware.handle.bind(errorMiddleware));

// Start server
app.listen(config.getConfig().port, () => {
  logger.info(`Server running on port ${config.getConfig().port}`);
  logger.info(`Swagger UI available at http://localhost:${config.getConfig().port}/api-docs`);
  agent.start().catch((err) => logger.error('Failed to start agent', { error: err }));
});