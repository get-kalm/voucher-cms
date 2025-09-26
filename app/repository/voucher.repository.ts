import { db, vouchersTable } from "@/db/index";
import { eq } from "drizzle-orm";

export class voucherRepository {
  static async findAll() {
    return db.select().from(vouchersTable);
  }

  static async create(name: string, code: string, isActive: number, isRedeemed) {
    try {
        await db.insert(vouchersTable).values({
            name,
            code,
            isActive,
            isRedeemed: false
        })
    } catch (error) {
        if (error.cause.code === '23505') {
            throw new Error(error.cause.detail);
        }

        throw new Error('Failed to create voucher:' + error.message);
    }
  }

  static async getByCode(code: string) {
    return db.select().from(vouchersTable).where(eq(vouchersTable.code, code));
  }
};