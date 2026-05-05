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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query("slug") slug?: string) {
    if (slug) {
      return this.categoriesService.findBySlug(slug);
    }
    return this.categoriesService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.categoriesService.findById(+id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() dto: Partial<CreateCategoryDto>) {
    return this.categoriesService.update(+id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  delete(@Param("id") id: string) {
    return this.categoriesService.delete(+id);
  }
}
