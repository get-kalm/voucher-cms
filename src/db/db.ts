import 'dotenv/config';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const isProduction = process.env.NODE_ENV === "production";

const sql = isProduction ? postgres(process.env.DATABASE_URL!, {
  ssl: {
    rejectUnauthorized: false,
  },
}) : postgres(process.env.DATABASE_URL!);

export const db = drizzle(sql);
