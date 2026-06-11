import winston from "winston";
import { env } from "./env";
import { DatabaseTransport } from "./transports/database";

type LoggerLevel = "error" | "info" | "debug";

type DrizzleDB = {
  insert: (table: any) => {
    values: (row: any) => Promise<any>;
  };
};

const level: LoggerLevel = env.LOGGER_LEVEL ?? (env.NODE_ENV === "development" ? "debug" : "error");

const isDevelopment = env.NODE_ENV === "development";

const format = isDevelopment
  ? winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
        return `${timestamp} [${level}]: ${message}${metaString}`;
      }),
    )
  : winston.format.combine(winston.format.timestamp(), winston.format.json());

function createTransports(db?: DrizzleDB) {
  const transports: winston.transport[] = [new winston.transports.Console()];

  if (db) {
    transports.push(
      new DatabaseTransport({
        db,
        source: isDevelopment ? "api-dev" : "api",
      }) as unknown as winston.transport,
    );
  }

  return transports;
}

export function createLogger(db?: DrizzleDB) {
  return winston.createLogger({
    level,
    format,
    transports: createTransports(db),
  });
}

export const logger = createLogger();
