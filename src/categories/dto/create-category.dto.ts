import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Electronics" })
  @IsString()
  name: string;

  @ApiProperty({ example: "electronics" })
  @IsString()
  slug: string;

  @ApiProperty({
    example: "Electronic devices and accessories",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "/assets/category/01.png", required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sort_order: number;
}
