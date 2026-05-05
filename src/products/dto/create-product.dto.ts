import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Wireless Bluetooth Headphones" })
  @IsString()
  name: string;

  @ApiProperty({ example: "High quality wireless headphones", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 89.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 120.0, required: false })
  @IsNumber()
  @IsOptional()
  old_price?: number;

  @ApiProperty({ example: "/assets/products/headphones.jpg" })
  @IsString()
  image: string;

  @ApiProperty({ example: "SoundMax" })
  @IsString()
  brand: string;

  @ApiProperty({ example: "One Size", required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: "Black", required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: "Dhaka" })
  @IsString()
  shipped_from: string;

  @ApiProperty({ example: "Brand Warranty" })
  @IsString()
  warranty: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  delivery_option: boolean;

  @ApiProperty({ example: ["Flash Sale", "Free Delivery"], required: false })
  @IsArray()
  @IsOptional()
  promotions?: string[];

  @ApiProperty({
    example: [{ label: "Battery", value: "20 hours" }],
    required: false,
  })
  @IsOptional()
  specifications?: Array<{ label: string; value: string }>;

  @ApiProperty({ example: 1 })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock_quantity: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 25, required: false })
  @IsNumber()
  @IsOptional()
  flash_sale_discount?: number;
}
