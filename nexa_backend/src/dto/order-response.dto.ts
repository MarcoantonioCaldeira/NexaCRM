import { Exclude, Expose, Type } from 'class-transformer';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: number;
  status: string;
  @Expose({ name: 'totalPrice' })
  totalPrice: number;
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}