import { voucherController } from '@/controller/voucher.controller';
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params; // await params

  return voucherController.findByCode(req, code);
}