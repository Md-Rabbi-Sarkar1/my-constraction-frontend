// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export interface CreateDocumentPayload {
  projectId: string;
  name: string;
  type: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
}

export interface DocumentItem extends CreateDocumentPayload {
  id: string;
  companyId: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

export interface DocumentApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
  };
}

// 💡 Maps strictly to POST /api/documents
export function createCompanyDocument(payload: CreateDocumentPayload) {
  return apiClient<DocumentApiResponse<DocumentItem>>("/documents", {
    method: "POST",
    body: payload,
  });
}

// 💡 Maps strictly to GET /api/documents
export function getAllCompanyDocuments() {
  return apiClient<DocumentApiResponse<DocumentItem[]>>("/documents", {
    method: "GET",
  });
}

// 💡 Maps strictly to GET /api/documents/:id
export function getDocumentById(documentId: string) {
  return apiClient<DocumentApiResponse<DocumentItem>>(`/documents/${documentId}`, {
    method: "GET",
  });
}
