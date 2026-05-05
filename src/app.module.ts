import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { RatingsModule } from "./ratings/ratings.module";
import { FlashSalesModule } from "./flash-sales/flash-sales.module";
import { AdminModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SeedModule } from "./seed/seed.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    WishlistModule,
    RatingsModule,
    FlashSalesModule,
    AdminModule,
    SeedModule,
  ],
})
export class AppModule {}
