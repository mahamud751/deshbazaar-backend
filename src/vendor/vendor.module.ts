import { Module } from '@nestjs/common';
import { VendorController, VendorsPublicController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  controllers: [VendorController, VendorsPublicController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
