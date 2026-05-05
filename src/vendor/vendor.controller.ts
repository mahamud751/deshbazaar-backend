import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';

@ApiTags('Vendor')
@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  // Register as vendor
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  register(@Request() req, @Body() dto: CreateVendorDto) {
    return this.vendorService.register(req.user.id, dto);
  }

  // Get current vendor profile
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.vendorService.findByUser(req.user.id);
  }

  // Update vendor profile
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateProfile(@Request() req, @Body() dto: UpdateVendorDto) {
    return this.vendorService.update(req.user.id, dto);
  }

  // Vendor dashboard stats
  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDashboard(@Request() req) {
    return this.vendorService.getDashboardStats(req.user.id);
  }

  // Vendor products
  @Get('products')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getProducts(
    @Request() req,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.vendorService.getVendorProducts(
      req.user.id,
      page ? +page : 1,
      perPage ? +perPage : 20,
    );
  }

  // Vendor orders
  @Get('orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getOrders(
    @Request() req,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.vendorService.getVendorOrders(
      req.user.id,
      status,
      page ? +page : 1,
      perPage ? +perPage : 20,
    );
  }

  // Update order item status (vendor ships/delivers)
  @Put('orders/:orderItemId/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateOrderItemStatus(
    @Request() req,
    @Param('orderItemId') orderItemId: string,
    @Body() body: { status: string },
  ) {
    return this.vendorService.updateOrderItemStatus(
      req.user.id,
      +orderItemId,
      body.status,
    );
  }

  // Vendor earnings
  @Get('earnings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getEarnings(@Request() req) {
    return this.vendorService.getVendorEarnings(req.user.id);
  }
}

@ApiTags('Vendors (Public)')
@Controller('vendors')
export class VendorsPublicController {
  constructor(private vendorService: VendorService) {}

  // Public: Get all approved vendors
  @Get()
  findAll(
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

  // Public: Get vendor by slug
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.vendorService.findBySlug(slug);
  }
}
