// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export interface WorkerLog {
  name: string;
  role?: string;
  hoursWorked?: number;
}

export interface CreateDailyReportPayload {
  projectId: string;
  reportDate: string;
  workCompleted: string;
  hoursWorked: number;
  progressPct: number;
  workers: WorkerLog[];
  materialsUsed?: string;
  problemsEncountered?: string;
  notes?: string;
}

export interface DailyReportItem extends CreateDailyReportPayload {
  id: string;
  companyId: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

export interface DailyReportApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 Maps strictly to POST /api/daily-reports
export function createProjectDailyReport(payload: CreateDailyReportPayload) {
  return apiClient<DailyReportApiResponse<DailyReportItem>>("/daily-reports", {
    method: "POST",
    body: payload,
  });
}

// 💡 Maps strictly to GET /api/daily-reports
export function getAllDailyReports() {
  return apiClient<DailyReportApiResponse<DailyReportItem[]>>("/daily-reports", {
    method: "GET",
  });
}

// 💡 Maps strictly to GET /api/daily-reports/:id
export function getDailyReportById(reportId: string) {
  return apiClient<DailyReportApiResponse<DailyReportItem>>(`/daily-reports/${reportId}`, {
    method: "GET",
  });
}
