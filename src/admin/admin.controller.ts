import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { OrdersService } from '../orders/orders.service';
import { RatingsService } from '../ratings/ratings.service';
import { VendorService } from '../vendor/vendor.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private ordersService: OrdersService,
    private ratingsService: RatingsService,
    private vendorService: VendorService,
  ) {}

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('categories')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Get('products')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Get('orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Put('orders/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateOrder(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }

  @Get('flash-sales')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllFlashSales() {
    return this.adminService.getAllFlashSales();
  }

  @Get('ratings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllRatings() {
    return this.adminService.getAllRatings();
  }

  @Post('ratings/:id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  approveRating(@Param('id') id: string) {
    return this.ratingsService.approve(+id);
  }

  @Post('ratings/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  rejectRating(@Param('id') id: string) {
    return this.ratingsService.reject(+id);
  }

  // ─── Vendor Management ──────────────────────────

  @Get('vendors')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllVendors(
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
    @Query('status') status?: string,
  ) {
    return this.vendorService.findAll(
      page ? +page : 1,
      perPage ? +perPage : 20,
      status,
    );
  }

  @Get('vendors/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getVendorById(@Param('id') id: string) {
    return this.vendorService.findById(+id);
  }

  @Post('vendors/:id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  approveVendor(@Param('id') id: string) {
    return this.vendorService.approve(+id);
  }

  @Post('vendors/:id/suspend')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  suspendVendor(@Param('id') id: string) {
    return this.vendorService.suspend(+id);
  }

  @Post('vendors/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  rejectVendor(@Param('id') id: string) {
    return this.vendorService.reject(+id);
  }
}
