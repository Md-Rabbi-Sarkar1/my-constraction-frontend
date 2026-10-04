// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface CreateIssuePayload {
  title: string;
  description: string;
  location?: string;
  priority?: IssuePriority;
  assigneeId?: string;
}

export interface IssueItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  location: string | null;
  priority: IssuePriority;
  status: IssueStatus;
  assigneeId: string | null;
  createdAt: string;
}

export interface IssueApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 Maps strictly to POST /api/projects/:projectId/issues
export function createProjectIssue(projectId: string, payload: CreateIssuePayload) {
  return apiClient<IssueApiResponse<IssueItem>>(`/issues/${projectId}`, {
    method: "POST",
    body: payload, // ofetch auto-serializes raw objects
  });
}

// 💡 Maps strictly to GET /api/projects/:projectId/issues
export function getProjectIssues(projectId: string) {
  return apiClient<IssueApiResponse<IssueItem[]>>(`/issues/${projectId}`, {
    method: "GET",
  });
}

export function getIssueById(issueId: string) {
  // Ensure this string perfectly mirrors your backend path route template (e.g., "/issues/YOUR-ID")
  return apiClient<any>(`/issues/${issueId}/issue`, {
    method: "GET",
  });
}


