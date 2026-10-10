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
  password: z
      .string()
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
      .regex(/[0-9]/, "Password must contain at least 1 Number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 Special Character",
      ),
});

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;
