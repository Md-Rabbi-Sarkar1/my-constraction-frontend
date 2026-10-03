import apiClient from "@/lib/ofetch-api-client";
import { IcreateProjectSchema } from "@/types/project.type";
import { CreateProjectInput } from "@/validation/project.validation";

export function createProject(payload: CreateProjectInput) {
  return apiClient("/projects", { method: "POST", body: payload });
}

export function fetchProjects() {
  return apiClient("/projects", { method: "GET" });
}