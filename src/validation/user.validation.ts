import { z } from "zod";

export const inviteUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "ENGINEER", "WORKER"]).refine(
    (val) => ["ADMIN", "PROJECT_MANAGER", "ENGINEER", "WORKER"].includes(val),
    { message: "Please select a valid role" }
  ),
});

export type InviteFormValues = z.infer<typeof inviteUserSchema>;




export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;
