import { db, usersTable } from "@/db/index";
import { eq } from "drizzle-orm";

export class userRepository {
  static async create(email: string, password: string) {
    try {
      await db.insert(usersTable).values({
        email,
        password,
      });
    } catch (error) {
      if (error?.cause?.code === "23505") {
        throw new Error(error.cause.detail);
      }

      throw new Error("Failed to create voucher: " + error.message);
    }
  }

  static async findByEmail(email: string) {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
  }
}
