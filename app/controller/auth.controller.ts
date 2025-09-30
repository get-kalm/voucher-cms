import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/service/auth.service";

export const authController = {
  async register(req: NextRequest) {
    try {
      const { email, password } = await req.json();
      if (!email) {
        return NextResponse.json(
          { success: false, message: "email is required" },
          { status: 500 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { success: false, message: "password is required" },
          { status: 500 }
        );
      }
      await authService.register(email, password);
      return NextResponse.json({ success: true }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  },

  async login(req: NextRequest) {
    try {
      const { email, password } = await req.json();
      if (!email) {
        return NextResponse.json(
          { success: false, message: "email is required" },
          { status: 500 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { success: false, message: "password is required" },
          { status: 500 }
        );
      }
      const res = await authService.login(email, password);
      return NextResponse.json({ success: true, token: res }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  },
};
