import dotenv from "dotenv";
import path from "path";
import { envSchema } from "./env.schema";

// Load môi trường dựa vào NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Validate env variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format());
  throw new Error("Invalid environment variables.");
}

export const config = {
  env: env.data.NODE_ENV,
  port: env.data.PORT,
};
