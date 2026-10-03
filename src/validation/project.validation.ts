import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  clientInfo: z.string().optional(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
  budget: z.string().optional(),
  managerId: z.string().min(1, "Please select a project manager"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>