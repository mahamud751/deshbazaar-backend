import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: number, productId: number) {
    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });
  }

  async remove(id: number) {
    return this.prisma.wishlist.delete({ where: { id } });
  }

  async check(userId: number, productId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return { exists: !!item };
  }

  async toggle(userId: number, productId: number) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await this.prisma.wishlist.delete({ where: { id: existing.id } });
      return { added: false, removed: true };
    }
    const created = await this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });
    return { added: true, removed: false, item: created };
  }

  async findByUser(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
