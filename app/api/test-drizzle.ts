// pages/api/test-drizzle.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { usersTable } from "@/db/index";
import postgres from 'postgres';
import { eq } from "drizzle-orm";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(sql);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await db
    .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}