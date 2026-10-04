// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export type ExpenseCategory = "MATERIALS" | "LABOR" | "TRANSPORTATION" | "EQUIPMENT" | "OTHER";

export interface CreateExpensePayload {
  projectId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  expenseDate: string;
}

export interface ExpenseItem extends CreateExpensePayload {
  id: string;
  companyId: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

export interface ExpenseApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 Maps strictly to POST /api/expenses
export function createCompanyExpense(payload: CreateExpensePayload) {
  return apiClient<ExpenseApiResponse<ExpenseItem>>("/expenses", {
    method: "POST",
    body: payload,
  });
}

// 💡 Maps strictly to GET /api/expenses
export function getAllCompanyExpenses() {
  return apiClient<ExpenseApiResponse<ExpenseItem[]>>("/expenses", {
    method: "GET",
  });
}

// 💡 Maps strictly to GET /api/expenses/:id
export function getExpenseById(expenseId: string) {
  return apiClient<ExpenseApiResponse<ExpenseItem>>(`/expenses/${expenseId}`, {
    method: "GET",
  });
}
