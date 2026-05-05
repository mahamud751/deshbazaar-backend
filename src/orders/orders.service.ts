import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Build order items with vendor and commission info
    const orderItemsData = [];
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.product_id },
        include: { vendor: true },
      });
      if (!product)
        throw new NotFoundException(`Product ${item.product_id} not found`);

      const commissionRate = product.vendor?.commissionRate || 10;
      const itemTotal = Number(item.price) * item.quantity;
      const commissionAmt = (itemTotal * Number(commissionRate)) / 100;
      const vendorEarning = itemTotal - commissionAmt;

      orderItemsData.push({
        productId: item.product_id,
        variantId: null,
        vendorId: product.vendorId,
        productName: item.product_name,
        productImage: product.image,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        commissionRate,
        commissionAmt,
        vendorEarning,
        itemStatus: 'PENDING' as any,
      });
    }

    const order = await this.prisma.order.create({
      data: {
        userId: dto.user_id,
        orderNumber,
        totalAmount: dto.total_amount,
        shippingAddress: dto.shipping_address,
        billingAddress: dto.billing_address,
        paymentMethod: dto.payment_method,
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: true },
    });
    return order;
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: { select: { id: true, name: true, image: true } },
            vendor: { select: { id: true, shopName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(orderId: number, userId?: number) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: { select: { id: true, name: true, image: true } },
            vendor: { select: { id: true, shopName: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: number, status: string) {
    const updateData: any = { status };
    if (status === 'SHIPPED') updateData.shippedAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();
    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { orderItems: true },
    });
  }
}
