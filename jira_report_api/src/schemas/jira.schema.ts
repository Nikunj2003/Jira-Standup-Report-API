import { z } from 'zod';

export const JiraIssueSchema = z.object({
  key: z.string(),
  fields: z.object({
    summary: z.string().optional(),
    status: z.object({ name: z.string() }).optional(),
    customfield_10016: z.number().nullable().optional(),
    assignee: z.object({
      displayName: z.string(),
      emailAddress: z.string(),
    }).nullable().optional(),
    priority: z.object({ name: z.string() }).optional(),
  }).passthrough(),
});

export const JiraBoardIssuesResponseSchema = z.object({
  startAt: z.number(),
  maxResults: z.number(),
  total: z.number(),
  issues: z.array(JiraIssueSchema),
});

export const TransformedIssueSchema = z.object({
  key: z.string(),
  summary: z.string().optional(),
  status: z.string().optional(),
  storyPoints: z.number().nullable().optional(),
  assignee: z.object({
    name: z.string(),
    email: z.string(),
  }).nullable().optional(),
  priority: z.string().optional(),
});

export const BoardSchema = z.object({
  id: z.number(),
  name: z.string(),
}).passthrough();

export const SprintSchema = z.object({
  id: z.number(),
  name: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const EpicSchema = z.object({
  id: z.string(),
  key: z.string(),
  summary: z.string(),
});

const EpicWithStoriesSchema = z.object({
  id: z.string(),
  key: z.string(),
  summary: z.string(),
  stories: z.array(TransformedIssueSchema),
});

export const JiraWebhookResponseSchema = z.object({
  board: BoardSchema,
  activeSprint: z.object({
    id: z.number(),
    name: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    issues: z.array(TransformedIssueSchema).optional(),
  }).optional(),
  message: z.string().optional(),
  epics: z.array(EpicWithStoriesSchema),
});