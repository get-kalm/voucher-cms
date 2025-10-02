// pages/api/test-db.ts
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { usersTable } from "@/db/index";
import { eq } from "drizzle-orm";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const result = await sql`SELECT 1`;
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

const db = drizzle(sql);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "rayendratimotius@gmail.com"))
      .limit(1);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.log("error:", error)
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
