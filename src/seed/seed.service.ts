import { Injectable, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Check if already seeded
    const existingUsers = await this.prisma.user.count();
    if (existingUsers > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await this.prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@deshbazaar.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // Create sample user
    const userPassword = await bcrypt.hash("password123", 10);
    const user = await this.prisma.user.create({
      data: {
        name: "John Doe",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    });

    // Create categories
    const categories = await this.prisma.category.createMany({
      data: [
        {
          name: "Electronics",
          slug: "electronics",
          description: "Electronic devices and accessories",
          image: "/assets/category/01.png",
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "Fashion",
          slug: "fashion",
          description: "Clothing and fashion accessories",
          image: "/assets/category/02.jpg",
          isActive: true,
          sortOrder: 2,
        },
        {
          name: "Home & Garden",
          slug: "home-garden",
          description: "Home improvement and garden supplies",
          image: "/assets/category/03.jpg",
          isActive: true,
          sortOrder: 3,
        },
        {
          name: "Sports",
          slug: "sports",
          description: "Sports equipment and accessories",
          image: "/assets/category/04.jpg",
          isActive: true,
          sortOrder: 4,
        },
        {
          name: "Beauty",
          slug: "beauty",
          description: "Beauty and personal care products",
          image: "/assets/category/05.jpg",
          isActive: true,
          sortOrder: 5,
        },
        {
          name: "Books",
          slug: "books",
          description: "Books and educational materials",
          image: "/assets/category/06.jpg",
          isActive: true,
          sortOrder: 6,
        },
        {
          name: "Organic Essentials",
          slug: "organic-essentials",
          description: "Organic food and essentials",
          image: "/assets/category/07.jpg",
          isActive: true,
          sortOrder: 7,
        },
        {
          name: "Healthy Recipes",
          slug: "healthy-recipes",
          description: "Healthy cooking ingredients",
          image: "/assets/category/08.jpg",
          isActive: true,
          sortOrder: 8,
        },
      ],
    });

    const allCategories = await this.prisma.category.findMany();

    // Create products
    const electronics = allCategories.find((c) => c.slug === "electronics");
    const fashion = allCategories.find((c) => c.slug === "fashion");
    const sports = allCategories.find((c) => c.slug === "sports");
    const homeGarden = allCategories.find((c) => c.slug === "home-garden");
    const organic = allCategories.find((c) => c.slug === "organic-essentials");

    const products = await this.prisma.product.createMany({
      data: [
        {
          name: "Wireless Bluetooth Headphones",
          description:
            "High quality wireless headphones with noise cancellation",
          price: 89.99,
          oldPrice: 120.0,
          image: "/assets/products/headphones.jpg",
          brand: "SoundMax",
          size: "One Size",
          color: "Black",
          shippedFrom: "Dhaka",
          warranty: "Brand Warranty",
          deliveryOption: true,
          promotions: ["Flash Sale", "Free Delivery"],
          categoryId: electronics!.id,
          isActive: true,
          stockQuantity: 50,
          rating: 4.5,
        },
        {
          name: "Smartphone XYZ Pro",
          description: "Latest smartphone with advanced camera system",
          price: 699.99,
          oldPrice: 799.99,
          image: "/assets/products/smartphone.jpg",
          brand: "TechCorp",
          size: "6.1 inch",
          color: "Space Gray",
          shippedFrom: "Dhaka",
          warranty: "Brand Warranty",
          deliveryOption: true,
          promotions: ["Free Delivery"],
          categoryId: electronics!.id,
          isActive: true,
          stockQuantity: 30,
          rating: 4.8,
        },
        {
          name: "Running Shoes",
          description: "Comfortable running shoes for daily exercise",
          price: 79.99,
          oldPrice: 99.99,
          image: "/assets/products/shoes.jpg",
          brand: "FootFit",
          size: "US 9",
          color: "Blue",
          shippedFrom: "Chittagong",
          warranty: "Seller Warranty",
          deliveryOption: true,
          promotions: ["Flash Sale"],
          categoryId: sports!.id,
          isActive: true,
          stockQuantity: 40,
          rating: 4.3,
        },
        {
          name: "Smart Watch",
          description: "Fitness tracking smartwatch with heart rate monitor",
          price: 149.99,
          oldPrice: 199.99,
          image: "/assets/products/smartwatch.jpg",
          brand: "TechWear",
          size: "One Size",
          color: "Silver",
          shippedFrom: "Sylhet",
          warranty: "Brand Warranty",
          deliveryOption: false,
          promotions: ["Flash Sale"],
          categoryId: electronics!.id,
          isActive: true,
          stockQuantity: 25,
          rating: 4.7,
        },
        {
          name: "Coffee Maker",
          description: "Automatic drip coffee maker with timer",
          price: 49.99,
          oldPrice: 69.99,
          image: "/assets/products/coffeemaker.jpg",
          brand: "HomeBrew",
          size: "Medium",
          color: "Black",
          shippedFrom: "Dhaka",
          warranty: "Seller Warranty",
          deliveryOption: true,
          promotions: ["Free Delivery"],
          categoryId: homeGarden!.id,
          isActive: true,
          stockQuantity: 20,
          rating: 4.2,
        },
        {
          name: "Organic Mustard Oil",
          description: "Pure cold-pressed organic mustard oil",
          price: 12.99,
          oldPrice: 15.99,
          image: "/assets/products/mustard-oil.jpg",
          brand: "DeshOrganic",
          size: "1L",
          color: "Yellow",
          shippedFrom: "Rajshahi",
          warranty: "No Warranty",
          deliveryOption: true,
          promotions: ["Flash Sale"],
          categoryId: organic!.id,
          isActive: true,
          stockQuantity: 100,
          rating: 4.6,
        },
        {
          name: "Pure Cow Ghee",
          description: "Organic pure cow ghee for cooking",
          price: 18.99,
          oldPrice: 22.99,
          image: "/assets/products/ghee.jpg",
          brand: "DeshOrganic",
          size: "500g",
          color: "Golden",
          shippedFrom: "Rajshahi",
          warranty: "No Warranty",
          deliveryOption: true,
          promotions: ["Flash Sale", "Free Delivery"],
          categoryId: organic!.id,
          isActive: true,
          stockQuantity: 80,
          rating: 4.8,
        },
        {
          name: "Premium Dates",
          description: "Sweet and chewy premium dates",
          price: 9.99,
          oldPrice: 12.99,
          image: "/assets/products/dates.jpg",
          brand: "DeshOrganic",
          size: "500g",
          color: "Brown",
          shippedFrom: "Dhaka",
          warranty: "No Warranty",
          deliveryOption: true,
          promotions: ["Flash Sale"],
          categoryId: organic!.id,
          isActive: true,
          stockQuantity: 120,
          rating: 4.4,
        },
      ],
    });

    const allProducts = await this.prisma.product.findMany();

    // Create flash sale
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 7);

    const flashSale = await this.prisma.flashSale.create({
      data: {
        title: "Summer Flash Sale",
        startDate: now,
        endDate,
        isActive: true,
      },
    });

    // Add products to flash sale
    const flashSaleProducts = allProducts.filter((p) =>
      p.promotions.includes("Flash Sale"),
    );

    for (const product of flashSaleProducts) {
      const discountPrice = Number(product.price) * 0.75; // 25% off
      const discountPercent = 25;
      await this.prisma.flashSaleProduct.create({
        data: {
          flashSaleId: flashSale.id,
          productId: product.id,
          discountPrice,
          discountPercent,
        },
      });
    }

    // Create sample ratings
    await this.prisma.rating.createMany({
      data: [
        {
          userId: user.id,
          productId: allProducts[0].id,
          rating: 5,
          title: "Great headphones!",
          comment: "Amazing sound quality and battery life.",
          verified: true,
          approved: true,
        },
        {
          userId: user.id,
          productId: allProducts[1].id,
          rating: 4,
          title: "Good phone",
          comment: "Camera is excellent but battery could be better.",
          verified: true,
          approved: true,
        },
      ],
    });

    // Create sample order
    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: "ORD-20251020-001",
        totalAmount: 169.98,
        deliveryCharge: 70,
        status: "DELIVERED",
        shippingAddress: "123 Main Street, Dhaka, Bangladesh",
        billingAddress: "123 Main Street, Dhaka, Bangladesh",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "paid",
        shippedAt: new Date(),
        deliveredAt: new Date(),
        orderItems: {
          create: [
            {
              productId: allProducts[0].id,
              productName: allProducts[0].name,
              price: allProducts[0].price,
              quantity: 1,
              total: allProducts[0].price,
            },
            {
              productId: allProducts[2].id,
              productName: allProducts[2].name,
              price: allProducts[2].price,
              quantity: 1,
              total: allProducts[2].price,
            },
          ],
        },
      },
    });

    console.log("Database seeded successfully!");
    console.log("Admin: admin@deshbazaar.com / admin123");
    console.log("User: user@example.com / password123");
  }
}
