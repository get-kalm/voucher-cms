import { accessTokenRepository } from "@/repository/accesstoken.repository";
import { userRepository } from "@/repository/user.repository";
import { signJwt } from "@/lib/jwt";
import bcrypt from "bcrypt";

export class authService {
  static async register(email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userRepository.create(email, hashedPassword);

      const token = await signJwt({ id: user.id, email: user.email });
      const currentTime = new Date();
      const expiredAt = new Date(
        currentTime.setMonth(currentTime.getDate() + 7)
      );

      await accessTokenRepository.create(user.id, token, expiredAt);
      return token;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error("invalid credentials");
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("invalid credentials");
      return;
    }

    const token = await signJwt({ id: user.id, email: user.email });
    const currentTime = new Date();
    const expiredAt = new Date(currentTime.setMonth(currentTime.getDate() + 7));
    await accessTokenRepository.create(user.id, token, expiredAt);
    return token;
  }

  static async findByUserIDAndToken(userID: number, token: string) {
    try {
      const currentTime = new Date();
      const accessToken = await accessTokenRepository.findByUserIDAndToken(
        userID,
        token,
        currentTime
      );
      if (!accessToken || accessToken.length === 0) {
        return null;
      }

      return accessToken;
    } catch (error: any) {
      return error.message;
    }
  }

  private static async findByEmail(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user || user.length === 0) {
      return null;
    }

    return user[0];
  }
}
