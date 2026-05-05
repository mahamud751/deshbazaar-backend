import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from './dto/variant.dto';

@ApiTags('Products')
@Controller()
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private variantsService: ProductVariantsService,
  ) {}

  @Get('products')
  findAll(
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
    @Query('vendor_id') vendorId?: string,
  ) {
    return this.productsService.findAll(
      page ? +page : 1,
      perPage ? +perPage : 100,
      vendorId ? +vendorId : undefined,
    );
  }

  @Get('products/:id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(+id);
  }

  @Get('categories/:categoryId/products')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(+categoryId);
  }

  @Get('category/:categoryName/products')
  findByCategoryName(@Param('categoryName') categoryName: string) {
    return this.productsService.findByCategoryName(categoryName);
  }

  @Get('flash-sale-products')
  findFlashSaleProducts() {
    return this.productsService.findFlashSaleProducts();
  }

  @Get('products-filtered')
  filter(
    @Query('category_id') categoryId?: string,
    @Query('category_slug') categorySlug?: string,
    @Query('search') search?: string,
    @Query('brand') brand?: string,
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
    @Query('sort') sort?: string,
    @Query('vendor_id') vendorId?: string,
  ) {
    return this.productsService.filter({
      category_id: categoryId ? +categoryId : undefined,
      category_slug: categorySlug,
      search,
      brand,
      min_price: minPrice ? +minPrice : undefined,
      max_price: maxPrice ? +maxPrice : undefined,
      sort,
      vendor_id: vendorId ? +vendorId : undefined,
    });
  }

  @Post('products')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Request() req, @Body() dto: CreateProductDto) {
    return this.productsService.create(dto, req.user.id);
  }

  @Put('products/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.update(+id, dto);
  }

  @Delete('products/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }

  // ─── Product Variant Endpoints ───────────────────

  @Get('products/:productId/variants')
  getVariants(@Param('productId') productId: string) {
    return this.variantsService.findByProduct(+productId);
  }

  @Post('products/:productId/variants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  createVariant(
    @Param('productId') productId: string,
    @Body() dto: CreateProductVariantDto,
  ) {
    return this.variantsService.create(+productId, dto);
  }

  @Put('products/:productId/variants/:variantId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.variantsService.update(+variantId, dto);
  }

  @Delete('products/:productId/variants/:variantId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  deleteVariant(@Param('variantId') variantId: string) {
    return this.variantsService.delete(+variantId);
  }
}
