import { CronJob } from 'cron';
import { type z } from 'zod';
import { type JiraService } from '@/services';
import { type AlertingService } from '@/services';
import axios from 'axios';
import { CronConfigSchema, SyncResultSchema, ReportResponseSchema } from '@/schemas';
import logger from '@/utils/logger';
import { ENV } from '@/config';

type SyncResult = z.infer<typeof SyncResultSchema>;

export class CronService {
  private currentJob: CronJob | null = null;
  private defaultSchedule = ENV.DEFAULT_CRONE_SCHEDULE;
  private ai_url = ENV.AI_URL;

  constructor(
    private jiraService: JiraService,
    private alertingService: AlertingService
  ) {
    this.validateAndStartCron(this.defaultSchedule);
  }

  public startCron(cronTime: string): void {
    this.validateAndStartCron(cronTime);
  }

  private validateAndStartCron(cronTime: string): void {
    const config = CronConfigSchema.parse({ cronTime });
    
    if (this.currentJob) {
      this.currentJob.stop();
    }

    this.currentJob = new CronJob(config.cronTime, async () => {
      await this.handleDailyJiraSync();
    });

    this.currentJob.start();
    logger.info(`Cron job started with validated schedule: ${config.cronTime}`);
  }

  public getCurrentSchedule(): string {
    return this.currentJob?.cronTime.toString() || '';
  }

  public async triggerManualRun(): Promise<SyncResult> {
    return this.handleDailyJiraSync();
  }

  private async handleDailyJiraSync(): Promise<SyncResult> {
    logger.info('Starting validated daily Jira sync...');
    
    try {
      const jiraData = await this.jiraService.processWebhook();
      
      const response = await axios.post(
        this.ai_url,
        { jira_data: jiraData }
      );

      const parsedResponse = ReportResponseSchema.parse(response.data);
      await this.alertingService.sendAlert(parsedResponse.report, 'Daily Jira Sync Report');
      
      logger.info('Daily Jira sync completed successfully');
      return SyncResultSchema.parse({
        success: true,
        message: 'Report generated and sent successfully'
      });
    } catch (error) {
      logger.error('Error in daily Jira sync:', error instanceof Error ? error.message : 'Unknown error');
      return SyncResultSchema.parse({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to complete Jira sync'
      });
    }
  }
}