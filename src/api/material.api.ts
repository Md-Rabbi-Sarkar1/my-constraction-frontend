// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export interface CreateMaterialPayload {
  name: string;
  unit: string;
  currentStock?: number;
  reorderLevel?: number;
}

export interface MaterialItem extends CreateMaterialPayload {
  id: string;
  companyId: string;
  currentStock: number;
  reorderLevel: number;
  createdAt: string;
}

export interface MaterialApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 Maps strictly to POST /api/materials
export function createCompanyMaterial(payload: CreateMaterialPayload) {
  return apiClient<MaterialApiResponse<MaterialItem>>("/materials", {
    method: "POST",
    body: payload,
  });
}

// 💡 Maps strictly to GET /api/materials
export function getAllCompanyMaterials() {
  return apiClient<MaterialApiResponse<MaterialItem[]>>("/materials", {
    method: "GET",
  });
}



export type TransactionType = "PURCHASE" | "USAGE" | "ADJUSTMENT";

export interface CreateTransactionPayload {
  type: TransactionType;
  quantity: number;
  projectId?: string;
  note?: string;
}

export interface TransactionItem extends CreateTransactionPayload {
  id: string;
  materialId: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

export interface MaterialDetailsData extends MaterialItem {
  transactions: TransactionItem[];
}

// 💡 Maps strictly to GET /api/materials/:id
export function getMaterialById(materialId: string) {
  return apiClient<MaterialApiResponse<MaterialDetailsData>>(`/materials/${materialId}`, {
    method: "GET",
  });
}

// 💡 Maps strictly to POST /api/materials/:id/transactions
export function recordMaterialTransaction(materialId: string, payload: CreateTransactionPayload) {
  return apiClient<MaterialApiResponse<TransactionItem>>(`/materials/${materialId}/transactions`, {
    method: "POST",
    body: payload,
  });
}
