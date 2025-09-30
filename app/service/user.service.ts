import { userRepository } from "@/repository/user.repository";

export class userService {
  static async create(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return userRepository.create(email, password)
  }
}
