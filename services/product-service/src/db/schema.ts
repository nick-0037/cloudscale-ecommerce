import {
	pgTable,
	serial,
	text,
	varchar,
	timestamp,
	numeric,
	integer,
	jsonb,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	categoryId: integer("category_id").references(() => categories.id),
	imageUrl: text("image_url"),
	attributes: jsonb("attributes").default({}),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
	id: serial("id").primaryKey(),
	productId: integer("product_id")
		.references(() => products.id)
		.notNull()
		.unique(),
	quantity: integer("quantity").notNull().default(0),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
