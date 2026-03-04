import { RequestHandler } from "express";
import { AuthResponse, IUserService } from "../services/auth.service";
import {
	LoginInput,
	RegisterInput,
	UpdateProfileInput,
} from "../schemas/auth.schema";

type ApiResponse<T> = { data: T } | { error: string };

export interface IUserController {
	// Auth
	register: RequestHandler<
		{},
		ApiResponse<AuthResponse["user"]>,
		RegisterInput
	>;
	login: RequestHandler<{}, ApiResponse<AuthResponse>, LoginInput>;

	// Manage profiles
	getProfile: RequestHandler<{}, ApiResponse<AuthResponse["user"]>>;
	updateProfile: RequestHandler<
		{},
		ApiResponse<AuthResponse["user"]>,
		UpdateProfileInput
	>;
}

export const createUserController = (
	userService: IUserService,
): IUserController => {
	return {
		// Auth
		register: async (req, res, next) => {
			try {
				const { user } = await userService.register(req.body);
				res.status(201).json({
					data: user,
				});
			} catch (e) {
				next(e);
			}
		},

		login: async (req, res, next) => {
			try {
				const response = await userService.login(req.body);
				res.status(200).json({ data: response });
			} catch (e) {
				next(e);
			}
		},

		// Manage profiles

		getProfile: async (req, res, next) => {
			try {
				const userId = req.user?.id;
				if (!userId) throw new Error("Unauthorized");

				const { user } = await userService.getProfile(userId);
				res.status(200).json({ data: user });
			} catch (e) {
				next(e);
			}
		},

		updateProfile: async (req, res, next) => {
			try {
				const userId = req.user?.id;
				if (!userId) throw new Error("Unauthorized");

				const { user } = await userService.updateProfile(userId, req.body);
				res.status(200).json({ data: user });
			} catch (e) {
				next(e);
			}
		},
	};
};
