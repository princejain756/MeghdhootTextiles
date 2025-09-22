import { config as loadEnv } from "dotenv";
import { z } from "zod";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
loadEnv({ path: envFile });
loadEnv();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  NODE_ENV: z.string().optional().default("development"),
  CLIENT_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const ENV = {
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  nodeEnv: parsed.data.NODE_ENV || "development",
  clientOrigin: parsed.data.CLIENT_ORIGIN,
};
