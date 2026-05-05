import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { WishlistService } from "./wishlist.service";

@ApiTags("Wishlist")
@Controller()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post("wishlists")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  add(@Body() body: { user_id: number; product_id: number }) {
    return this.wishlistService.add(body.user_id, body.product_id);
  }

  @Delete("wishlists/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.wishlistService.remove(+id);
  }

  @Get("wishlist-check")
  check(
    @Query("user_id") userId: string,
    @Query("product_id") productId: string,
  ) {
    return this.wishlistCheck(+userId, +productId);
  }

  async wishlistCheck(userId: number, productId: number) {
    return this.wishlistService.check(userId, productId);
  }

  @Post("wishlist-toggle")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  toggle(@Body() body: { user_id: number; product_id: number }) {
    return this.wishlistService.toggle(body.user_id, body.product_id);
  }

  @Get("user/wishlist")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  getUserWishlist(@Request() req) {
    return this.wishlistService.findByUser(req.user.id);
  }
}
