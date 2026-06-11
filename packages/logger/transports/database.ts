import { logsTable } from "@repo/database/models/log";

type DrizzleDB = {
  insert: (table: typeof logsTable) => {
    values: (row: {
      level: "error" | "info" | "debug";
      message: string;
      meta?: Record<string, unknown> | null;
      source?: string | null;
    }) => Promise<any>;
  };
};

interface DatabaseTransportOptions {
  db: DrizzleDB;
  source?: string;
}

export class DatabaseTransport {
  public level = "silly";
  private db: DrizzleDB;
  private source: string;

  constructor(opts: DatabaseTransportOptions) {
    this.db = opts.db;
    this.source = opts.source ?? "api";
  }

  log(
    info: { level: string; message: string; [key: string]: any },
    callback: () => void,
  ): void {
    const { level, message, ...meta } = info;
    const validLevel: "error" | "info" | "debug" = ["error", "info", "debug"].includes(level)
      ? (level as "error" | "info" | "debug")
      : "info";

    const payload: {
      level: "error" | "info" | "debug";
      message: string;
      meta?: Record<string, unknown> | null;
      source?: string | null;
    } = {
      level: validLevel,
      message,
      source: this.source,
    };

    const skipKeys = new Set(["timestamp", "splat", "stack"]);
    const metaKeys = Object.keys(meta).filter(
      (k) => !skipKeys.has(k) && !k.startsWith("Symbol("),
    );

    if (metaKeys.length > 0) {
      const cleanMeta: Record<string, unknown> = {};
      for (const key of metaKeys) {
        cleanMeta[key] = meta[key];
      }
      payload.meta = cleanMeta;
    }

    this.db
      .insert(logsTable)
      .values(payload)
      .catch((err: any) => {
        console.error("[DatabaseTransport] Failed to write log to database:", err);
      });

    callback();
  }
}
