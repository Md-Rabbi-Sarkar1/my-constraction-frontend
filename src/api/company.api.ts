// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface CompanyApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CompanyData; // 💡 Matches your exact Postman single-object layout wrapper
}

// 💡 Maps strictly to GET /api/company
export function getCompanyProfile() {
  return apiClient<CompanyApiResponse>("/company", {
    method: "GET",
  });
}


// 💡 Add this below your existing getCompanyProfile function

export interface UpdateCompanyPayload {
  name: string;
  slug: string;
  logoUrl?: string | null;
}

// 💡 Maps strictly to PATCH /api/company
export function updateCompanyProfile(payload: UpdateCompanyPayload) {
  return apiClient<CompanyApiResponse>("/company", {
    method: "PATCH",
    body: payload, // ofetch automatically transforms this raw object
  });
}
