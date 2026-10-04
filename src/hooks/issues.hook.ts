import { CreateIssuePayload, createProjectIssue, getAllCompanyIssues, getIssueById, getProjectIssues } from "@/api/issues.api";
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