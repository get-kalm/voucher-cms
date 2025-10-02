import { db, accessTokensTable } from "@/db/index";
import { and, eq, gt, sql } from "drizzle-orm";

export class accessTokenRepository {
  static async create(userID: number, token: string, expiredAt: Date) {
    await db.insert(accessTokensTable).values({
      userID,
      token,
      expiredAt,
    });
  }

  static async findByUserIDAndToken(
    userID: number,
    token: string,
    currentTime: Date
  ) {
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

  static async deleteByUserIDAndToken(userID: number, token: string) {
    return await db
      .update(accessTokensTable)
      .set({ deletedAt: sql`NOW()` })
      .where(
        and(
          eq(accessTokensTable.userID, userID),
          eq(accessTokensTable.token, token)
        )
      );
  }
}
