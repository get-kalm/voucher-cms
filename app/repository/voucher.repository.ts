import { db, vouchersTable } from "@/db/index";
import { eq } from "drizzle-orm";

export class voucherRepository {
  static async findAll() {
    return db.select().from(vouchersTable);
  }

  static async create(name: string, isActive: number, isRedeemed) {
    try {
        const code = await this.validateUniqueCode();
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

  private static async validateUniqueCode(): Promise<string> {
    let code: string;
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      attempt++;
      code = this.generateCode();

      const existingCode = await this.getByCode(code);
      if (existingCode.length === 0) {
        return code;
      }

      console.warn(`Duplicate code ${code}, retrying...`);
    }

    throw new Error("Failed to generate unique voucher code after retries");
  }

  private static generateCode(length: number = 8): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  }
};