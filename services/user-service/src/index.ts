import express from "express";
import { globalErrorHandler } from "@cloudscale/shared";
import { db } from "./db/index";
import { createUserService } from "./services/auth.service";
import { createUserController } from "./controllers/auth.controller";
import { createAuthRouter } from "./routes/auth.routes";

const app = express();

app.use(express.json());

const userService = createUserService(db);
const userController = createUserController(userService);

app.use("/auth", createAuthRouter(userController));

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`User service is running on port ${PORT}`);
});
