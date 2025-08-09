import { ConfigService } from '../config/config';
import { LoggerService } from '../utils/logger';
import axios from 'axios';

export class NLPService {
  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {}

  async processCommand(command: string): Promise<string> {
    const apiKey = this.config.getConfig().geminiApiKey;
    this.logger.info(`API Key check: ${apiKey ? 'configured' : 'not configured'}`);

    if (!apiKey) {
      this.logger.info('Gemini API key not configured. Using mock implementation.', { command });
      return command ? `Processed command: ${command}` : 'No command provided';
    }

    // Correct Gemini API URL for gemini-pro model
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;


    try {
      const response = await axios.post(
        geminiUrl,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant. Process this command: ${command}`
                }
              ]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Extract generated text from the correct response path
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

      this.logger.info('NLP command processed', { command, response: text });
      return text;
    } catch (err:any) {
      this.logger.error('Failed to process NLP command', { error: err.message, stack: err.stack });
      throw new Error('Failed to process NLP command');
    }
  }
}