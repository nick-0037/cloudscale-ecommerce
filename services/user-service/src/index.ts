import express from "express";
import { globalErrorHandler, ConsulClient } from "@cloudscale/shared";
import { db } from "./db/index";
import { createUserService } from "./services/auth.service";
import { createUserController } from "./controllers/auth.controller";
import { createAuthRouter } from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "UP" }));

const userService = createUserService(db);
const userController = createUserController(userService);

app.use("/auth", createAuthRouter(userController));

app.use(globalErrorHandler);

const PORT = Number(process.env.PORT) || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "user-service";
const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;

const consul = new ConsulClient();

app.listen(PORT, async () => {
	console.log(`User service is running on port ${PORT}`);
	await consul.register(SERVICE_NAME, PORT, SERVICE_ID);
});

// Graceful shutdown
const shutdown = async () => {
	await consul.deregister(SERVICE_ID);
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
