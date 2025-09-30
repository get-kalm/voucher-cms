import { userController } from '@/controller/user.controller';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return userController.login(req);
}