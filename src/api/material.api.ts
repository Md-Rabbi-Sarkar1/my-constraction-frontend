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
