import { RequestHandler } from "express";
import { IProductService } from "../services/product.service";
import {
	CreateCategoryInput,
	CreateProductInput,
	UpdateInventoryInput,
	UpdateProductInput,
} from "../schemas/product.schema";
import { Category, Inventory, Product } from "../db/schema";

type ApiResponse<T> = { data: T } | { error: string };

export type IProductController = {
	// Categories
	createCategory: RequestHandler<
		{},
		ApiResponse<Category>,
		CreateCategoryInput
	>;
	getCategories: RequestHandler<{}, ApiResponse<Category[]>>;

	// Products
	createProduct: RequestHandler<{}, ApiResponse<Product>, CreateProductInput>;
	getProducts: RequestHandler<{}, ApiResponse<Product[]>>;
	getProduct: RequestHandler<{ id: string }, ApiResponse<Product>>;
	updateProduct: RequestHandler<
		{ id: string },
		ApiResponse<Product>,
		UpdateProductInput
	>;
	deleteProduct: RequestHandler<{ id: string }, ApiResponse<Product>>;

	// Inventory
	updateStock: RequestHandler<
		{ productId: string },
		ApiResponse<Inventory>,
		UpdateInventoryInput
	>;
	getStock: RequestHandler<
		{ productId: string },
		ApiResponse<Inventory | null>
	>;
};

export const createProductController = (
	service: IProductService,
): IProductController => {
	return {
		// Categories
		createCategory: async (req, res, next) => {
			try {
				const category = await service.createCategory(req.body);
				res.status(201).json({ data: category });
			} catch (e) {
				next(e);
			}
		},

		getCategories: async (_req, res, next) => {
			try {
				const categories = await service.getCategories();
				res.json({ data: categories });
			} catch (e) {
				next(e);
			}
		},

		// Products
		createProduct: async (req, res, next) => {
			try {
				const product = await service.createProduct(req.body);
				res.status(201).json({ data: product });
			} catch (e) {
				next(e);
			}
		},

		getProducts: async (_req, res, next) => {
			try {
				const products = await service.getProducts();
				res.json({ data: products });
			} catch (e) {
				next(e);
			}
		},

		getProduct: async (req, res, next) => {
			try {
				const product = await service.getProductById(Number(req.params.id));
				res.json({ data: product });
			} catch (e) {
				next(e);
			}
		},

		updateProduct: async (req, res, next) => {
			try {
				const product = await service.updateProduct(
					Number(req.params.id),
					req.body,
				);
				res.json({ data: product });
			} catch (e) {
				next(e);
			}
		},

		deleteProduct: async (req, res, next) => {
			try {
				const deleted = await service.deleteProduct(Number(req.params.id));
				res.status(200).json({ data: deleted });
			} catch (e) {
				next(e);
			}
		},

		// Inventory
		updateStock: async (req, res, next) => {
			try {
				const stock = await service.updateStock(
					Number(req.params.productId),
					req.body,
				);
				res.json({ data: stock });
			} catch (e) {
				next(e);
			}
		},

		getStock: async (req, res, next) => {
			try {
				const stock = await service.getStock(Number(req.params.productId));
				res.json({ data: stock });
			} catch (e) {
				next(e);
			}
		},
	};
};
