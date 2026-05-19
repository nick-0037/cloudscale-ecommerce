import { Router } from "express";
import { validate, auth } from "@cloudscale/shared";
import {
	CreateCategorySchema,
	CreateProductSchema,
	UpdateInventorySchema,
	UpdateProductSchema,
} from "../schemas/product.schema";
import { IProductController } from "../controllers/product.controller";

export const createProductRouter = (controller: IProductController): Router => {
	const router = Router();

	// Categories
	router.get("/categories", controller.getCategories);
	router.post(
		"/categories",
		auth,
		validate(CreateCategorySchema),
		controller.createCategory,
	);

	// Products
	router.get("/", controller.getProducts);
	router.get("/:id", controller.getProduct);
	router.post(
		"/",
		auth,
		validate(CreateProductSchema),
		controller.createProduct,
	);
	router.patch(
		"/:id",
		auth,
		validate(UpdateProductSchema),
		controller.updateProduct,
	);
	router.delete("/:id", auth, controller.deleteProduct);

	// Inventory
	router.get("/inventory/:productId", controller.getStock);
	router.patch(
		"/inventory/:productId",
		auth,
		validate(UpdateInventorySchema),
		controller.updateStock,
	);

	return router;
};
