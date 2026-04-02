import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            include: { products: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.category.findUnique({
            where: { id },
            include: { 
                products: true,
                subcategories: true 
            },
        });
    }

    async create(data: any) {
        return this.prisma.category.create({ data });
    }

    async update(id: number, data: any) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.category.delete({ where: { id } });
    }
}
