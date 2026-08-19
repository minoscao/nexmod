import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsItems = sqliteTable("news_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("Company news"),
  publishedAt: text("published_at").notNull(),
  summary: text("summary").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const newsMedia = sqliteTable("news_media", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminSessions = sqliteTable("admin_sessions", {
  id: text("id").primaryKey(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
