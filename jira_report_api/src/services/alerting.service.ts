import axios from 'axios';
import { marked } from 'marked';
import * as nodemailer from 'nodemailer';
import { type z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ENV } from '@/config';
import { EmailConfigSchema, EmailOptionsSchema, TeamsAlertPayloadSchema, EmailAlertParamsSchema } from '@/schemas';
import logger from '@/utils/logger';

// Type Definitions
type EmailAlertParams = z.infer<typeof EmailAlertParamsSchema>;

export class AlertingService {
  private transporter?: nodemailer.Transporter;

  constructor() {
    if (ENV.ENABLE_EMAIL_ALERTS) {
      const config = EmailConfigSchema.parse({
        host: ENV.EMAIL_HOST,
        port: ENV.EMAIL_PORT,
        secure: ENV.EMAIL_SECURE,
        auth: {
          user: ENV.EMAIL_USER,
          pass: ENV.EMAIL_PASSWORD
        }
      });
      this.transporter = nodemailer.createTransport(config);
    }
  }

  async sendAlert(message: string, subject: string, buffer?: Buffer | string): Promise<void> {
    logger.info('Sending alerts...');
    try {
      const params = EmailAlertParamsSchema.parse({ message, subject, buffer });

      if (ENV.ENABLE_EMAIL_ALERTS) {
        await this.sendEmailAlert(params);
      }
      if (ENV.ENABLE_TEAMS_ALERTS && ENV.TEAMS_WEBHOOK_URL) {
        await this.sendTeamsAlert(params.message);
      }

      // Save to MD file if both alerts are disabled
      if (!ENV.ENABLE_EMAIL_ALERTS && !(ENV.ENABLE_TEAMS_ALERTS && ENV.TEAMS_WEBHOOK_URL)) {
        await this.saveToMdFile(params);
      }
    } catch (error) {
      logger.error('Error sending alerts:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async saveToMdFile(params: EmailAlertParams): Promise<void> {
    try {
      const timestamp = Date.now();
      const dir = 'reports';
      await fs.mkdir(dir, { recursive: true });
  
      // Strip ANSI escape codes from message
      // eslint-disable-next-line no-control-regex
      const cleanMessage = params.message.replace(/\x1B\[[0-9;]*m/g, '');
      
      // Create markdown content with cleaned message
      const mdFilename = `jira_report_${timestamp}.md`;
      const mdPath = path.join(dir, mdFilename);
      let content = `# ${params.subject}\n\n${cleanMessage}`;
  
      // Handle PDF buffer if present
      if (params.buffer) {
        const pdfFilename = `report_${timestamp}.pdf`;
        const pdfPath = path.join(dir, pdfFilename);
        await fs.writeFile(pdfPath, params.buffer);
        content += `\n\n[Download Report PDF](${pdfFilename})`;
      }
  
      // Write markdown file
      await fs.writeFile(mdPath, content);
      logger.info(`Saved report to MD file: ${mdPath}`);
    } catch (error) {
      logger.error('Error saving MD file:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async sendEmailAlert(params: EmailAlertParams): Promise<void> {
    if (!this.transporter) return;
    const formattedHtml = marked.parse(params.message);
    const emailOptions = EmailOptionsSchema.parse({
      from: ENV.EMAIL_USER,
      to: ENV.ALERT_EMAIL_RECIPIENTS.join(','),
      subject: params.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head><title>${params.subject}</title></head>
        <body>
          ${formattedHtml}
        </body>
        </html>
      `,
      ...(params.buffer && {
        attachments: [{
          content: params.buffer,
          filename: 'report.pdf'
        }]
      })
    });
    await this.transporter.sendMail(emailOptions);
    logger.info('Email sent successfully');
  }

  private async sendTeamsAlert(message: string): Promise<void> {
    if (!ENV.TEAMS_WEBHOOK_URL) return;
    const payload = TeamsAlertPayloadSchema.parse({ text: message });
    await axios.post(ENV.TEAMS_WEBHOOK_URL, payload);
    logger.info('Teams notification sent');
  }
}