import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
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

export const registerPayloadSchema = z.object({
	companyName: z
		.string()
		.min(2, { message: "Company name must be at least 2 characters long" })
		.trim(),

	slug: z
		.string()
		.min(2, { message: "Slug must be at least 2 characters long" })
		.regex(/^[a-z0-9-]+$/, {
			message: "Slug must contain only lowercase letters, numbers, and hyphens",
		})
		.trim(),

	user: z.object({
		name: z
			.string()
			.min(2, { message: "Name must be at least 2 characters long" })
			.trim(),

		email: z
			.string()
			.email({ message: "Invalid email address" })
			.trim()
			.toLowerCase(),

		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),

		role: z.literal("ADMIN", {
			message: "Role must be exactly ADMIN during registration",
		}),
	}),
});

export type TRegisterPayload = z.infer<typeof registerPayloadSchema>;