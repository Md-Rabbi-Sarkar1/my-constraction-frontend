import { CreateIssuePayload, createProjectIssue, deleteIssueRecord, getAllCompanyIssues, getIssueById, getProjectIssues, updateIssueStatus, UpdateIssueStatusPayload } from "@/api/issues.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetProjectIssues(projectId: string) {
  return useQuery({
    queryKey: ["project-issues", projectId],
    queryFn: () => getProjectIssues(projectId),
    select: (response) => response?.data?.result || [],
    enabled: !!projectId,
  });
}

export function useCreateProjectIssue(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => createProjectIssue(projectId, payload),
    onSuccess: () => {
      // 💡 Automatically updates issue lists across the dashboard without reloading the page
      queryClient.invalidateQueries({ queryKey: ["project-issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-dashboard", projectId] });
    },
  });
}




export function useGetIssueById(issueId: string) {
  return useQuery({
    queryKey: ["project-issue-detail", issueId],
    queryFn: () => getIssueById(issueId),
    // 💡 Safely unwrap data.result matching your Postman payload architecture wrappers
    select: (response: any) => {
      return response?.data?.result || response?.result || response;
    },
    enabled: !!issueId, // Only execution fire if issueId is not undefined
  });
}

export function useGetGlobalCompanyIssues() {
  return useQuery({
    queryKey: ["global-company-issues-directory"],
    queryFn: getAllCompanyIssues,
    // 💡 Unpacks response.data.result matching your Postman payload architecture wrappers
    select: (response: any) => {
      return response?.data?.result || response?.result || response || [];
    },
  });
}



export function useUpdateIssueStatus(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateIssueStatusPayload) => updateIssueStatus(issueId, payload),
    onSuccess: (_, payload) => {
      // 1. FIXED: Update matching your structural API payload layers
      queryClient.setQueryData(["project-issue-detail", issueId], (old: any) => {
        if (!old) return old;

        // Safely map across the exact data architecture pattern found in your cache
        if (old.data?.result) {
          return {
            ...old,
            data: {
              ...old.data,
              result: { ...old.data.result, status: payload.status }
            }
          };
        } else if (old.result) {
          return {
            ...old,
            result: { ...old.result, status: payload.status }
          };
        }

        // Fallback if data is already flattened in the cache
        return {
          ...old,
          status: payload.status,
        };
      });

      // 2. Silently refresh everything else in the background
      queryClient.invalidateQueries({ queryKey: ["project-issues"] });
      queryClient.invalidateQueries({ queryKey: ["global-company-issues-directory"] });
    },
  });
}



export function useDeleteIssueRecord(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteIssueRecord(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-issues"] });
      queryClient.invalidateQueries({ queryKey: ["global-company-issues-directory"] });
    },
  });
}
