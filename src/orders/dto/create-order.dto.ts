import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray } from "class-validator";

class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsString()
  product_name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  total: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  total_amount: number;

  @ApiProperty()
  @IsString()
  shipping_address: string;

  @ApiProperty()
  @IsString()
  billing_address: string;

  @ApiProperty()
  @IsString()
  payment_method: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  items: OrderItemDto[];
}
