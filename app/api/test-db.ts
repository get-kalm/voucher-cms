// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import postgres from 'postgres';
import { drizzle } from "drizzle-orm/postgres-js";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await sql`SELECT 1`;
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}