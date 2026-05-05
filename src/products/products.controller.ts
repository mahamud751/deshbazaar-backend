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
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";

@ApiTags("Products")
@Controller()
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("products")
  findAll(@Query("page") page?: string, @Query("per_page") perPage?: string) {
    return this.productsService.findAll(
      page ? +page : 1,
      perPage ? +perPage : 100,
    );
  }

  @Get("products/:id")
  findById(@Param("id") id: string) {
    return this.productsService.findById(+id);
  }

  @Get("categories/:categoryId/products")
  findByCategory(@Param("categoryId") categoryId: string) {
    return this.productsService.findByCategory(+categoryId);
  }

  @Get("category/:categoryName/products")
  findByCategoryName(@Param("categoryName") categoryName: string) {
    return this.productsService.findByCategoryName(categoryName);
  }

  @Get("flash-sale-products")
  findFlashSaleProducts() {
    return this.productsService.findFlashSaleProducts();
  }

  @Get("products-filtered")
  filter(
    @Query("category_id") categoryId?: string,
    @Query("category_slug") categorySlug?: string,
    @Query("search") search?: string,
    @Query("brand") brand?: string,
    @Query("min_price") minPrice?: string,
    @Query("max_price") maxPrice?: string,
    @Query("sort") sort?: string,
  ) {
    return this.productsService.filter({
      category_id: categoryId ? +categoryId : undefined,
      category_slug: categorySlug,
      search,
      brand,
      min_price: minPrice ? +minPrice : undefined,
      max_price: maxPrice ? +maxPrice : undefined,
      sort,
    });
  }

  @Post("products")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put("products/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.update(+id, dto);
  }

  @Delete("products/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  delete(@Param("id") id: string) {
    return this.productsService.delete(+id);
  }
}
