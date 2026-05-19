import { z } from "zod";

export const CreateCategorySchema = z.object({
	body: z.object({
		name: z.string().min(2),
		slug: z.string().min(2),
		description: z.string().optional(),
	}),
});

export const CreateProductSchema = z.object({
	body: z.object({
		name: z.string().min(2),
		slug: z.string().min(2),
		description: z.string().optional(),
		price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
		categoryId: z.number().optional(),
		imageUrl: z.url().optional(),
		attributes: z.record(z.string(), z.any()).optional(),
		initialStock: z.number().int().min(0).optional(),
	}),
});

export const UpdateProductSchema = z.object({
	body: z.object({
		name: z.string().min(2).optional(),
		description: z.string().optional(),
		price: z
			.string()
			.regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
			.optional(),
		categoryId: z.number().optional(),
		imageUrl: z.url().optional(),
		attributes: z.record(z.string(), z.any()).optional(),
	}),
});

export const UpdateInventorySchema = z.object({
	body: z.object({
		quantity: z.number().int(),
	}),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>["body"];
export type CreateProductInput = z.infer<typeof CreateProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>["body"];
export type UpdateInventoryInput = z.infer<
	typeof UpdateInventorySchema
>["body"];
