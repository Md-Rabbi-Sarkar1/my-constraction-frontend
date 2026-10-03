import { createProject, fetchProjects, getProjectMembers, getSingleProject } from "@/api/projects.api";
import { IcreateProjectSchema } from "@/types/project.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
  });
}

export function useGetProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useGetProjectDashboard(projectId: string) {
  return useQuery({
    queryKey: ["project-dashboard", projectId],
    queryFn: () => getSingleProject(projectId),
    // 💡 Defensively parses all potential backend unpack wrappers to prevent undefined blocks
    select: (response: any) => {
      if (response?.data?.result) return response.data.result;
      if (response?.result) return response.result;
      if (response?.data) return response.data;
      return response;
    },
    enabled: !!projectId, // Only fire request if projectId exists
  });
}

export function useGetProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    // Unpacks your verified API data array layer safely
    select: (response) => response?.data?.result || [],
    enabled: !!projectId,
  });
}