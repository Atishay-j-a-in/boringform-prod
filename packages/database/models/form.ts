import { pgTable, uuid, varchar, timestamp, boolean, text, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm/relations";
import { fieldsTable } from "./field";

export const visibilityEnum = pgEnum("visibility", ["public", "unlisted"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  isProtected: boolean("is_protected").default(false).notNull(),
  password: text("password"),

  isPublished: boolean("is_published").default(true).notNull(),
  visibility: visibilityEnum("visibility").default("unlisted").notNull(),

  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const formsRelations = relations(formsTable, ({ many }) => ({
  fields: many(fieldsTable),
}));
