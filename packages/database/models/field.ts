import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  numeric,
  unique,
  json,
} from "drizzle-orm/pg-core";
import { formsTable } from "../models/form";
import { relations } from "drizzle-orm";


export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "radio",
  "boolean",
  "date",
  "email",
  "number",
  "rate",
  "checkbox",
  "tel",
  "file",
  "textarea",
]);

export interface Option{
  label: string;
}
export type Options=Option[];
export const fieldsTable = pgTable(
  "fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),

    label: varchar("label", { length: 255 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),
    isRequired: boolean("is_required").default(false),
    index: numeric("index", { scale: 2 }).notNull(),

    type: fieldTypeEnum().notNull(),
    options: json("options").$type<Options>(),
  },
  (table) => {
    return {
      uniqueFormIdandIndex: unique().on(table.formId, table.index),
    };
  },
);

export const fieldsRelations = relations(fieldsTable, ({ one }) => ({
  form: one(formsTable, {
    fields: [fieldsTable.formId],
    references: [formsTable.id],
  }),
}));
