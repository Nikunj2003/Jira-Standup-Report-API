import { z } from 'zod';


export const EmailConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  secure: z.boolean(),
  auth: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});

export const EmailAlertParamsSchema = z.object({
  message: z.string(),
  subject: z.string(),
  buffer: z.union([z.instanceof(Buffer), z.string()]).optional(),
});

export const EmailOptionsSchema = z.object({
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  html: z.string(),
  attachments: z.array(
    z.object({
      content: z.union([z.instanceof(Buffer), z.string()]),
      filename: z.string(),
    })
  ).optional(),
});

export const TeamsAlertPayloadSchema = z.object({
  text: z.string(),
});