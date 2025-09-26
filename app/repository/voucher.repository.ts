import { db, vouchersTable } from "@/db/index";
import { and, eq, gt } from "drizzle-orm";

export class voucherRepository {
  static async findAll() {
    return db.select().from(vouchersTable);
  }

  static async create(name: string, code: string, isActive: boolean, isRedeemed: boolean, expiryDate: Date) {
    try {
        await db.insert(vouchersTable).values({
            name,
            code,
            isActive,
            isRedeemed,
            expiryDate
        })
    } catch (error: any) {
        if (error?.cause?.code === '23505') {
            throw new Error(error.cause.detail);
        }

        throw new Error('Failed to create voucher: ' + error.message);
    }
  }

  static async findByCode(code: string) {
    return db.select().from(vouchersTable).where(eq(vouchersTable.code, code));
  }

    static async findActiveAndUnredeemedCode(code: string, currentTime: Date) {
        return db
            .select()
            .from(vouchersTable)
            .where(
                and(
                    eq(vouchersTable.code, code),
                    eq(vouchersTable.isActive, true),
                    eq(vouchersTable.isRedeemed, false),
                    gt(vouchersTable.expiryDate, currentTime)
                )
            );
    }

    static async update(name: string, code: string, isActive: boolean, isRedeemed: boolean) {
        try {
            const voucher = await db.update(vouchersTable)
                .set({ 
                    name,
                    isActive,
                    isRedeemed, 
                    updatedAt: new Date() 
                })
                .where(eq(vouchersTable.code, code))

                return voucher;
        } catch (error: any) {
            throw new Error('Failed to update voucher:' + error.message);
        }
    }
};