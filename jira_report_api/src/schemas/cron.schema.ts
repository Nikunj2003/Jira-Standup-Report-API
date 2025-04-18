import { CronJob } from 'cron';
import { z } from 'zod';

export const CronConfigSchema = z.object({
  cronTime: z.string().refine((value) => {
    try {
      new CronJob(value, () => {});
      return true;
    } catch {
      return false;
    }
  }, {
    message: 'Invalid cron schedule format',
  }),
});

export const ReportResponseSchema = z.object({
  report: z.string(),
});

export const SyncResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});