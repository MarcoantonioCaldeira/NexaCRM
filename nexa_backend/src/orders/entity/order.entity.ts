import { Product } from '../../products/entity/product.entity';

export class Order {
  id: number;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}