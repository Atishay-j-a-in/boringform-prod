import { z } from "zod";

const envSchema = z.object({
  // Add your VITE_ prefixed environment variables here
  // Example: VITE_API_URL: z.string().default("http://localhost:3000")
});

export const env = envSchema.parse({
  // Environment variables from import.meta.env (Vite handles .env files)
});
