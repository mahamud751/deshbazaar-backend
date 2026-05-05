import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FlashSalesService {
  constructor(private prisma: PrismaService) {}

  async findActive() {
    const now = new Date();
    return this.prisma.flashSale.findMany({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      include: { products: { include: { product: true } } },
    });
  }

  async findUpcoming() {
    const now = new Date();
    return this.prisma.flashSale.findMany({
      where: { isActive: true, startDate: { gt: now } },
      include: { products: { include: { product: true } } },
    });
  }

  async findAll() {
    return this.prisma.flashSale.findMany({
      include: { products: { include: { product: true } } },
      orderBy: { startDate: "desc" },
    });
  }
}
