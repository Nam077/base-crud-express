import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)),
  
  // Database Configuration
  DB_TYPE: z.enum(["mysql", "sqlite"]).default("sqlite"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().transform((val) => parseInt(val, 10)).default("3306"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("sti_express"),
  DATABASE_URL: z.string().default("dev.db"),

  // JWT Configuration
  JWT_SECRET: z.string().min(32),

  // API Configuration
  API_PREFIX: z.string().default("/api"),
  API_VERSION: z.string().default("v1"),
  API_TIMEOUT: z.string().transform((val) => parseInt(val, 10)).default("5000"),

  // Logging
  LOG_FORMAT: z.string().default("combined"),
  LOG_DIR: z.string().default("logs"),

  // CORS
  ORIGIN: z.string().default("*"),
  CREDENTIALS: z.string().transform((val) => val === "true").default("true"),
});

type EnvSchemaType = z.infer<typeof envSchema>;

export class EnvConfig {
  private static instance: EnvConfig;
  private readonly config: EnvSchemaType;

  private constructor() {
    const envFile =
      process.env.NODE_ENV === "production"
        ? process.env.DOCKER_ENV 
          ? ".env.docker"
          : ".env.production"
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

  get dbConfig() {
    if (this.config.DB_TYPE === "mysql") {
      return {
        type: "mysql" as const,
        host: this.config.DB_HOST,
        port: this.config.DB_PORT,
        username: this.config.DB_USER,
        password: this.config.DB_PASSWORD,
        database: this.config.DB_NAME,
      } as const;
    }
    
    return {
      type: "sqlite" as const,
      database: this.config.DATABASE_URL,
    } as const;
  }

  get jwtSecret() {
    return this.config.JWT_SECRET;
  }

  get apiTimeout() {
    return this.config.API_TIMEOUT;
  }

  get apiPrefix() {
    return this.config.API_PREFIX;
  }

  get apiVersion() {
    return this.config.API_VERSION;
  }

  get logFormat() {
    return this.config.LOG_FORMAT;
  }

  get logDir() {
    return this.config.LOG_DIR;
  }

  get origin() {
    return this.config.ORIGIN;
  }

  get credentials() {
    return this.config.CREDENTIALS;
  }
}
