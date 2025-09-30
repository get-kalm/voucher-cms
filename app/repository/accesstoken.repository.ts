import { db, accessTokensTable } from "@/db/index";
import { and, eq, gt } from "drizzle-orm";

export class accessTokenRepository {
  static async create(userID: integer, token: string, expiredAt: Date) {
    await db.insert(accessTokensTable).values({
      userID,
      token,
      expiredAt,
    });
  }

  static async findByUserIDAndToken(userID: integer, token: string, currentTime: Date) {
    return db
      .select()
      .from(accessTokensTable)
      .where(
        and(
          eq(accessTokensTable.userID, userID),
          eq(accessTokensTable.token, token),
          gt(accessTokensTable.expiredAt, currentTime)
        )
      )
      .limit(1);
  }
}
