import { voucherRepository } from "@/repository/voucher.repository";

export class voucherService {
  static async getAll() {
    return await voucherRepository.findAll();
  }

  static async findByCodeForRedeem(code: string) {
    try {
      const voucher = await this.validateVoucher(code);

      return voucher;
    } catch (error) {
      return null;
    }
  }

  static async create(name: string, isActive: boolean, expiryDate: Date) {
    const code = await this.validateUniqueCode();

    const currentTime = new Date();
    const minimumExpiryDate = new Date(
      currentTime.setMonth(currentTime.getMonth() + 1)
    );
    if (expiryDate < minimumExpiryDate) {
      throw new Error("expiry date must be at least 1 month from now");
    }

    return voucherRepository.create(name, code, isActive, false, expiryDate);
  }

  static async redeemVoucher(code: string) {
    const currentTime = new Date();
    const voucher = await this.validateVoucher(code);

    if (!voucher) {
      return null;
    }

    return voucherRepository.update(
      voucher.name,
      voucher.code,
      voucher.isActive,
      true,
      voucher.expiryDate
    );
  }

  static async update(name: string, code: string, isActive: boolean, expiryDate: Date) {
    const voucher = await this.findByCode(code);

    if (!voucher) {
      return null;
    }

    return voucherRepository.update(
      name,
      voucher.code,
      isActive,
      voucher.isRedeemed,
      expiryDate,
    );
  }

  private static async validateVoucher(code: string) {
    const currentTime = new Date();
    const voucher = await this.findByCode(code)
    if (!voucher) {
        return null;
    }

    if (!voucher.isActive) {
      throw new Error(`Voucher not active`);
    }
    if (voucher.isRedeemed) {
      throw new Error(`Voucher redeemed`);
    }
    if (voucher.expiryDate <= currentTime) {
      throw new Error("voucher expired");
    }

    return voucher;
  }

  private static async findByCode(code: string) {
    const vouchers = await voucherRepository.findByCode(code);

    if (!vouchers || vouchers.length === 0) {
      return null;
    }

    return vouchers[0];
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
}
