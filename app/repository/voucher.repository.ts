import { db, vouchersTable } from "@/db/index";
import { where, and, eq } from "drizzle-orm";

export class voucherRepository {
  static async findAll() {
    return db.select().from(vouchersTable);
  }

  static async create(name: string, code: string, isActive: boolean, isRedeemed: boolean) {
    try {
        await db.insert(vouchersTable).values({
            name,
            code,
            isActive,
            isRedeemed
        })
    } catch (error: any) {
        if (error.cause.code === '23505') {
            throw new Error(error.cause.detail);
        }

        throw new Error('Failed to create voucher:' + error.message);
    }
  }

  static async findByCode(code: string) {
    return db.select().from(vouchersTable).where(eq(vouchersTable.code, code));
  }

    static async findActiveAndUnredeemedCode(code: string) {
        return db
            .select()
            .from(vouchersTable)
            .where(
                and(
                    eq(vouchersTable.code, code),
                    eq(vouchersTable.isActive, true),
                    eq(vouchersTable.isRedeemed, false)
                )
            );
    }
};