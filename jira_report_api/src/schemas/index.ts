import { z } from "zod";

export const incomingData = z.object({
  code: z.string(),
  description: z.string(),
});

export type IncomingData = z.infer<typeof incomingData>;

export const errorResponseBody = z.object({
  code: z.string(),
  error: z.string(),
  message: z.string(),
  description: z.string(),
});

export type ErrorResponseBody = z.infer<typeof errorResponseBody>;

export * from "@/schemas/alerting.schema";
export * from "@/schemas/cron.schema";
export * from "@/schemas/env.schema";
export * from "@/schemas/jira.schema";
export * from "@/schemas/report.schema";
