import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
	products,
	categories,
	inventory,
	Product,
	Category,
	Inventory,
} from "../db/schema";
import { eq } from "drizzle-orm";
import {
	CreateCategoryInput,
	CreateProductInput,
	UpdateInventoryInput,
	UpdateProductInput,
} from "../schemas/product.schema";
import { AppError } from "@cloudscale/shared";

export type IProductService = {
	// Categories
	createCategory: (data: CreateCategoryInput) => Promise<Category>;
	getCategories: () => Promise<Category[]>;

	// Products
	createProduct: (data: CreateProductInput) => Promise<Product>;
	getProducts: () => Promise<Product[]>;
	getProductById: (id: number) => Promise<Product>;
	updateProduct: (id: number, data: UpdateProductInput) => Promise<Product>;
	deleteProduct: (id: number) => Promise<Product>;

	// Inventory
	updateStock: (
		productId: number,
		data: UpdateInventoryInput,
	) => Promise<Inventory>;
	getStock: (productId: number) => Promise<Inventory | null>;
};

export const createProductService = (
	db: PostgresJsDatabase<Record<string, unknown>>,
): IProductService => {
	return {
		// Categories
		createCategory: async (data) => {
			const [category] = await db
				.insert(categories)
				.values({
					name: data.name,
					slug: data.slug,
					description: data.description,
				})
				.returning();
			return category;
		},

		getCategories: async () => {
			return await db.select().from(categories);
		},

		// Products
		createProduct: async (data) => {
			const { initialStock, ...productData } = data;

			return await db.transaction(async (tx) => {
				const [product] = await tx
					.insert(products)
					.values({
						name: productData.name,
						slug: productData.slug,
						description: productData.description,
						price: productData.price,
						categoryId: productData.categoryId,
						imageUrl: productData.imageUrl,
						attributes: productData.attributes,
					})
					.returning();

				await tx.insert(inventory).values({
					productId: product.id,
					quantity: initialStock || 0,
				});

				return product;
			});
		},

		getProducts: async () => {
			return await db.select().from(products);
		},

		getProductById: async (id) => {
			const [product] = await db
				.select()
				.from(products)
				.where(eq(products.id, id))
				.limit(1);
			if (!product) throw new AppError(404, "Product not found");
			return product;
		},

		updateProduct: async (id, data) => {
			const [updated] = await db
				.update(products)
				.set({
					...data,
					updatedAt: new Date(),
				})
				.where(eq(products.id, id))
				.returning();
			if (!updated) throw new AppError(404, "Product not found");
			return updated;
		},

		deleteProduct: async (id) => {
			return await db.transaction(async (tx) => {
				await tx.delete(inventory).where(eq(inventory.productId, id));
				const [deleted] = await tx
					.delete(products)
					.where(eq(products.id, id))
					.returning();
				if (!deleted) throw new AppError(404, "Product not found");
				return deleted;
			});
		},

		// Inventory
		updateStock: async (productId, data) => {
			const [updatedStock] = await db
				.update(inventory)
				.set({
					quantity: data.quantity,
					updatedAt: new Date(),
				})
				.where(eq(inventory.productId, productId))
				.returning();

			if (!updatedStock) {
				const [newStock] = await db
					.insert(inventory)
					.values({
						productId,
						quantity: data.quantity,
					})
					.returning();
				return newStock;
			}
			return updatedStock;
		},

		getStock: async (productId) => {
			const [stock] = await db
				.select()
				.from(inventory)
				.where(eq(inventory.productId, productId))
				.limit(1);
			return stock || null;
		},
	};
};
