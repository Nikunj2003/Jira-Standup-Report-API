import { z } from 'zod';

export const SetCronTimeSchema = z.object({
  cronTime: z.string().refine(
    value => /(\*|[0-9,/-]+)\s+(\*|[0-9,/-]+)\s+(\*|[0-9,/-]+)\s+(\*|[0-9,/-]+)\s+(\*|[0-9,/-]+)/.test(value),
    'Invalid cron format (expected 5-part expression)'
  )
});

export const ManualRunParamsSchema = z.object({
  immediate: z.boolean().optional().default(false)
}).optional();