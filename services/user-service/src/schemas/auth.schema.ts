import { z } from "zod";

export const RegisterSchema = z.object({
	body: z.object({
		email: z.email(),
		password: z.string().min(8),
		name: z.string().min(2),
	}),
});

export type RegisterInput = z.infer<typeof RegisterSchema>["body"];

export const LoginSchema = z.object({
	body: z.object({
		email: z.email(),
		password: z.string().min(1),
	}),
});

export type LoginInput = z.infer<typeof LoginSchema>["body"];

export const UpdateProfileSchema = z.object({
	body: z.object({
		name: z.string().min(2).optional(),
		email: z.email().optional(),
	}),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>["body"];
