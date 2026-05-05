import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalRevenue,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.category.count(),
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.order.count({ where: { status: "PENDING" } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return {
      total_users: totalUsers,
      total_products: totalProducts,
      total_orders: totalOrders,
      total_categories: totalCategories,
      total_revenue: totalRevenue._sum.totalAmount || 0,
      pending_orders: pendingOrders,
      recent_orders: recentOrders,
    };
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        _count: { select: { orderItems: true, ratings: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllFlashSales() {
    return this.prisma.flashSale.findMany({
      include: { products: { include: { product: true } } },
      orderBy: { startDate: "desc" },
    });
  }

  async getAllRatings() {
    return this.prisma.rating.findMany({
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
