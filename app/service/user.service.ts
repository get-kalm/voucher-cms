import { userRepository } from "@/repository/user.repository";
import bcrypt from "bcrypt";

export class userService {
  static async create(email: string, password: string, role: string) {
    const hashed = await bcrypt.hash(password, 10);
    return userRepository.create(email, password, role);
  }
}
