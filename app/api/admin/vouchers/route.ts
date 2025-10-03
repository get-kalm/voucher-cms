import { voucherController } from '@/controller/voucher.controller';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return voucherController.getAll(req);
}

export async function POST(req: NextRequest) {
  return voucherController.create(req);
}

export async function PUT(req: NextRequest) {
  return voucherController.update(req);
}