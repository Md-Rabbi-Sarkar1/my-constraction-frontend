import { createProject, fetchProjects } from "@/api/projects.api";
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