import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import axios from 'axios';

export class CalendarService {
  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {}

  async scheduleMeeting(attendees: string[], startTime: Date, duration: number, title: string): Promise<void> {
    if (!this.config.getConfig().googleCalendarApiKey) {
      this.logger.info('Google Calendar API key not configured. Using mock implementation.', {
        title,
        attendees,
        startTime,
        duration,
      });
      return;
    }

    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          summary: title,
          start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
          end: { dateTime: new Date(startTime.getTime() + duration).toISOString(), timeZone: 'UTC' },
          attendees: attendees.map((email) => ({ email })),
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.getConfig().googleCalendarApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.info('Meeting scheduled', { title, attendees, startTime, duration });
    } catch (err) {
      this.logger.error('Failed to schedule meeting', { error: err });
      throw new Error('Failed to schedule meeting');
    }
  }

  async getUpcomingEvents(): Promise<{ title: string; startTime: Date }[]> {
    if (!this.config.getConfig().googleCalendarApiKey) {
      this.logger.info('Google Calendar API key not configured. Returning empty events.');
      return [];
    }
    return [];
  }
}