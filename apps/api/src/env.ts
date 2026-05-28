import { z } from "zod";
import { TRPCError } from "@trpc/server";

const envSchema = z.object({
  PORT: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  BASE_URL: z.string().default("http://localhost:8000"),
  NODE_ENV:  z.enum(["development", "production"]).default("development"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success)
    throw new TRPCError({ code: "BAD_REQUEST", message: safeParseResult.error.message });
  return safeParseResult.data;
}

export const env = createEnv(process.env);
