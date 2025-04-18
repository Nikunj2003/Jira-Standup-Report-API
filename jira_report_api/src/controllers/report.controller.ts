import { type Request, type Response } from 'express';
import { z } from 'zod';
import { type CronService } from '@/services';
import { SetCronTimeSchema } from '@/schemas';


export class ReportController {
  constructor(private cronService: CronService) {}

  async setCronTime(req: Request, res: Response): Promise<void> {
    try {
      const { cronTime } = SetCronTimeSchema.parse(req.body);
      this.cronService.startCron(cronTime);
      res.json({ message: `Cron schedule updated to: ${cronTime}` });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: `Failed to update cron schedule: ${error}` });
    }
  }

  async triggerManualRun(_req: Request, res: Response): Promise<void> {
    try {
      const result = await this.cronService.triggerManualRun();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: `Failed to trigger manual run: ${error}` });
    }
  }

  getCurrentSchedule(_req: Request, res: Response): void {
    try {
      const schedule = this.cronService.getCurrentSchedule();
      res.json({ schedule });
    } catch (error) {
      res.status(500).json({ error: `Failed to get current schedule: ${error}` });
    }
  }
}