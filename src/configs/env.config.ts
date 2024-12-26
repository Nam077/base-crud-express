import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

const envSchema = z.object({
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

export class EnvConfig {
  private static instance: EnvConfig;
  private readonly config: z.infer<typeof envSchema>;

  private constructor() {
    const envFile =
      process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

    dotenv.config({ path: path.resolve(process.cwd(), envFile) });
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.error("❌ Invalid environment variables:", result.error.format());
      throw new Error("Invalid environment variables.");
    }

    this.config = result.data;
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  get env() {
    return this.config.NODE_ENV;
  }
  get port() {
    return this.config.PORT;
  }
  get databaseUrl() {
    return this.config.DATABASE_URL;
  }
  get jwtSecret() {
    return this.config.JWT_SECRET;
  }
  get apiTimeout() {
    return this.config.API_TIMEOUT;
  }
}
