import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";

export interface AuthRequest extends Request {
	user?: {
		id: number;
	};
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return next(new AppError(401, "No token provided"));
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
			id: number;
		};

		req.user = { id: decoded.id };
		next();
	} catch (error) {
		next(new AppError(401, "Invalid or expired token"));
	}
};
