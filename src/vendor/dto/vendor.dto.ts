import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Desh Electronics' })
  @IsString()
  shop_name: string;

  @ApiProperty({ example: 'desh-electronics', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Best electronics shop in Dhaka', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '/assets/vendor/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '/assets/vendor/banner.png', required: false })
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty({ example: '123 Gulshan Ave, Dhaka', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Dhaka', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '+880171234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'vendor@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Dutch-Bangla Bank', required: false })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  bank_account?: string;

  @ApiProperty({ example: 'Gulshan Branch', required: false })
  @IsString()
  @IsOptional()
  bank_branch?: string;
}

export class UpdateVendorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shop_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bank_account?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bank_branch?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  commission_rate?: number;
}
