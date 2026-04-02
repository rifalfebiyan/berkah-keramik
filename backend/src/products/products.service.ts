import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { categoryId?: number; subcategoryId?: number; brandId?: number; minPrice?: number; maxPrice?: number; search?: string; sort?: string }) {
        let orderBy: any = { createdAt: 'desc' }; // Default newest

        if (filters?.sort === 'price_asc') {
            orderBy = { price: 'asc' };
        } else if (filters?.sort === 'price_desc') {
            orderBy = { price: 'desc' };
        } else if (filters?.sort === 'relevance') {
            orderBy = { id: 'desc' }; // Simple relevance fallback
        } else if (filters?.sort === 'latest') {
            orderBy = { createdAt: 'desc' };
        }

        return this.prisma.product.findMany({
            where: {
                categoryId: filters?.categoryId,
                subcategoryId: filters?.subcategoryId,
                brandId: filters?.brandId,
                price: {
                    gte: filters?.minPrice,
                    lte: filters?.maxPrice,
                },
                OR: filters?.search ? [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                ] : undefined,
            },
            include: { category: true, brand: true, subcategory: true },
            orderBy,
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
