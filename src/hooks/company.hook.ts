import { getCompanyProfile, UpdateCompanyPayload, updateCompanyProfile } from "@/api/company.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetCompanyProfile() {
  return useQuery({
    queryKey: ["company-profile-matrix"],
    queryFn: getCompanyProfile,
    select: (response: any) => response?.data || response?.result || response,
  });
}

// 💡 NEW MUTATION HOOK FOR UPDATES
export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => updateCompanyProfile(payload),
    onSuccess: () => {
      // 💡 Instantly invalidates and re-syncs all company screens across the app
      queryClient.invalidateQueries({ queryKey: ["company-profile-matrix"] });
    },
  });
}
