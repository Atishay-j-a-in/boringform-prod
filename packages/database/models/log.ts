import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  json,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const logLevelEnum = pgEnum("log_level", ["error", "info", "debug"]);

export const logsTable = pgTable(
  "logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    level: logLevelEnum("level").notNull(),
    message: text("message").notNull(),
    meta: json("meta"),
    source: varchar("source", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    levelIdx: index("logs_level_idx").on(table.level),
    createdAtIdx: index("logs_created_at_idx").on(table.createdAt),
    sourceIdx: index("logs_source_idx").on(table.source),
  }),
);
