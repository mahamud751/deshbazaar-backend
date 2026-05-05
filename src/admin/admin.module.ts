import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { OrdersService } from "../orders/orders.service";
import { RatingsService } from "../ratings/ratings.service";

@Module({
  controllers: [AdminController],
  providers: [AdminService, OrdersService, RatingsService],
})
export class AdminModule {}
