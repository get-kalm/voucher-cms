import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/service/auth.service";
import { userService } from '@/service/user.service';

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
      const token = await authService.register(email, password);
      return NextResponse.json(
        { success: true, token: token },
        { status: 201 }
      );
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
      const token = await authService.login(email, password);
      return NextResponse.json(
        { success: true, token: token },
        { status: 200 }
      );
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  },

  async me(req: NextRequest) {
    try {
      const email = req.headers.get("x-user-email");
      if (!email) {
        return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
          );
      }
      const user = await userService.findByEmail(email)
      if (!user) {
          return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
          );
    }
    return NextResponse.json(
      { success: true, email: user.email, role: user.role },
      { status: 200 }
    );
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },

  async logout(req: NextRequest) {
    try {
      const userIDStr = req.headers.get("x-user-id");
      const token = req.headers.get("x-user-token");

      if (!userIDStr || !token) {
        return NextResponse.json(
          { success: false, message: "Missing authentication headers" },
          { status: 400 }
        );
      }

      await authService.logout(userIDStr, token);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  },
};
