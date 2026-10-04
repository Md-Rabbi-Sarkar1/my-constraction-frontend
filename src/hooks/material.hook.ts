import { createCompanyMaterial, CreateMaterialPayload, getAllCompanyMaterials } from "@/api/material.api";
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
