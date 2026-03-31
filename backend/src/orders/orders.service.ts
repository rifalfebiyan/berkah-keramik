import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: any) {
    const { customer, phone, address, total, status, date, items } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          customer,
          phone,
          address,
          total,
          status,
          date,
          items: {
            create: items.map((item: any) => ({
              productName: item.productName,
              pricePerUnit: item.pricePerUnit,
              quantity: item.quantity,
              total: item.total,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Deduct stock for each item
      for (const item of items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
              sold: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });
  }
}
