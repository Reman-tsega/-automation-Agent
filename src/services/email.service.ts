import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import axios from 'axios';

export class EmailService {
  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    if (!this.config.getConfig().sendgridApiKey) {
      this.logger.info('SendGrid API key not configured. Using mock implementation.', { to, subject, body });
      return;
    }

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'remantsega@gmail.com' },
          subject,
          content: [{ type: 'text/plain', value: body }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.getConfig().sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.info('Email sent', { to, subject, body });
    } catch (err) {
      this.logger.error('Failed to send email', { error: err });
      throw new Error('Failed to send email');
    }
  }
}