import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  API_TIMEOUT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("5000"),
});

export type Env = z.infer<typeof envSchema>;
