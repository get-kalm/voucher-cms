import { voucherController } from '@/controller/voucher.controller';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return voucherController.redeemVoucher(req);
}