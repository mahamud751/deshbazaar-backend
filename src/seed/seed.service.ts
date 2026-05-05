import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const existingUsers = await this.prisma.user.count();
    if (existingUsers > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await this.prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@deshbazaar.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const userPassword = await bcrypt.hash('password123', 10);
    const user = await this.prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@example.com',
        password: userPassword,
        role: 'USER',
      },
    });

    // Create vendor users
    const vendor1Password = await bcrypt.hash('vendor123', 10);
    const vendor1User = await this.prisma.user.create({
      data: {
        name: 'Rahim Electronics',
        email: 'rahim@vendor.com',
        password: vendor1Password,
        role: 'VENDOR',
      },
    });

    const vendor2Password = await bcrypt.hash('vendor123', 10);
    const vendor2User = await this.prisma.user.create({
      data: {
        name: 'Karim Fashion House',
        email: 'karim@vendor.com',
        password: vendor2Password,
        role: 'VENDOR',
      },
    });

    const vendor3Password = await bcrypt.hash('vendor123', 10);
    const vendor3User = await this.prisma.user.create({
      data: {
        name: 'Organic BD',
        email: 'organic@vendor.com',
        password: vendor3Password,
        role: 'VENDOR',
      },
    });

    // Create categories
    await this.prisma.category.createMany({
      data: [
        {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and accessories',
          image: '/assets/category/01.png',
          isActive: true,
          sortOrder: 1,
        },
        {
          name: 'Fashion',
          slug: 'fashion',
          description: 'Clothing and fashion accessories',
          image: '/assets/category/02.jpg',
          isActive: true,
          sortOrder: 2,
        },
        {
          name: 'Home & Garden',
          slug: 'home-garden',
          description: 'Home improvement and garden supplies',
          image: '/assets/category/03.jpg',
          isActive: true,
          sortOrder: 3,
        },
        {
          name: 'Sports',
          slug: 'sports',
          description: 'Sports equipment and accessories',
          image: '/assets/category/04.jpg',
          isActive: true,
          sortOrder: 4,
        },
        {
          name: 'Beauty',
          slug: 'beauty',
          description: 'Beauty and personal care products',
          image: '/assets/category/05.jpg',
          isActive: true,
          sortOrder: 5,
        },
        {
          name: 'Books',
          slug: 'books',
          description: 'Books and educational materials',
          image: '/assets/category/06.jpg',
          isActive: true,
          sortOrder: 6,
        },
        {
          name: 'Organic Essentials',
          slug: 'organic-essentials',
          description: 'Organic food and essentials',
          image: '/assets/category/07.jpg',
          isActive: true,
          sortOrder: 7,
        },
      ],
    });

    const allCategories = await this.prisma.category.findMany();
    const electronics = allCategories.find((c) => c.slug === 'electronics');
    const fashion = allCategories.find((c) => c.slug === 'fashion');
    const sports = allCategories.find((c) => c.slug === 'sports');
    const homeGarden = allCategories.find((c) => c.slug === 'home-garden');
    const organic = allCategories.find((c) => c.slug === 'organic-essentials');

    // Create vendors
    const vendor1 = await this.prisma.vendor.create({
      data: {
        userId: vendor1User.id,
        shopName: 'Rahim Electronics',
        slug: 'rahim-electronics',
        description: 'Best electronics shop in Dhaka with genuine products',
        logo: '/assets/vendor/logo1.png',
        banner: '/assets/vendor/banner1.png',
        address: '123 Elephant Road, Dhaka',
        city: 'Dhaka',
        phone: '+880171234567',
        email: 'rahim@vendor.com',
        commissionRate: 10,
        bankName: 'Dutch-Bangla Bank',
        bankAccount: '1234567890',
        bankBranch: 'Elephant Road',
        status: 'APPROVED',
        totalProducts: 3,
      },
    });

    const vendor2 = await this.prisma.vendor.create({
      data: {
        userId: vendor2User.id,
        shopName: 'Karim Fashion House',
        slug: 'karim-fashion-house',
        description: 'Trendy fashion at affordable prices',
        logo: '/assets/vendor/logo2.png',
        banner: '/assets/vendor/banner2.png',
        address: '45 New Market, Dhaka',
        city: 'Dhaka',
        phone: '+880181234567',
        email: 'karim@vendor.com',
        commissionRate: 12,
        bankName: 'BRAC Bank',
        bankAccount: '0987654321',
        bankBranch: 'New Market',
        status: 'APPROVED',
        totalProducts: 2,
      },
    });

    const vendor3 = await this.prisma.vendor.create({
      data: {
        userId: vendor3User.id,
        shopName: 'Organic BD',
        slug: 'organic-bd',
        description: 'Pure organic products from local farmers',
        logo: '/assets/vendor/logo3.png',
        banner: '/assets/vendor/banner3.png',
        address: '78 Rajshahi Road',
        city: 'Rajshahi',
        phone: '+880191234567',
        email: 'organic@vendor.com',
        commissionRate: 8,
        bankName: 'Sonali Bank',
        bankAccount: '5678901234',
        bankBranch: 'Rajshahi',
        status: 'APPROVED',
        totalProducts: 3,
      },
    });

    // Create products with vendor associations
    const product1 = await this.prisma.product.create({
      data: {
        name: 'Wireless Bluetooth Headphones',
        description:
          'High quality wireless headphones with noise cancellation and 20hr battery life',
        price: 89.99,
        oldPrice: 120.0,
        image: '/assets/products/headphones.jpg',
        images: [],
        brand: 'SoundMax',
        size: 'One Size',
        color: 'Black',
        shippedFrom: 'Dhaka',
        warranty: 'Brand Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale', 'Free Delivery'],
        categoryId: electronics!.id,
        vendorId: vendor1.id,
        isActive: true,
        stockQuantity: 50,
        rating: 4.5,
        hasVariants: true,
      },
    });

    // Add variants for headphones
    await this.prisma.productVariant.createMany({
      data: [
        {
          productId: product1.id,
          sku: 'HP-BLK-001',
          name: 'Black',
          variantAttributes: { color: 'Black' },
          price: 89.99,
          stock: 25,
          status: 'ACTIVE',
        },
        {
          productId: product1.id,
          sku: 'HP-WHT-001',
          name: 'White',
          variantAttributes: { color: 'White' },
          price: 89.99,
          stock: 15,
          status: 'ACTIVE',
        },
        {
          productId: product1.id,
          sku: 'HP-RED-001',
          name: 'Red',
          variantAttributes: { color: 'Red' },
          price: 94.99,
          stock: 10,
          status: 'ACTIVE',
        },
      ],
    });

    const product2 = await this.prisma.product.create({
      data: {
        name: 'Smartphone XYZ Pro',
        description:
          'Latest smartphone with advanced camera system and fast charging',
        price: 699.99,
        oldPrice: 799.99,
        image: '/assets/products/smartphone.jpg',
        images: [],
        brand: 'TechCorp',
        size: '6.1 inch',
        color: 'Space Gray',
        shippedFrom: 'Dhaka',
        warranty: 'Brand Warranty',
        deliveryOption: true,
        promotions: ['Free Delivery'],
        categoryId: electronics!.id,
        vendorId: vendor1.id,
        isActive: true,
        stockQuantity: 30,
        rating: 4.8,
        hasVariants: true,
      },
    });

    await this.prisma.productVariant.createMany({
      data: [
        {
          productId: product2.id,
          sku: 'SP-128-GRAY',
          name: '128GB Space Gray',
          variantAttributes: { color: 'Space Gray', storage: '128GB' },
          price: 699.99,
          stock: 15,
          status: 'ACTIVE',
        },
        {
          productId: product2.id,
          sku: 'SP-256-GRAY',
          name: '256GB Space Gray',
          variantAttributes: { color: 'Space Gray', storage: '256GB' },
          price: 799.99,
          stock: 10,
          status: 'ACTIVE',
        },
        {
          productId: product2.id,
          sku: 'SP-128-BLUE',
          name: '128GB Blue',
          variantAttributes: { color: 'Blue', storage: '128GB' },
          price: 699.99,
          stock: 5,
          status: 'ACTIVE',
        },
      ],
    });

    const product3 = await this.prisma.product.create({
      data: {
        name: 'Smart Watch Ultra',
        description: 'Premium smartwatch with health tracking',
        price: 149.99,
        oldPrice: 199.99,
        image: '/assets/products/smartwatch.jpg',
        images: [],
        brand: 'TechWear',
        size: 'One Size',
        color: 'Silver',
        shippedFrom: 'Dhaka',
        warranty: 'Brand Warranty',
        deliveryOption: false,
        promotions: ['Flash Sale'],
        categoryId: electronics!.id,
        vendorId: vendor1.id,
        isActive: true,
        stockQuantity: 25,
        rating: 4.7,
      },
    });

    const product4 = await this.prisma.product.create({
      data: {
        name: 'Premium Cotton T-Shirt',
        description: '100% cotton premium quality t-shirt',
        price: 19.99,
        oldPrice: 29.99,
        image: '/assets/products/tshirt.jpg',
        images: [],
        brand: 'FashionBD',
        size: 'M',
        color: 'Navy',
        shippedFrom: 'Dhaka',
        warranty: 'No Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale'],
        categoryId: fashion!.id,
        vendorId: vendor2.id,
        isActive: true,
        stockQuantity: 100,
        rating: 4.3,
        hasVariants: true,
      },
    });

    await this.prisma.productVariant.createMany({
      data: [
        {
          productId: product4.id,
          sku: 'TS-Navy-S',
          name: 'Navy - Small',
          variantAttributes: { color: 'Navy', size: 'S' },
          price: 19.99,
          stock: 25,
          status: 'ACTIVE',
        },
        {
          productId: product4.id,
          sku: 'TS-Navy-M',
          name: 'Navy - Medium',
          variantAttributes: { color: 'Navy', size: 'M' },
          price: 19.99,
          stock: 30,
          status: 'ACTIVE',
        },
        {
          productId: product4.id,
          sku: 'TS-Navy-L',
          name: 'Navy - Large',
          variantAttributes: { color: 'Navy', size: 'L' },
          price: 19.99,
          stock: 25,
          status: 'ACTIVE',
        },
        {
          productId: product4.id,
          sku: 'TS-Navy-XL',
          name: 'Navy - XL',
          variantAttributes: { color: 'Navy', size: 'XL' },
          price: 21.99,
          stock: 20,
          status: 'ACTIVE',
        },
        {
          productId: product4.id,
          sku: 'TS-White-M',
          name: 'White - Medium',
          variantAttributes: { color: 'White', size: 'M' },
          price: 19.99,
          stock: 15,
          status: 'ACTIVE',
        },
      ],
    });

    const product5 = await this.prisma.product.create({
      data: {
        name: 'Running Shoes Pro',
        description: 'Comfortable running shoes for daily exercise',
        price: 79.99,
        oldPrice: 99.99,
        image: '/assets/products/shoes.jpg',
        images: [],
        brand: 'FootFit',
        size: 'US 9',
        color: 'Blue',
        shippedFrom: 'Chittagong',
        warranty: 'Seller Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale'],
        categoryId: sports!.id,
        vendorId: vendor2.id,
        isActive: true,
        stockQuantity: 40,
        rating: 4.3,
        hasVariants: true,
      },
    });

    await this.prisma.productVariant.createMany({
      data: [
        {
          productId: product5.id,
          sku: 'RS-BLU-9',
          name: 'Blue - US 9',
          variantAttributes: { color: 'Blue', size: 'US 9' },
          price: 79.99,
          stock: 15,
          status: 'ACTIVE',
        },
        {
          productId: product5.id,
          sku: 'RS-BLU-10',
          name: 'Blue - US 10',
          variantAttributes: { color: 'Blue', size: 'US 10' },
          price: 79.99,
          stock: 10,
          status: 'ACTIVE',
        },
        {
          productId: product5.id,
          sku: 'RS-BLK-9',
          name: 'Black - US 9',
          variantAttributes: { color: 'Black', size: 'US 9' },
          price: 79.99,
          stock: 15,
          status: 'ACTIVE',
        },
      ],
    });

    const product6 = await this.prisma.product.create({
      data: {
        name: 'Organic Mustard Oil',
        description: 'Pure cold-pressed organic mustard oil from local farms',
        price: 12.99,
        oldPrice: 15.99,
        image: '/assets/products/mustard-oil.jpg',
        images: [],
        brand: 'DeshOrganic',
        size: '1L',
        color: 'Yellow',
        shippedFrom: 'Rajshahi',
        warranty: 'No Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale'],
        categoryId: organic!.id,
        vendorId: vendor3.id,
        isActive: true,
        stockQuantity: 100,
        rating: 4.6,
        hasVariants: true,
      },
    });

    await this.prisma.productVariant.createMany({
      data: [
        {
          productId: product6.id,
          sku: 'MO-500ML',
          name: '500ml Bottle',
          variantAttributes: { size: '500ml' },
          price: 7.99,
          stock: 50,
          status: 'ACTIVE',
        },
        {
          productId: product6.id,
          sku: 'MO-1L',
          name: '1L Bottle',
          variantAttributes: { size: '1L' },
          price: 12.99,
          stock: 30,
          status: 'ACTIVE',
        },
        {
          productId: product6.id,
          sku: 'MO-2L',
          name: '2L Bottle',
          variantAttributes: { size: '2L' },
          price: 22.99,
          stock: 20,
          status: 'ACTIVE',
        },
      ],
    });

    const product7 = await this.prisma.product.create({
      data: {
        name: 'Pure Cow Ghee',
        description: 'Organic pure cow ghee for cooking',
        price: 18.99,
        oldPrice: 22.99,
        image: '/assets/products/ghee.jpg',
        images: [],
        brand: 'DeshOrganic',
        size: '500g',
        color: 'Golden',
        shippedFrom: 'Rajshahi',
        warranty: 'No Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale', 'Free Delivery'],
        categoryId: organic!.id,
        vendorId: vendor3.id,
        isActive: true,
        stockQuantity: 80,
        rating: 4.8,
      },
    });

    const product8 = await this.prisma.product.create({
      data: {
        name: 'Premium Dates',
        description: 'Sweet and chewy premium Medjool dates',
        price: 9.99,
        oldPrice: 12.99,
        image: '/assets/products/dates.jpg',
        images: [],
        brand: 'DeshOrganic',
        size: '500g',
        color: 'Brown',
        shippedFrom: 'Dhaka',
        warranty: 'No Warranty',
        deliveryOption: true,
        promotions: ['Flash Sale'],
        categoryId: organic!.id,
        vendorId: vendor3.id,
        isActive: true,
        stockQuantity: 120,
        rating: 4.4,
      },
    });

    // Create flash sale
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 7);

    const flashSale = await this.prisma.flashSale.create({
      data: {
        title: 'Summer Flash Sale',
        startDate: now,
        endDate,
        isActive: true,
      },
    });

    const allProducts = await this.prisma.product.findMany();
    const flashSaleProducts = allProducts.filter((p) =>
      p.promotions.includes('Flash Sale'),
    );

    for (const product of flashSaleProducts) {
      const discountPrice = Number(product.price) * 0.75;
      await this.prisma.flashSaleProduct.create({
        data: {
          flashSaleId: flashSale.id,
          productId: product.id,
          discountPrice,
          discountPercent: 25,
        },
      });
    }

    // Create sample ratings
    await this.prisma.rating.createMany({
      data: [
        {
          userId: user.id,
          productId: product1.id,
          vendorId: vendor1.id,
          rating: 5,
          title: 'Great headphones!',
          comment: 'Amazing sound quality and battery life.',
          verified: true,
          approved: true,
        },
        {
          userId: user.id,
          productId: product2.id,
          vendorId: vendor1.id,
          rating: 4,
          title: 'Good phone',
          comment: 'Camera is excellent but battery could be better.',
          verified: true,
          approved: true,
        },
        {
          userId: user.id,
          productId: product6.id,
          vendorId: vendor3.id,
          rating: 5,
          title: 'Pure quality!',
          comment: 'Best mustard oil I have ever used.',
          verified: true,
          approved: true,
        },
      ],
    });

    // Create sample order with vendor items
    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: 'ORD-20251020-001',
        totalAmount: 169.98,
        deliveryCharge: 70,
        status: 'DELIVERED',
        shippingAddress: '123 Main Street, Dhaka, Bangladesh',
        billingAddress: '123 Main Street, Dhaka, Bangladesh',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'paid',
        shippedAt: new Date(),
        deliveredAt: new Date(),
        orderItems: {
          create: [
            {
              productId: product1.id,
              vendorId: vendor1.id,
              productName: product1.name,
              productImage: product1.image,
              price: product1.price,
              quantity: 1,
              total: product1.price,
              commissionRate: vendor1.commissionRate,
              commissionAmt:
                (Number(product1.price) * Number(vendor1.commissionRate)) / 100,
              vendorEarning:
                Number(product1.price) *
                (1 - Number(vendor1.commissionRate) / 100),
              itemStatus: 'DELIVERED',
            },
            {
              productId: product6.id,
              vendorId: vendor3.id,
              productName: product6.name,
              productImage: product6.image,
              price: product6.price,
              quantity: 1,
              total: product6.price,
              commissionRate: vendor3.commissionRate,
              commissionAmt:
                (Number(product6.price) * Number(vendor3.commissionRate)) / 100,
              vendorEarning:
                Number(product6.price) *
                (1 - Number(vendor3.commissionRate) / 100),
              itemStatus: 'DELIVERED',
            },
          ],
        },
      },
    });

    // Create a pending order
    await this.prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: 'ORD-20251021-002',
        totalAmount: 719.98,
        deliveryCharge: 70,
        status: 'PENDING',
        shippingAddress: '45 Banani, Dhaka, Bangladesh',
        billingAddress: '45 Banani, Dhaka, Bangladesh',
        paymentMethod: 'bKash',
        paymentStatus: 'pending',
        orderItems: {
          create: [
            {
              productId: product2.id,
              vendorId: vendor1.id,
              productName: product2.name,
              productImage: product2.image,
              price: product2.price,
              quantity: 1,
              total: product2.price,
              commissionRate: vendor1.commissionRate,
              commissionAmt:
                (Number(product2.price) * Number(vendor1.commissionRate)) / 100,
              vendorEarning:
                Number(product2.price) *
                (1 - Number(vendor1.commissionRate) / 100),
              itemStatus: 'PENDING',
            },
            {
              productId: product4.id,
              vendorId: vendor2.id,
              productName: product4.name,
              productImage: product4.image,
              price: product4.price,
              quantity: 1,
              total: product4.price,
              commissionRate: vendor2.commissionRate,
              commissionAmt:
                (Number(product4.price) * Number(vendor2.commissionRate)) / 100,
              vendorEarning:
                Number(product4.price) *
                (1 - Number(vendor2.commissionRate) / 100),
              itemStatus: 'PENDING',
            },
          ],
        },
      },
    });

    console.log('Database seeded successfully!');
    console.log('Admin: admin@deshbazaar.com / admin123');
    console.log('User: user@example.com / password123');
    console.log('Vendor 1: rahim@vendor.com / vendor123 (Rahim Electronics)');
    console.log('Vendor 2: karim@vendor.com / vendor123 (Karim Fashion House)');
    console.log('Vendor 3: organic@vendor.com / vendor123 (Organic BD)');
  }
}
