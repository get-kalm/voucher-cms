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

    async findByCode(req: NextRequest, code: string) {
        try {
            const voucher = await voucherService.findByCode(code);

            if (!voucher || voucher.length === 0) {
                return NextResponse.json(
                    { success: false, error: `Voucher with code "${code}" not found` },
                    { status: 404 }
                );
            }
            
            return NextResponse.json({ success: true, voucher });
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