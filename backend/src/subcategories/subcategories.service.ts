import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SubcategoryCreateInput) {
    return this.prisma.subcategory.create({
      data,
      include: { category: true },
    });
  }

  async findAll() {
    return this.prisma.subcategory.findMany({
      include: { category: true, products: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true, products: true },
    });
  }

  async update(id: number, data: Prisma.SubcategoryUpdateInput) {
    return this.prisma.subcategory.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: number) {
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }
}
