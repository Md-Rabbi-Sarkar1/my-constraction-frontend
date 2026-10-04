import { createCompanyMaterial, CreateMaterialPayload, CreateTransactionPayload, getAllCompanyMaterials, getMaterialById, recordMaterialTransaction } from "@/api/material.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetMaterials() {
  return useQuery({
    queryKey: ["company-materials-inventory"],
    queryFn: getAllCompanyMaterials,
    // 💡 Uses your exact previous data unwrapping technique
    select: (response: any) => {
      return response?.data?.result || response?.result || response || [];
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialPayload) => createCompanyMaterial(payload),
    onSuccess: () => {
      // Auto-refetches the inventory data grid instantly on success
      queryClient.invalidateQueries({ queryKey: ["company-materials-inventory"] });
    },
  });
}




export function useGetMaterialDetails(materialId: string) {
  return useQuery({
    queryKey: ["material-details", materialId],
    queryFn: () => getMaterialById(materialId),
    select: (response: any) => response?.data?.result || response?.result || response,
    enabled: !!materialId,
  });
}

export function useRecordTransaction(materialId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => recordMaterialTransaction(materialId, payload),
    onSuccess: () => {
      // 💡 Seamlessly re-syncs the stock levels and transactional ledger arrays instantly
      queryClient.invalidateQueries({ queryKey: ["material-details", materialId] });
      queryClient.invalidateQueries({ queryKey: ["company-materials-inventory"] });
    },
  });
}
