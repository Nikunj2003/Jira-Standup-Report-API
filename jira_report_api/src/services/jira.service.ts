import axios from 'axios';
import { z } from 'zod';
import { ENV } from '@/config';
import {
  JiraIssueSchema,
  JiraBoardIssuesResponseSchema,
  type TransformedIssueSchema,
  BoardSchema,
  SprintSchema,
  EpicSchema,
  JiraWebhookResponseSchema
} from '@/schemas';
import logger from '@/utils/logger';

// Type Definitions
type JiraIssue = z.infer<typeof JiraIssueSchema>;
type JiraBoardIssuesResponse = z.infer<typeof JiraBoardIssuesResponseSchema>;
type TransformedIssue = z.infer<typeof TransformedIssueSchema>;
type Sprint = z.infer<typeof SprintSchema>;
type Epic = z.infer<typeof EpicSchema>;
type JiraWebhookResponse = z.infer<typeof JiraWebhookResponseSchema>;

export class JiraService {
  private readonly jiraBaseUrl: string;
  private readonly jiraToken: string;
  private readonly jiraEmail: string;

  constructor() {
    this.jiraBaseUrl = ENV.JIRA_BASE_URL;
    this.jiraToken = ENV.JIRA_API_TOKEN;
    this.jiraEmail = ENV.JIRA_EMAIL;
  }

  async processWebhook(): Promise<JiraWebhookResponse> {
    try {
      const boardResponse = await axios.get(`${this.jiraBaseUrl}/rest/agile/1.0/board`, {
        auth: {
          username: this.jiraEmail,
          password: this.jiraToken
        }
      });

      const rawBoard = boardResponse.data.values?.[0];
      if (!rawBoard?.id) {
        throw new Error('Invalid board data received from Jira');
      }

      const board = BoardSchema.parse(rawBoard);
      const boardDetails = await this.getBoardDetails(board.id);
      const activeSprint = await this.getActiveSprint(board.id);

      if (!activeSprint) {
        return JiraWebhookResponseSchema.parse({
          board: { ...board, ...boardDetails },
          message: 'No active sprint found',
          epics: []
        });
      }

      const sprintIssues = await this.getSprintIssues(activeSprint.id);
      const epicsResponse = await this.getBoardEpics(board.id);

      if (!epicsResponse.values.length) {
        return JiraWebhookResponseSchema.parse({
          board: { ...board, ...boardDetails },
          activeSprint: {
            ...activeSprint,
            issues: sprintIssues.map(this.transformIssue)
          },
          epics: []
        });
      }

      const epicsWithStories = await Promise.all(
        epicsResponse.values.map(async (epic) => {
          try {
            const stories = await this.getEpicStories(epic.id);
            return {
              ...epic,
              stories: stories.map(this.transformIssue)
            };
          } catch (error) {
            console.warn(`Failed to fetch stories for epic ${epic.id}:`, error instanceof Error ? error.message : 'Unknown error');
            return { ...epic, stories: [] };
          }
        })
      );

      return JiraWebhookResponseSchema.parse({
        board: { ...board, ...boardDetails },
        activeSprint: {
          ...activeSprint,
          issues: sprintIssues.map(this.transformIssue)
        },
        epics: epicsWithStories.map(epic => ({
          id: epic.id,
          key: epic.key,
          summary: epic.summary,
          stories: epic.stories
        }))
      });
    } catch (error) {
      logger.error('Error in processWebhook:', error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to fetch Jira details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private transformIssue(issue: JiraIssue): TransformedIssue {
    return {
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name,
      storyPoints: issue.fields.customfield_10016 ?? null,
      assignee: issue.fields.assignee ? {
        name: issue.fields.assignee.displayName,
        email: issue.fields.assignee.emailAddress
      } : null,
      priority: issue.fields.priority?.name
    };
  }

  async getBoardDetails(boardId: number): Promise<object> {
    try {
      const response = await axios.get(`${this.jiraBaseUrl}/rest/agile/1.0/board/${boardId}/configuration`, {
        auth: {
          username: this.jiraEmail,
          password: this.jiraToken
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch board details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getActiveSprint(boardId: number): Promise<Sprint | undefined> {
    try {
      const response = await axios.get(
        `${this.jiraBaseUrl}/rest/agile/1.0/board/${boardId}/sprint?state=active`,
        { auth: { username: this.jiraEmail, password: this.jiraToken } }
      );
      return response.data.values?.[0] ? SprintSchema.parse(response.data.values[0]) : undefined;
    } catch (error) {
      throw new Error(`Failed to fetch active sprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    try {
      const response = await axios.get(
        `${this.jiraBaseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`,
        {
          auth: { username: this.jiraEmail, password: this.jiraToken },
          params: { fields: ['summary', 'status', 'assignee', 'priority', 'customfield_10016'] }
        }
      );
      return z.array(JiraIssueSchema).parse(response.data.issues);
    } catch (error) {
      throw new Error(`Failed to fetch sprint issues: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBoardEpics(boardId: number): Promise<{ values: Epic[] }> {
    try {
      const response = await axios.get(
        `${this.jiraBaseUrl}/rest/agile/1.0/board/${boardId}/epic`,
        { auth: { username: this.jiraEmail, password: this.jiraToken } }
      );
      return {
        values: z.array(EpicSchema).parse(response.data.values)
      };
    } catch (error) {
      throw new Error(`Failed to fetch epics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getEpicStories(epicId: string): Promise<JiraIssue[]> {
    try {
      const response = await axios.post(
        `${this.jiraBaseUrl}/rest/api/3/search`,
        {
          jql: `parent = ${epicId}`,
          fields: ['summary', 'status', 'assignee', 'priority', 'customfield_10016']
        },
        { auth: { username: this.jiraEmail, password: this.jiraToken } }
      );
      return response.status === 200 ? z.array(JiraIssueSchema).parse(response.data.issues) : [];
    } catch (error) {
      logger.error(`Error fetching epic stories for epic ${epicId}:`, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getBoardIssues(boardId: number): Promise<JiraBoardIssuesResponse> {
    try {
      const response = await axios.get(
        `${this.jiraBaseUrl}/rest/agile/1.0/board/${boardId}/issue`,
        { auth: { username: this.jiraEmail, password: this.jiraToken } }
      );
      return JiraBoardIssuesResponseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch issues for board ${boardId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getIssueDetails(issueKey: string): Promise<JiraIssue> {
    try {
      const response = await axios.get(
        `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}`,
        { auth: { username: this.jiraEmail, password: this.jiraToken } }
      );
      return JiraIssueSchema.parse(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch issue details for ${issueKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}