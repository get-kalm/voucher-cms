import { voucherRepository } from "@/repository/voucher.repository";

export class voucherService {
  static async getAll() {
    return await voucherRepository.findAll();
  }

  static async findByCode(code: string) {
    const vouchers = await voucherRepository.findActiveAndUnredeemedCode(code)

    if (!vouchers || vouchers.length === 0) {
        return null
    }

    return vouchers[0]
  }

  static async create(name: string, isActive: boolean, expiryDate: Date) {
    const code = await this.validateUniqueCode();
    return voucherRepository.create(name, code, isActive, false, expiryDate);
  }

  static async redeemVoucher(code: string) {
    const vouchers = await voucherRepository.findActiveAndUnredeemedCode(code);

    if (vouchers.length === 0) {
        return null
    }

    const voucher = vouchers[0]

    return voucherRepository.update(voucher.name, voucher.code, voucher.isActive, true);
  }

  private static async validateUniqueCode(): Promise<string> {
    let code: string;
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      attempt++;
      code = this.generateCode();

      // TODO: create repo func to get all codes and loop through it to create validate uniqueness
      const existingCode = await voucherRepository.findByCode(code);
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