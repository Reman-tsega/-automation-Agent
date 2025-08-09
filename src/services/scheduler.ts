import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import { CalendarService } from './calendar.service';
import { EmailService } from './email.service';
import { TaskProcessor } from './task-processor';
import { Task } from '../types/task';
import cron, { ScheduledTask } from 'node-cron';


export class Scheduler {
   private taskHistory: Task[] = [];
  private cronJobs: ScheduledTask[] = [];

  constructor(
    private config: ConfigService,
    private logger: LoggerService,
    private calendar: CalendarService,
    private email: EmailService,
    private taskProcessor: TaskProcessor
  ) {}

  async start(): Promise<void> {
    this.logger.info('Starting scheduler');

    // Schedule daily reminder at 9 AM
    this.cronJobs.push(cron.schedule('0 9 * * *', () => this.sendDailyReminder(), { timezone: 'UTC' }));

    // Schedule meeting checks every minute
    this.cronJobs.push(cron.schedule('* * * * *', () => this.checkUpcomingMeetings(), { timezone: 'UTC' }));

    // Run immediately on start
    await this.checkScheduledTasks();
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping scheduler');
    this.cronJobs.forEach((job) => job.stop());
    this.cronJobs = [];
  }

  private async checkScheduledTasks(): Promise<void> {
    this.logger.debug('Checking scheduled tasks');
    await this.sendDailyReminder();
    await this.checkUpcomingMeetings();
  }

  private async sendDailyReminder(): Promise<void> {
    this.logger.info('Sending daily reminder');
    const tasks = this.taskHistory
      .filter((task) => task.status === 'pending')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);

    const reminderBody = `Here are your top priority tasks for today:\n${tasks
      .map((task, i) => `${i + 1}. ${task.description} (Priority: ${task.priority})`)
      .join('\n') || 'No pending tasks'}`;

    await this.email.sendEmail('user@example.com', 'Daily Task Reminder', reminderBody);
  }

  private async checkUpcomingMeetings(): Promise<void> {
    this.logger.debug('Checking upcoming meetings');
    const events = await this.calendar.getUpcomingEvents();
    const now = new Date();
    for (const event of events) {
      const timeToStart = event.startTime.getTime() - now.getTime();
      if (timeToStart <= 15 * 60 * 1000 && timeToStart > 0) {
        await this.sendMeetingReminder(event);
      }
    }
  }

  private async sendMeetingReminder(event: { title: string; startTime: Date }): Promise<void> {
    this.logger.info('Sending meeting reminder', { meeting: event.title });
    const reminderBody = `Reminder: You have a meeting '${event.title}' starting at ${event.startTime.toLocaleTimeString()}`;
    await this.email.sendEmail('user@example.com', 'Meeting Reminder', reminderBody);
  }

  addToHistory(task: Task): void {
    this.taskHistory.push(task);
  }

  getTaskHistory(): Task[] {
    return this.taskHistory;
  }
}