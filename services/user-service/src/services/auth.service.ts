import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	LoginInput,
	RegisterInput,
	UpdateProfileInput,
} from "../schemas/auth.schema";
import { AppError } from "@cloudscale/shared";

export const createUserService = (
	db: PostgresJsDatabase<Record<string, unknown>>,
) => ({
	register: async (userData: RegisterInput) => {
		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.email, userData.email))
			.limit(1);
		if (existingUser) {
			throw new AppError(409, "User already exists");
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10);

		const [user] = await db
			.insert(users)
			.values({
				...userData,
				password: hashedPassword,
			})
			.returning();

		const { password: _, ...userWithoutPassword } = user;
		return { user: userWithoutPassword };
	},
	login: async (userData: LoginInput) => {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, userData.email))
			.limit(1);
		if (!user) {
			throw new AppError(401, "Invalid credentials");
		}

		const isMatch = await bcrypt.compare(userData.password, user.password);
		if (!isMatch) {
			throw new AppError(401, "Invalid credentials");
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
			expiresIn: "15m",
		});

		const { password: _, ...userWithoutPassword } = user;
		return { user: userWithoutPassword, token };
	},
	getProfile: async (userId: number) => {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			throw new AppError(404, "User not found");
		}

		const { password: _, ...userWithoutPassword } = user;
		return { user: userWithoutPassword };
	},
	updateProfile: async (userId: number, data: UpdateProfileInput) => {
		const [user] = await db
			.update(users)
			.set(data)
			.where(eq(users.id, userId))
			.returning();

		if (!user) {
			throw new AppError(404, "User not found");
		}

		const { password: _, ...userWithoutPassword } = user;
		return { user: userWithoutPassword };
	},
});

export type IUserService = ReturnType<typeof createUserService>;
