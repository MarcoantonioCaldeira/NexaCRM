import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto'; 
import { UpdateOrderDto } from '../dto/update-order.dto'
import { plainToInstance } from 'class-transformer'; 
import { Order } from '@prisma/client'; 

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const createdOrder = await this.prisma.order.create({
      data: {
        items: {
          create: createOrderDto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true } 
            }
          }
        }
      },
    });

    const calculatedTotalPrice = createdOrder.items.reduce((sum, currentItem) => {
      return sum + (currentItem.price * currentItem.quantity);
    }, 0);

    return plainToInstance(OrderResponseDto, {
      ...createdOrder,
      calculatedTotalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
    });
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id:id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true } 
            }
          }
        }
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }

    const calculatedTotalPrice = order.items.reduce((sum, currentItem) => {
      return sum + (currentItem.price * currentItem.quantity);
    }, 0);

    return plainToInstance(OrderResponseDto, {
      ...order,
      calculatedTotalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
    });
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            },
          },
        },
      },
    });

    return orders.map(order => {
      const calculatedTotalPrice = order.items.reduce((sum, currentItem) => {
        return sum + (currentItem.price * currentItem.quantity);
      }, 0);
      return plainToInstance(OrderResponseDto, {
        ...order,
        calculatedTotalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
      });
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: id },
    });
    if (!existingOrder) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado ou não pertence ao usuário.`);
    }

    // Transform items to Prisma format if present
    const { items, ...rest } = updateOrderDto;
    let prismaData: any = { ...rest };
    if (items) {
      prismaData.items = {
        deleteMany: {}, // Remove all existing items
        create: items.map(item => ({
          quantity: item.quantity,
        })),
      };
    }

    return this.prisma.order.update({
      where: { id: id },
      data: prismaData,
    });
  }

  async remove(id: number): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado ou não pertence ao usuário.`);
    }

    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id: id },
    });
  }
}