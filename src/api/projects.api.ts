import apiClient from "@/lib/ofetch-api-client";
import { IcreateProjectSchema } from "@/types/project.type";
import { CreateProjectInput } from "@/validation/project.validation";

export function createProject(payload: CreateProjectInput) {
  return apiClient("/projects", { method: "POST", body: payload });
}

export function fetchProjects() {
  return apiClient("/projects", { method: "GET" });
}


export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: { id: string; name: string } | null;
  createdAt: string;
}

export interface MemberItem {
  id: string;
  projectId: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export interface DashboardData {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  clientInfo: string | null;
  budget: string | number | null;
  startDate: string | null;
  expectedEndDate: string | null;
  members: MemberItem[];
  tasks: TaskItem[];
}

export interface SingleProjectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardData; // Or maps to { result: DashboardData } depending on your generic wrapper layout
}

// 💡 Change this string path template to match your backend mount structure (e.g., "/projects/:id/dashboard")
export function getSingleProject(projectId: string) {
  return apiClient<SingleProjectResponse>(`/projects/${projectId}`, {
    method: "GET",
  });
}

export interface ProjectMember {
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "ENGINEER" | "WORKER";
  name: string | null;
}

export interface ProjectMemberResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: ProjectMember[]; // 💡 Matches your "data.result" Postman block structure exactly
  };
}

// 💡 Maps directly to your backend GET /:id/projectMember route prefix
export function getProjectMembers(projectId: string) {
  return apiClient<ProjectMemberResponse>(`/projects/${projectId}/projectMember`, {
    method: "GET",
  });
}






// Client function to update a project using your configured ofetch instance
export function updateProject({ id, payload }: { id: string; payload: any }) {
  return apiClient(`/projects/${id}`, { 
    method: "PUT", 
    body: payload 
  });
}

// Client function to delete a project using your configured ofetch instance
export function deleteProject(id: string) {
  return apiClient(`/projects/${id}`, { 
    method: "DELETE" 
  });
}
