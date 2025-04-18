import { Router } from 'express';
import { type CronService } from '@/services';
import { ReportController } from '@/controllers';

export function createReportRoutes(cronService: CronService): Router {
  const router = Router();
  const controller = new ReportController(cronService);

  router.post('/set-cron-time', (req, res) => controller.setCronTime(req, res));
  router.post('/trigger-manual', (req, res) => controller.triggerManualRun(req, res));
  router.get('/current-schedule', (req, res) => controller.getCurrentSchedule(req, res));

  return router;
}