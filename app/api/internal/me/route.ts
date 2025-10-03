import { authController } from '@/controller/auth.controller';
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  return authController.me(req);
}