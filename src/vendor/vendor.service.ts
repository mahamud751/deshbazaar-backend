import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async register(userId: number, dto: CreateVendorDto) {
    const existing = await this.prisma.vendor.findUnique({ where: { userId } });
    if (existing)
      throw new BadRequestException('User already has a vendor account');

    const slug =
      dto.slug ||
      dto.shop_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const slugExists = await this.prisma.vendor.findUnique({ where: { slug } });
    if (slugExists) throw new BadRequestException('Shop slug already taken');

    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        shopName: dto.shop_name,
        slug,
        description: dto.description,
        logo: dto.logo,
        banner: dto.banner,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        email: dto.email,
        bankName: dto.bank_name,
        bankAccount: dto.bank_account,
        bankBranch: dto.bank_branch,
        commissionRate: 10, // Default 10% commission
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // Update user role to VENDOR
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' },
    });

    return vendor;
  }

  async findByUser(userId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async findById(id: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true,
      },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async findBySlug(slug: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { slug },
      include: { products: { where: { isActive: true } } },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async findAll(page = 1, perPage = 20, status?: string) {
    const skip = (page - 1) * perPage;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take: perPage,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendor.count({ where }),
    ]);
    return { data, total, page, per_page: perPage };
  }

  async update(userId: number, dto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        shopName: dto.shop_name,
        description: dto.description,
        logo: dto.logo,
        banner: dto.banner,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        email: dto.email,
        bankName: dto.bank_name,
        bankAccount: dto.bank_account,
        bankBranch: dto.bank_branch,
        commissionRate: dto.commission_rate,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async approve(vendorId: number) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'APPROVED' },
    });
  }

  async suspend(vendorId: number) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'SUSPENDED' },
    });
  }

  async reject(vendorId: number) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'REJECTED' },
    });
  }

  // Vendor Dashboard Stats
  async getDashboardStats(vendorId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.product.count({ where: { vendorId } }),
      this.prisma.orderItem.count({ where: { vendorId } }),
      this.prisma.orderItem.count({
        where: { vendorId, itemStatus: 'PENDING' },
      }),
      this.prisma.orderItem.aggregate({
        where: { vendorId, itemStatus: 'DELIVERED' },
        _sum: { vendorEarning: true },
      }),
      this.prisma.orderItem.findMany({
        where: { vendorId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, image: true } },
          order: { select: { id: true, orderNumber: true } },
        },
      }),
    ]);

    return {
      total_products: totalProducts,
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      total_revenue: totalRevenue._sum.vendorEarning || 0,
      commission_rate: vendor.commissionRate,
      shop_status: vendor.status,
      recent_orders: recentOrders,
    };
  }

  // Get vendor orders
  async getVendorOrders(
    vendorId: number,
    status?: string,
    page = 1,
    perPage = 20,
  ) {
    const skip = (page - 1) * perPage;
    const where: any = { vendorId };
    if (status) where.itemStatus = status;

    const [data, total] = await Promise.all([
      this.prisma.orderItem.findMany({
        where,
        skip,
        take: perPage,
        include: {
          product: { select: { id: true, name: true, image: true } },
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              createdAt: true,
            },
          },
          variant: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.orderItem.count({ where }),
    ]);
    return { data, total, page, per_page: perPage };
  }

  // Update order item status (vendor ships, etc.)
  async updateOrderItemStatus(
    vendorId: number,
    orderItemId: number,
    status: string,
  ) {
    const item = await this.prisma.orderItem.findFirst({
      where: { id: orderItemId, vendorId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    return this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { itemStatus: status as any },
    });
  }

  // Get vendor earnings/payouts
  async getVendorEarnings(vendorId: number) {
    const [totalEarnings, pendingPayouts, completedPayouts, recentPayouts] =
      await Promise.all([
        this.prisma.orderItem.aggregate({
          where: { vendorId, itemStatus: 'DELIVERED' },
          _sum: { vendorEarning: true },
        }),
        this.prisma.vendorPayout.aggregate({
          where: { vendorId, status: 'PENDING' },
          _sum: { netAmount: true },
        }),
        this.prisma.vendorPayout.aggregate({
          where: { vendorId, status: 'COMPLETED' },
          _sum: { netAmount: true },
        }),
        this.prisma.vendorPayout.findMany({
          where: { vendorId },
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    return {
      total_earnings: totalEarnings._sum.vendorEarning || 0,
      pending_payouts: pendingPayouts._sum.netAmount || 0,
      completed_payouts: completedPayouts._sum.netAmount || 0,
      recent_payouts: recentPayouts,
    };
  }

  // Get vendor products
  async getVendorProducts(vendorId: number, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { vendorId },
        skip,
        take: perPage,
        include: {
          category: true,
          variants: true,
          _count: { select: { orderItems: true, ratings: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { vendorId } }),
    ]);
    return { data, total, page, per_page: perPage };
  }
}
