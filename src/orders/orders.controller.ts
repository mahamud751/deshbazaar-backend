import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@ApiTags("Orders")
@Controller()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post("orders")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get("user/orders")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  getUserOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get("user/orders/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  getOrderById(@Param("id") id: string, @Request() req) {
    return this.ordersService.findById(+id, req.user.id);
  }
}
