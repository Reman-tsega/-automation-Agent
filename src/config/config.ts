import * as dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const configSchema = z.object({
  googleCalendarApiKey: z.string().optional(),
  sendgridApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  jwtSecret: z.string().min(1, 'JWT_SECRET is required'),
  port: z.string().default('8080'),
  logLevel: z.enum(['info', 'debug', 'error']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

export class ConfigService {
  private config: Config;

  constructor() {
    try {
      console.log('GEMINI_API_KEY from process.env:', process.env.GEMINI_API_KEY);
      console.log('Loading configuration...');
      this.config = configSchema.parse({
        googleCalendarApiKey: process.env.GOOGLE_CALENDAR_API_KEY,
        sendgridApiKey: process.env.SENDGRID_API_KEY,
        geminiApiKey: process.env.GEMINI_API_KEY,
        jwtSecret: process.env.JWT_SECRET, // fixed variable name here
        port: process.env.SERVER_PORT,
        logLevel: process.env.LOG_LEVEL,
      });
      console.log('Configuration loaded successfully');
    } catch (err) {
      console.error('Failed to load configuration', err);
      process.exit(1);
    }
  }

  getConfig(): Config {
    return this.config;
  }
}
