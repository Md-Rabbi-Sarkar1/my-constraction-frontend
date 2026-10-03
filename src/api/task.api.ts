// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface CreateTaskPayload {
  title: string;
  description: string;
  startDate: string;
  assigneeId: string;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskItem extends CreateTaskPayload {
  id: string;
  projectId: string;
  status: TaskStatus;
  createdAt: string;
  assignee?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface GenericTaskResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 LEFT EXACTLY AS YOU REQUESTED (WORKING):
export function createProjectTask(projectId: string, payload: CreateTaskPayload) {
  return apiClient<GenericTaskResponse<TaskItem>>(`/projects/${projectId}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 💡 FIXED: Accesses the pagination route and returns the raw response structure cleanly
export function getProjectTasks(projectId: string) {
  return apiClient<GenericTaskResponse<TaskItem[]>>(`/projects/${projectId}/task`, {
    method: "GET",
  });
}


// 💡 Add this function below your existing createProjectTask and getProjectTasks functions

// Maps strictly to GET /tasks/:id
export function getTaskById(taskId: string) {
  return apiClient<GenericTaskResponse<TaskItem>>(`/tasks/${taskId}`, {
    method: "GET",
  });
}


// 💡 Matches your exact query payload requirement structure
export interface GlobalTaskFiltersPayload {
  page: number;
  pageSize: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface GlobalTaskItem {
  id: string;
  projectId: string;
  project?: {
    id: string;
    name: string;
  } | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
}

export interface GlobalTaskPaginationResult {
  tasks: GlobalTaskItem[];
  totalCount: number;
  totalPages: number;
}

export interface GlobalTaskResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: GlobalTaskItem[] | GlobalTaskPaginationResult; 
  };
}

// 💡 Maps strictly to GET /api/tasks with multi-filter payload attachments
export function getAllTasks(filters: GlobalTaskFiltersPayload) {
  const queryParams = new URLSearchParams();
  
  // Cleanly bind base properties
  queryParams.append("page", String(filters.page));
  queryParams.append("pageSize", String(filters.pageSize));
  
  // Conditionally append optional filter parameters if they are defined
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.priority) queryParams.append("priority", filters.priority);
  if (filters.assigneeId) queryParams.append("assigneeId", filters.assigneeId);

  return apiClient<GlobalTaskResponse>(`/tasks?${queryParams.toString()}`, {
    method: "GET",
  });
}