import { voucherRepository } from "@/repository/voucher.repository";

export class voucherService {
  static async getAll() {
    return await voucherRepository.findAll();
  }

  static async create(name: string, isActive: boolean) {
    return voucherRepository.create(name, isActive);
  }
};