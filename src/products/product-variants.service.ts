import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from './dto/variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, dto: CreateProductVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        sku: dto.sku,
        name: dto.name,
        variantAttributes: dto.variantAttributes as any,
        price: dto.price,
        oldPrice: dto.oldPrice,
        stock: dto.stock,
        image: dto.image,
        weight: dto.weight,
      },
    });

    // Update product hasVariants flag
    await this.prisma.product.update({
      where: { id: productId },
      data: { hasVariants: true },
    });

    return variant;
  }

  async findByProduct(productId: number) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  async update(id: number, dto: UpdateProductVariantDto) {
    return this.prisma.productVariant.update({
      where: { id },
      data: {
        sku: dto.sku,
        name: dto.name,
        variantAttributes: dto.variantAttributes as any,
        price: dto.price,
        oldPrice: dto.oldPrice,
        stock: dto.stock,
        image: dto.image,
        status: dto.status as any,
        weight: dto.weight,
      },
    });
  }

  async delete(id: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    await this.prisma.productVariant.delete({ where: { id } });

    // Check if product still has variants
    const remainingVariants = await this.prisma.productVariant.count({
      where: { productId: variant.productId },
    });
    if (remainingVariants === 0) {
      await this.prisma.product.update({
        where: { id: variant.productId },
        data: { hasVariants: false },
      });
    }

    return { message: 'Variant deleted successfully' };
  }

  async updateStock(id: number, quantity: number) {
    return this.prisma.productVariant.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }
}
