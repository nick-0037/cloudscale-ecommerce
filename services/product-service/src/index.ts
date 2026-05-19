import express from "express";
import { globalErrorHandler, ConsulClient } from "@cloudscale/shared";
import { db } from "./db/index";
import { createProductService } from "./services/product.service";
import { createProductController } from "./controllers/product.controller";
import { createProductRouter } from "./routes/product.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "UP" }));

// Composition Root (Dependency Injection)
const productService = createProductService(db);
const productController = createProductController(productService);

// Routes
app.use("/api/products", createProductRouter(productController));

// Error handling
app.use(globalErrorHandler);

const PORT = Number(process.env.PORT) || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || "product-service";
const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;

const consul = new ConsulClient();

app.listen(PORT, async () => {
	console.log(`Product service is running on port ${PORT}`);
	await consul.register(SERVICE_NAME, PORT, SERVICE_ID);
});

// Graceful shutdown
const shutdown = async () => {
	await consul.deregister(SERVICE_ID);
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
