import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RatingsService } from "./ratings.service";
import { CreateRatingDto } from "./dto/create-rating.dto";

@ApiTags("Ratings")
@Controller()
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post("ratings")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  create(@Body() dto: CreateRatingDto) {
    return this.ratingsService.create(dto);
  }

  @Get("ratings")
  findByProduct(@Query("product_id") productId: string) {
    return this.ratingsService.findByProduct(+productId);
  }

  @Get("user/reviewable-products")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  getReviewableProducts(@Request() req) {
    return this.ratingsService.getReviewableProducts(req.user.id);
  }
}
