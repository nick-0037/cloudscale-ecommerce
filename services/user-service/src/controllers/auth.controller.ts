import { RequestHandler } from "express";
import { IUserService } from "../services/auth.service";
import {
	LoginInput,
	RegisterInput,
	UpdateProfileInput,
} from "../schemas/auth.schema";
import { AuthRequest } from "@cloudscale/shared";

export interface IUserController {
	register: RequestHandler;
	login: RequestHandler;
	getProfile: RequestHandler;
	updateProfile: RequestHandler;
}

export const createUserController = (
	userService: IUserService,
): IUserController => {
	const register: RequestHandler = async (req, res, next) => {
		try {
			const userData = req.body as RegisterInput;
			const { user } = await userService.register(userData);
			res.status(201).json({
				data: user,
			});
		} catch (e) {
			next(e);
		}
	};

	const login: RequestHandler = async (req, res, next) => {
		try {
			const userData = req.body as LoginInput;
			const { user, token } = await userService.login(userData);
			res.status(200).json({ data: { user, token } });
		} catch (e) {
			next(e);
		}
	};

	const getProfile: RequestHandler = async (req, res, next) => {
		try {
			const userId = (req as AuthRequest).user?.id;
			if (!userId) throw new Error("Unauthorized");

			const { user } = await userService.getProfile(userId);
			res.status(200).json({ data: user });
		} catch (e) {
			next(e);
		}
	};

	const updateProfile: RequestHandler = async (req, res, next) => {
		try {
			const userId = (req as AuthRequest).user?.id;
			if (!userId) throw new Error("Unauthorized");

			const userData = req.body as UpdateProfileInput;
			const { user } = await userService.updateProfile(userId, userData);
			res.status(200).json({ data: user });
		} catch (e) {
			next(e);
		}
	};

	return { register, login, getProfile, updateProfile };
};
