import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import { CalendarService } from './calendar.service';
import { EmailService } from './email.service';
import { NLPService } from './nlp.service';
import { TaskProcessor } from './task-processor';
import { Scheduler } from './scheduler';
import { Task } from '../types/task';

export class AgentService {
  private taskProcessor: TaskProcessor;
  private scheduler: Scheduler;

  constructor(
    private config: ConfigService,
    private logger: LoggerService,
    private calendar: CalendarService,
    private email: EmailService,
    private nlp: NLPService
  ) {
    this.taskProcessor = new TaskProcessor(config, logger, calendar, email, nlp);
    this.scheduler = new Scheduler(config, logger, calendar, email, this.taskProcessor);
  }

  async start(): Promise<void> {
    this.logger.info('Starting AI Agent Service');
    await this.scheduler.start();
    this.logger.info('AI Agent Service started successfully');
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping AI Agent Service');
    await this.scheduler.stop();
    this.logger.info('AI Agent Service stopped');
  }

  async handleAgentTask(task: Task): Promise<void> {
    await this.taskProcessor.handleAgentTask(task);
    this.scheduler.addToHistory(task);
  }

  async processNaturalLanguage(command: string): Promise<string> {
    return this.nlp.processCommand(command);
  }

  getTaskHistory(): Task[] {
    return this.scheduler.getTaskHistory();
  }
}