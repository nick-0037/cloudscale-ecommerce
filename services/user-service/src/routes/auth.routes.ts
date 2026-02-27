import { Router } from "express";
import { validate, auth } from "@cloudscale/shared";
import {
	LoginSchema,
	RegisterSchema,
	UpdateProfileSchema,
} from "../schemas/auth.schema";
import { IUserController } from "../controllers/auth.controller";

export const createAuthRouter = (controller: IUserController): Router => {
	const router = Router();

	router.post("/register", validate(RegisterSchema), controller.register);
	router.post("/login", validate(LoginSchema), controller.login);
	router.get("/me", auth, controller.getProfile);
	router.patch(
		"/me",
		auth,
		validate(UpdateProfileSchema),
		controller.updateProfile,
	);

	return router;
};
