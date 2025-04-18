import { z } from 'zod';

export const EnvironmentSchema = z.object({
    // Required Jira variables
    JIRA_BASE_URL: z.string().url().min(1),
    JIRA_API_TOKEN: z.string().min(1),
    JIRA_EMAIL: z.string().email().min(1),
  
    // Email configuration
    ENABLE_EMAIL_ALERTS: z.preprocess(
      (val) => val === 'true',
      z.boolean().default(false)
    ),
    EMAIL_HOST: z.string().optional().default(''),
    EMAIL_PORT: z.preprocess(
      (val) => Number(val),
      z.number().int().min(1).max(65535).default(587)
    ),
    EMAIL_SECURE: z.preprocess(
      (val) => val === 'true',
      z.boolean().default(false)
    ),
    EMAIL_USER: z.string().optional().default(''),
    EMAIL_PASSWORD: z.string().optional().default(''),
  
    // Teams configuration
    ENABLE_TEAMS_ALERTS: z.preprocess(
      (val) => val === 'true',
      z.boolean().default(false)
    ),
    TEAMS_WEBHOOK_URL: z.string().url().optional(),
  
    // Recipients list
    ALERT_EMAIL_RECIPIENTS: z.preprocess(
      (val) => (typeof val === 'string' ? val.split(',') : []),
      z.array(z.string().email()).default([])
    ),

    // AI service URL
    AI_URL: z.string().url().min(1),
    DEFAULT_CRONE_SCHEDULE: z.string().min(1).default('0 9 * * *')
});