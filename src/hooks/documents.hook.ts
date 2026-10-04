import { createCompanyDocument, CreateDocumentPayload, getAllCompanyDocuments, getDocumentById } from "@/api/documents.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetDocuments() {
  return useQuery({
    queryKey: ["company-documents-inventory"],
    queryFn: getAllCompanyDocuments,
    select: (response: any) => response?.data?.result || response?.result || response || [],
  });
}

export function useGetDocumentDetails(documentId: string) {
  return useQuery({
    queryKey: ["document-details", documentId],
    queryFn: () => getDocumentById(documentId),
    select: (response: any) => {
      const unpacked = response?.data?.result || response?.result || response;
      if (Array.isArray(unpacked)) {
        return unpacked.find((d: any) => d.id === documentId);
      }
      return unpacked;
    },
    enabled: !!documentId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => createCompanyDocument(payload),
    onSuccess: () => {
      // Auto-refresh the records table grid instantly on success
      queryClient.invalidateQueries({ queryKey: ["company-documents-inventory"] });
    },
  });
}
