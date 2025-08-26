// src/orders/dto/update-order.dto.ts

import { IsOptional, IsString, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsNumber()
  id: number;
  
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class UpdateOrderItemDto {

  @Exclude() orderId: number;
  @Exclude() productId: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  totalPrice?: number; 

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}