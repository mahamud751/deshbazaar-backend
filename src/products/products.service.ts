import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 100) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: perPage,
        include: {
          category: true,
          flashSales: { include: { flashSale: true } },
        },
      }),
      this.prisma.product.count(),
    ]);
    return { data, total, page, per_page: perPage };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        flashSales: { include: { flashSale: true } },
        ratings: true,
      },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async findByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true, flashSales: { include: { flashSale: true } } },
    });
    return { data: products };
  }

  async findByCategoryName(categoryName: string) {
    const category = await this.prisma.category.findFirst({
      where: { name: { contains: categoryName, mode: "insensitive" } },
    });
    if (!category) return { category: null, products: [] };
    const products = await this.prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true, flashSales: { include: { flashSale: true } } },
    });
    return { category, products };
  }

  async findFlashSaleProducts() {
    const now = new Date();
    const flashSaleProducts = await this.prisma.flashSaleProduct.findMany({
      where: {
        flashSale: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: {
        product: {
          include: {
            category: true,
            flashSales: { include: { flashSale: true } },
          },
        },
      },
    });
    return { data: flashSaleProducts.map((fsp) => fsp.product) };
  }

  async filter(params: {
    category_id?: number;
    category_slug?: string;
    search?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }) {
    const where: any = {};
    if (params.category_id) where.categoryId = params.category_id;
    if (params.search)
      where.name = { contains: params.search, mode: "insensitive" };
    if (params.brand)
      where.brand = { contains: params.brand, mode: "insensitive" };
    if (params.min_price !== undefined || params.max_price !== undefined) {
      where.price = {};
      if (params.min_price !== undefined) where.price.gte = params.min_price;
      if (params.max_price !== undefined) where.price.lte = params.max_price;
    }

    if (params.category_slug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: params.category_slug },
      });
      if (category) where.categoryId = category.id;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price_asc") orderBy = { price: "asc" };
    if (params.sort === "price_desc") orderBy = { price: "desc" };
    if (params.sort === "name_asc") orderBy = { name: "asc" };

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      include: { category: true, flashSales: { include: { flashSale: true } } },
    });
    return { data: products };
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        oldPrice: dto.old_price,
        image: dto.image,
        brand: dto.brand,
        size: dto.size,
        color: dto.color,
        shippedFrom: dto.shipped_from,
        warranty: dto.warranty,
        deliveryOption: dto.delivery_option,
        promotions: dto.promotions || [],
        specifications: dto.specifications as any,
        categoryId: dto.category_id,
        isActive: dto.is_active,
        stockQuantity: dto.stock_quantity,
        rating: dto.rating,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: Partial<CreateProductDto>) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        oldPrice: dto.old_price,
        image: dto.image,
        brand: dto.brand,
        size: dto.size,
        color: dto.color,
        shippedFrom: dto.shipped_from,
        warranty: dto.warranty,
        deliveryOption: dto.delivery_option,
        promotions: dto.promotions,
        specifications: dto.specifications as any,
        categoryId: dto.category_id,
        isActive: dto.is_active,
        stockQuantity: dto.stock_quantity,
        rating: dto.rating,
      },
      include: { category: true },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
