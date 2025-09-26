import { NextRequest, NextResponse } from "next/server";
import { voucherService } from "@/service/voucher.service";

export const voucherController = {
  async getAll(req: NextRequest) {
    try {
      const data = await voucherService.getAll();
      return NextResponse.json({ success: true, data });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
  },

  async create(req: NextRequest) {
    try {
        const body = await req.json();
        const name = body.name
        const isActive = body.isActive
        await voucherService.create(name, isActive);
        return NextResponse.json({success: true}, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
  }
};