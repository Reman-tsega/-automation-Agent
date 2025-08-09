import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import { CalendarService } from './calendar.service';
import { EmailService } from './email.service';
import { NLPService } from './nlp.service';
import { Task } from '../types/task';

export class TaskProcessor {
  constructor(
    private config: ConfigService,
    private logger: LoggerService,
    private calendar: CalendarService,
    private email: EmailService,
    private nlp: NLPService
  ) {}

  async handleAgentTask(task: Task): Promise<void> {
    this.logger.info('Processing task', { task });
    const { description, priority } = task;

    if (priority < 1 || priority > 5) {
      throw new Error('Priority must be between 1 and 5');
    }

    // Use NLP to parse command
    const nlpResult = await this.nlp.processCommand(description);
    this.logger.info('NLP response', { response: nlpResult });

    // Route based on task type
    try {
      if (task.type === 'meeting') {
        await this.handleMeetingTask(task);
        task.status = 'completed';
      } else if (task.type === 'email') {
        await this.handleEmailTask(task);
        task.status = 'completed';
      } else {
        this.logger.info('Unknown task type, logging NLP response', { task });
        task.status = 'completed';
      }
    } catch (err) {
      task.status = 'failed';
      throw err;
    }
  }

  private async handleMeetingTask(task: Task): Promise<void> {
    this.logger.info('Handling meeting task', { task });
    const parsed = this.parseTask(task.description);
    const attendees = parsed.attendees || ['example@email.com'];
    const startTime = parsed.startTime || new Date(Date.now() + 3600 * 1000);
    const duration = parsed.duration || 30 * 60 * 1000;
    const title = parsed.title || `Meeting (Priority: ${task.priority})`;

    await this.calendar.scheduleMeeting(attendees, startTime, duration, title);
  }

  private async handleEmailTask(task: Task): Promise<void> {
    this.logger.info('Handling email task', { task });
    const parsed = this.parseTask(task.description);
    const to = parsed.to || 'remantsega@gmail.com';
    const subject = parsed.subject || `Email (Priority: ${task.priority})`;
    const body = parsed.body || 'This is an automated email from the AI Agent.';

    await this.email.sendEmail(to, subject, body);
  }

  private parseTask(description: string): any {
    const attendeesMatch:any = description.match(/to\s+([^\s]+)/);
    const timeMatch = description.match(/at\s+(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    const durationMatch:any = description.match(/for\s+(\d+)\s+minutes/i);
    const titleMatch = description.match(/meeting\s+about\s+(.+)/i);
    const subjectMatch = description.match(/subject\s+(.+)/i);
    const bodyMatch = description.match(/body\s+(.+)/i);

    return {
      attendees: attendeesMatch ? attendeesMatch[1].split(',') : undefined,
      startTime: timeMatch ? new Date(Date.now() + 3600 * 1000) : undefined,
      duration: durationMatch ? parseInt(durationMatch[1]) * 60 * 1000 : undefined,
      title: titleMatch ? titleMatch[1] : undefined,
      to: attendeesMatch ? attendeesMatch[1] : undefined,
      subject: subjectMatch ? subjectMatch[1] : undefined,
      body: bodyMatch ? bodyMatch[1] : undefined,
    };
  }
}