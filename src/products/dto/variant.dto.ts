import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ example: 'RED-XL-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Red - XL' })
  @IsString()
  name: string;

  @ApiProperty({ example: { color: 'Red', size: 'XL' } })
  @IsObject()
  variantAttributes: Record<string, string>;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 129.99, required: false })
  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: '/assets/products/variant-red.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 0.5, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;
}

export class UpdateProductVariantDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  variantAttributes?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;
}
