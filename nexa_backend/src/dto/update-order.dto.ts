import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';


export class UpdateOrderItemDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class UpdateOrderDto{
  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  items?: UpdateOrderItemDto[];
}