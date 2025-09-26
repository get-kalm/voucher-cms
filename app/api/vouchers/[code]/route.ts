import { voucherController } from '@/controller/voucher.controller';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  return voucherController.findByCode(req, params.code);
}