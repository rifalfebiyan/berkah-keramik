import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { categoryId?: number; subcategoryId?: number; brandId?: number; minPrice?: number; maxPrice?: number }) {
        return this.prisma.product.findMany({
            where: {
                categoryId: filters?.categoryId,
                subcategoryId: filters?.subcategoryId,
                brandId: filters?.brandId,
                price: {
                    gte: filters?.minPrice,
                    lte: filters?.maxPrice,
                },
            },
            include: { category: true, brand: true, subcategory: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true, brand: true, subcategory: true },
        });
    }

    async create(data: any) {
        return this.prisma.product.create({ data });
    }

    async update(id: number, data: any) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.product.delete({ where: { id } });
    }
}
