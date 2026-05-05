import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order = await this.prisma.order.create({
      data: {
        userId: dto.user_id,
        orderNumber,
        totalAmount: dto.total_amount,
        shippingAddress: dto.shipping_address,
        billingAddress: dto.billing_address,
        paymentMethod: dto.payment_method,
        orderItems: {
          create: dto.items.map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
      include: { orderItems: true },
    });
    return order;
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(orderId: number, userId?: number) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({
      where,
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(orderId: number, status: string) {
    const updateData: any = { status };
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();
    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { orderItems: true },
    });
  }
}
