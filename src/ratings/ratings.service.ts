import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRatingDto } from "./dto/create-rating.dto";

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: {
        userId: dto.user_id,
        productId: dto.product_id,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment || "",
        verified: dto.verified || false,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findByProduct(productId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { productId, approved: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return { data: ratings };
  }

  async findAll() {
    return this.prisma.rating.findMany({
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async approve(id: number) {
    return this.prisma.rating.update({
      where: { id },
      data: { approved: true },
    });
  }

  async reject(id: number) {
    return this.prisma.rating.update({
      where: { id },
      data: { approved: false },
    });
  }

  async getReviewableProducts(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId, status: "DELIVERED" },
      include: { orderItems: { include: { product: true } } },
    });
    const products = orders.flatMap((order) =>
      order.orderItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
      })),
    );
    // Remove duplicates
    const unique = products.filter(
      (p, i, arr) => arr.findIndex((t) => t.id === p.id) === i,
    );
    return unique;
  }
}
