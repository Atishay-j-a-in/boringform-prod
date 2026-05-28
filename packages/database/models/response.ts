import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface Response {
  fieldId: string;
  value: string;
}
export type FormSubmissionValues = Response[];

export const responseTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }),
  values: json("values").$type<FormSubmissionValues>(),
  createdAt: timestamp("created_at").defaultNow(),
});
