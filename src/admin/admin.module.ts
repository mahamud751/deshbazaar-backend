import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { OrdersService } from '../orders/orders.service';
import { RatingsService } from '../ratings/ratings.service';
import { VendorService } from '../vendor/vendor.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, OrdersService, RatingsService, VendorService],
})
export class AdminModule {}
